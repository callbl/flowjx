import type { Node, Edge } from "@xyflow/react";
import { getCatalogEntry } from "@/circuit/catalog";
import type { TraversalContext } from "@/circuit/catalog/types";

/**
 * Enhanced circuit simulation with support for:
 * - Parallel connections (multiple components sharing power)
 * - Series connections (components in sequence)
 * - Proper voltage distribution
 * - Component-specific voltage requirements
 */

interface CircuitNode {
  nodeId: string;
  handleId: string;
}

interface PowerSource {
  nodeId: string;
  voltage: number;
  positiveTerminal: string;
  negativeTerminal: string;
}

/**
 * Build a complete graph including internal component connections
 */
function buildCircuitGraph(nodes: Node[], edges: Edge[]): Map<string, CircuitNode[]> {
  const graph = new Map<string, CircuitNode[]>();

  // Add external edges (user wires)
  edges.forEach((edge) => {
    const sourceKey = `${edge.source}:${edge.sourceHandle}`;
    const targetKey = `${edge.target}:${edge.targetHandle}`;

    if (!graph.has(sourceKey)) graph.set(sourceKey, []);
    if (!graph.has(targetKey)) graph.set(targetKey, []);

    // Bidirectional edges for wires
    graph.get(sourceKey)!.push({ nodeId: edge.target, handleId: edge.targetHandle || "" });
    graph.get(targetKey)!.push({ nodeId: edge.source, handleId: edge.sourceHandle || "" });
  });

  // Add internal component edges
  nodes.forEach((node) => {
    if (!node.type) return;
    const catalogEntry = getCatalogEntry(node.type);
    if (!catalogEntry) return;

    const internalEdges = catalogEntry.electrical.internalEdges(node.id, node.data);

    internalEdges.forEach((internalEdge) => {
      const fromKey = `${internalEdge.from.nodeId}:${internalEdge.from.handleId}`;
      const toKey = `${internalEdge.to.nodeId}:${internalEdge.to.handleId}`;

      if (!graph.has(fromKey)) graph.set(fromKey, []);

      // Add directional internal edge
      graph.get(fromKey)!.push({
        nodeId: internalEdge.to.nodeId,
        handleId: internalEdge.to.handleId,
      });
    });
  });

  return graph;
}

/**
 * Find all power sources (batteries) in the circuit
 */
function findPowerSources(nodes: Node[]): PowerSource[] {
  return nodes
    .filter((node) => node.type === "battery")
    .map((node) => ({
      nodeId: node.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      voltage: (node.data as any).voltage || 5,
      positiveTerminal: "plus",
      negativeTerminal: "minus",
    }));
}

/**
 * Trace all nodes reachable from a starting point
 * This finds all components connected to a power rail (parallel connections)
 */
function traceConnectedNodes(
  startKey: string,
  graph: Map<string, CircuitNode[]>,
  visited: Set<string> = new Set()
): Set<string> {
  const connectedNodes = new Set<string>();
  const queue: string[] = [startKey];

  while (queue.length > 0) {
    const currentKey = queue.shift()!;

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    // Extract node ID from key (format: "nodeId:handleId")
    const [nodeId] = currentKey.split(":");
    connectedNodes.add(nodeId);

    // Add all neighbors to queue
    const neighbors = graph.get(currentKey) || [];
    neighbors.forEach((neighbor) => {
      const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
      if (!visited.has(neighborKey)) {
        queue.push(neighborKey);
      }
    });
  }

  return connectedNodes;
}

/**
 * Check if there's a path from source to destination
 */
function hasPath(
  sourceKey: string,
  destKey: string,
  graph: Map<string, CircuitNode[]>
): boolean {
  const visited = new Set<string>();
  const queue: string[] = [sourceKey];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === destKey) return true;
    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = graph.get(current) || [];
    neighbors.forEach((neighbor) => {
      const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
      queue.push(neighborKey);
    });
  }

  return false;
}

/**
 * Main circuit simulation function
 * Supports parallel and series connections
 */
export function simulateCircuit(
  currentNodes: Node[],
  currentEdges: Edge[],
): Node[] {
  // Build complete circuit graph
  const graph = buildCircuitGraph(currentNodes, currentEdges);

  // Find all power sources
  const powerSources = findPowerSources(currentNodes);

  // Track which nodes are powered
  const poweredNodes = new Set<string>();
  const nodeVoltages = new Map<string, number>();

  // For each power source, find all powered components
  powerSources.forEach((source) => {
    const positiveKey = `${source.nodeId}:${source.positiveTerminal}`;
    const negativeKey = `${source.nodeId}:${source.negativeTerminal}`;

    // Find all nodes connected to positive terminal (power rail)
    const nodesOnPositiveRail = traceConnectedNodes(positiveKey, graph);

    // Find all nodes connected to negative terminal (ground rail)
    const nodesOnNegativeRail = traceConnectedNodes(negativeKey, graph);

    // A component is powered if:
    // 1. It's connected to positive rail
    // 2. There's a path from the component back to ground
    nodesOnPositiveRail.forEach((nodeId) => {
      // Skip the battery itself
      if (nodeId === source.nodeId) return;

      // Find this node's ground connection
      const node = currentNodes.find((n) => n.id === nodeId);
      if (!node || !node.type) return;

      const catalogEntry = getCatalogEntry(node.type);
      if (!catalogEntry) return;

      // Check if component has path to ground
      // For LEDs: check cathode to ground
      // For general components: check any output to ground
      const nodeHandles = catalogEntry.config.handles;
      const outputHandles = nodeHandles.filter((h) =>
        h.type === "source" || h.type === "target"
      );

      const hasGroundPath = outputHandles.some((handle) => {
        const handleKey = `${nodeId}:${handle.id}`;
        // Check if this handle connects to the negative rail
        return nodesOnNegativeRail.has(nodeId) ||
               hasPath(handleKey, negativeKey, graph);
      });

      if (hasGroundPath) {
        poweredNodes.add(nodeId);
        nodeVoltages.set(nodeId, source.voltage);
      }
    });
  });

  // Update all nodes with derived state
  let hasChanges = false;
  const updatedNodes = currentNodes.map((node) => {
    if (!node.type) return node;
    const catalogEntry = getCatalogEntry(node.type);
    if (!catalogEntry) return node;

    // Skip Arduino-controlled nodes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((node.data as any)?.arduinoControlled) {
      return node;
    }

    // Build context for this node
    const context: TraversalContext = {
      graph,
      nodesInCompletePaths: poweredNodes,
      nodeId: node.id,
      nodeData: node.data,
    };

    // Derive state based on electrical definition
    const stateUpdates = catalogEntry.electrical.deriveState(context);

    if (!stateUpdates) {
      return node;
    }

    // Check if anything changed
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
