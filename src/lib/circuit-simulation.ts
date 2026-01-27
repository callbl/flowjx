import type { Node, Edge } from "@xyflow/react";
import { getCatalogEntry } from "@/circuit/catalog";
import type { TraversalContext } from "@/circuit/catalog/types";

/**
 * Finds connected components in the circuit.
 * Each component represents an isolated circuit that cannot affect other circuits.
 *
 * @param nodes - All nodes in the circuit
 * @param edges - All edges in the circuit
 * @returns Array of connected components, each containing a set of node IDs
 */
function findConnectedComponents(nodes: Node[], edges: Edge[]): Set<string>[] {
  // Build node-level adjacency list (not handle-specific)
  const nodeGraph = new Map<string, Set<string>>();

  nodes.forEach((node) => {
    nodeGraph.set(node.id, new Set());
  });

  edges.forEach((edge) => {
    nodeGraph.get(edge.source)?.add(edge.target);
    nodeGraph.get(edge.target)?.add(edge.source);
  });

  const visited = new Set<string>();
  const components: Set<string>[] = [];

  // DFS to find all nodes in a connected component
  function dfs(nodeId: string, component: Set<string>) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    component.add(nodeId);

    const neighbors = nodeGraph.get(nodeId) || new Set();
    neighbors.forEach((neighbor) => dfs(neighbor, component));
  }

  // Find all connected components
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const component = new Set<string>();
      dfs(node.id, component);
      if (component.size > 0) {
        components.push(component);
      }
    }
  });

  return components;
}

/**
 * Definition-driven circuit simulation engine using BFS graph traversal.
 *
 * Algorithm:
 * 1. Detect connected components (isolated circuits)
 * 2. For each component:
 *    a. Build adjacency graph from external edges (user wires)
 *    b. Inject internal edges from node electrical definitions
 *    c. For each battery, perform BFS from + to - terminal
 *    d. Track all nodes found in complete circuit paths
 * 3. Call deriveState on each node to compute updated state
 * 4. Return updated nodes
 *
 * This ensures separate circuits work independently and all node-specific
 * logic is defined in the catalog, not hard-coded in the engine.
 *
 * @param currentNodes - Array of circuit nodes
 * @param currentEdges - Array of circuit edges
 * @returns Updated nodes array with derived states
 */
export function simulateCircuit(
  currentNodes: Node[],
  currentEdges: Edge[],
): Node[] {
  // Find connected components - each represents an isolated circuit
  const components = findConnectedComponents(currentNodes, currentEdges);
  const allNodesInCompletePaths = new Set<string>();

  // Simulate each connected component independently
  components.forEach((componentNodeIds) => {
    // Filter nodes and edges for this component only
    const componentNodes = currentNodes.filter((node) =>
      componentNodeIds.has(node.id),
    );
    const componentEdges = currentEdges.filter(
      (edge) =>
        componentNodeIds.has(edge.source) && componentNodeIds.has(edge.target),
    );

    // Build adjacency list from external edges (user-created wires)
    const graph = new Map<
      string,
      Array<{ nodeId: string; handleId: string }>
    >();

    componentEdges.forEach((edge) => {
      const sourceKey = `${edge.source}:${edge.sourceHandle}`;
      const targetKey = `${edge.target}:${edge.targetHandle}`;

      if (!graph.has(sourceKey)) graph.set(sourceKey, []);
      if (!graph.has(targetKey)) graph.set(targetKey, []);

      // Bidirectional edges
      graph
        .get(sourceKey)!
        .push({ nodeId: edge.target, handleId: edge.targetHandle || "" });
      graph
        .get(targetKey)!
        .push({ nodeId: edge.source, handleId: edge.sourceHandle || "" });
    });

    // Inject internal edges from node electrical definitions
    componentNodes.forEach((node) => {
      if (!node.type) return;
      const catalogEntry = getCatalogEntry(node.type);
      if (!catalogEntry) return;

      const internalEdges = catalogEntry.electrical.internalEdges(
        node.id,
        node.data,
      );

      internalEdges.forEach((internalEdge) => {
        const fromKey = `${internalEdge.from.nodeId}:${internalEdge.from.handleId}`;
        const toKey = `${internalEdge.to.nodeId}:${internalEdge.to.handleId}`;

        if (!graph.has(fromKey)) graph.set(fromKey, []);
        if (!graph.has(toKey)) graph.set(toKey, []);

        // Add directional edge
        graph.get(fromKey)!.push({
          nodeId: internalEdge.to.nodeId,
          handleId: internalEdge.to.handleId,
        });
      });
    });

    // Find batteries in this component only
    const batteries = componentNodes.filter((n) => n.type === "battery");
    const nodesInCompletePaths = new Set<string>();

    // For each battery in this component, trace circuits from + to -
    batteries.forEach((battery) => {
      const visited = new Set<string>();
      const queue: Array<{
        nodeId: string;
        handleId: string;
        path: string[];
      }> = [];

      // Start from battery positive terminal
      queue.push({
        nodeId: battery.id,
        handleId: "plus",
        path: [battery.id],
      });

      while (queue.length > 0) {
        const current = queue.shift()!;
        const key = `${current.nodeId}:${current.handleId}`;

        if (visited.has(key)) continue;
        visited.add(key);

        // Check if we reached battery negative terminal - complete circuit!
        if (current.nodeId === battery.id && current.handleId === "minus") {
          // Mark all nodes in this path as part of a complete circuit
          current.path.forEach((nodeId) => {
            nodesInCompletePaths.add(nodeId);
          });
          continue;
        }

        // Explore neighbors from this handle
        const neighbors = graph.get(key) || [];
        neighbors.forEach((neighbor) => {
          const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
          if (!visited.has(neighborKey)) {
            // Add neighbor node to path if it's a different node
            const newPath =
              neighbor.nodeId !== current.nodeId
                ? [...current.path, neighbor.nodeId]
                : current.path;

            queue.push({
              nodeId: neighbor.nodeId,
              handleId: neighbor.handleId,
              path: newPath,
            });
          }
        });
      }
    });

    // Add this component's nodes in complete paths to global set
    nodesInCompletePaths.forEach((nodeId) =>
      allNodesInCompletePaths.add(nodeId),
    );
  });

  // Derive state for each node using its electrical definition
  let hasChanges = false;
  const updatedNodes = currentNodes.map((node) => {
    if (!node.type) return node;
    const catalogEntry = getCatalogEntry(node.type);
    if (!catalogEntry) return node;

    // Skip Arduino-controlled nodes to prevent circuit simulation from overriding Arduino control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((node.data as any)?.arduinoControlled) {
      return node;
    }

    // Build traversal context for this node
    const context: TraversalContext = {
      graph: new Map(), // Will be populated below
      nodesInCompletePaths: allNodesInCompletePaths,
      nodeId: node.id,
      nodeData: node.data,
    };

    // We need the full graph for deriveState to inspect connections
    // Build it from the current edges
    currentEdges.forEach((edge) => {
      const sourceKey = `${edge.source}:${edge.sourceHandle}`;
      const targetKey = `${edge.target}:${edge.targetHandle}`;

      if (!context.graph.has(sourceKey))
        context.graph.set(sourceKey, []);
      if (!context.graph.has(targetKey))
        context.graph.set(targetKey, []);

      context.graph
        .get(sourceKey)!
        .push({ nodeId: edge.target, handleId: edge.targetHandle || "" });
      context.graph
        .get(targetKey)!
        .push({ nodeId: edge.source, handleId: edge.sourceHandle || "" });
    });

    // Derive state updates
    const stateUpdates = catalogEntry.electrical.deriveState(context);

    if (!stateUpdates) {
      return node;
    }

    // Check if anything actually changed
    const hasNodeChanges = Object.keys(stateUpdates).some((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (stateUpdates as any)[key] !== (node.data as any)[key];
    });

    if (hasNodeChanges) {
      hasChanges = true;
      return {
        ...node,
        data: {
          ...node.data,
          ...stateUpdates,
        },
      };
    }

    return node;
  });

  return hasChanges ? updatedNodes : currentNodes;
}
