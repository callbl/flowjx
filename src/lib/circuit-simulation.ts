import type { Node, Edge } from "@xyflow/react";
import type {
  LedData,
  ButtonData,
  ArduinoUnoData,
} from "@/components/circuit-flow";

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
 * Pure circuit simulation function using BFS graph traversal.
 *
 * Algorithm:
 * 1. Detect connected components (isolated circuits)
 * 2. For each component:
 *    a. Build bidirectional adjacency graph from edges with keys: `nodeId:handleId`
 *    b. For each battery in the component, perform BFS from positive to negative terminal
 *    c. Track all LEDs found in complete circuit paths
 *    d. Verify LED polarity (both anode and cathode must be connected)
 * 3. Return updated nodes with LED isPowered states
 *
 * This ensures that separate circuits work independently without affecting each other.
 *
 * @param currentNodes - Array of circuit nodes
 * @param currentEdges - Array of circuit edges
 * @returns Updated nodes array with LED powered states
 */
export function simulateCircuit(
  currentNodes: Node[],
  currentEdges: Edge[],
): Node[] {
  // Find connected components - each represents an isolated circuit
  const components = findConnectedComponents(currentNodes, currentEdges);
  const allPoweredLeds = new Set<string>();
  const allPoweredArduinos = new Set<string>();

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

    // Build adjacency list from edges - bidirectional graph
    const graph = new Map<
      string,
      Array<{ nodeId: string; handleId: string }>
    >();

    componentEdges.forEach((edge) => {
      const sourceKey = `${edge.source}:${edge.sourceHandle}`;
      const targetKey = `${edge.target}:${edge.targetHandle}`;

      if (!graph.has(sourceKey)) graph.set(sourceKey, []);
      if (!graph.has(targetKey)) graph.set(targetKey, []);

      graph
        .get(sourceKey)!
        .push({ nodeId: edge.target, handleId: edge.targetHandle || "" });
      graph
        .get(targetKey)!
        .push({ nodeId: edge.source, handleId: edge.sourceHandle || "" });
    });

    // Find batteries in this component only
    const batteries = componentNodes.filter((n) => n.type === "battery");
    const poweredLeds = new Set<string>();
    const poweredArduinos = new Set<string>();

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
          // Mark all LEDs in this path as powered (only if properly connected)
          current.path.forEach((nodeId) => {
            const node = componentNodes.find((n) => n.id === nodeId);
            if (node?.type === "led") {
              // Verify LED is connected with correct polarity
              const ledAnodeKey = `${nodeId}:anode`;
              const ledCathodeKey = `${nodeId}:cathode`;

              // Check if both anode and cathode are connected
              const anodeConnected =
                graph.has(ledAnodeKey) && graph.get(ledAnodeKey)!.length > 0;
              const cathodeConnected =
                graph.has(ledCathodeKey) &&
                graph.get(ledCathodeKey)!.length > 0;

              if (anodeConnected && cathodeConnected) {
                poweredLeds.add(nodeId);
              }
            } else if (node?.type === "arduino-uno") {
              // Verify Arduino is connected with correct power pins (5V and GND)
              const fiveVKey = `${nodeId}:5v`;
              const gnd1Key = `${nodeId}:gnd1`;
              const gnd2Key = `${nodeId}:gnd2`;

              // Check if 5V and at least one GND are connected
              const fiveVConnected =
                graph.has(fiveVKey) && graph.get(fiveVKey)!.length > 0;
              const gndConnected =
                (graph.has(gnd1Key) && graph.get(gnd1Key)!.length > 0) ||
                (graph.has(gnd2Key) && graph.get(gnd2Key)!.length > 0);

              if (fiveVConnected && gndConnected) {
                poweredArduinos.add(nodeId);
              }
            }
          });
          continue;
        }

        // Get current node
        const currentNode = componentNodes.find((n) => n.id === current.nodeId);
        if (!currentNode) continue;

        // First, explore direct neighbors from this handle
        const neighbors = graph.get(key) || [];
        neighbors.forEach((neighbor) => {
          const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
          if (!visited.has(neighborKey)) {
            queue.push({
              nodeId: neighbor.nodeId,
              handleId: neighbor.handleId,
              path: [...current.path, neighbor.nodeId],
            });
          }
        });

        // Then handle internal component connections
        if (currentNode.type === "led") {
          // LED: Current flows anode → cathode only
          if (current.handleId === "anode") {
            // Can flow through to cathode
            const cathodeKey = `${current.nodeId}:cathode`;
            const cathodeNeighbors = graph.get(cathodeKey) || [];

            cathodeNeighbors.forEach((neighbor) => {
              const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
              if (!visited.has(neighborKey)) {
                // If flowing to a different node, add it to path
                // If flowing internally (same node), don't add to path
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
          // If at cathode, don't allow flow back to anode (wrong direction)
        } else if (currentNode.type === "button") {
          // Button: Only conducts when closed, bidirectional
          if ((currentNode.data as ButtonData).isClosed) {
            const otherHandle = current.handleId === "in" ? "out" : "in";
            const otherKey = `${current.nodeId}:${otherHandle}`;
            const otherNeighbors = graph.get(otherKey) || [];

            otherNeighbors.forEach((neighbor) => {
              const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
              if (!visited.has(neighborKey)) {
                queue.push({
                  nodeId: neighbor.nodeId,
                  handleId: neighbor.handleId,
                  path: current.path,
                });
              }
            });
          }
          // If button is open, it blocks current flow (already handled by not exploring)
        } else if (currentNode.type === "arduino-uno") {
          // Arduino: Current flows from 5V to GND (internal power routing)
          if (current.handleId === "5v") {
            // Can flow through to any GND pin (gnd1 or gnd2)
            const gndPins = ["gnd1", "gnd2"];

            gndPins.forEach((gndPin) => {
              const gndKey = `${current.nodeId}:${gndPin}`;
              const gndNeighbors = graph.get(gndKey) || [];

              gndNeighbors.forEach((neighbor) => {
                const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
                if (!visited.has(neighborKey)) {
                  queue.push({
                    nodeId: neighbor.nodeId,
                    handleId: neighbor.handleId,
                    path: current.path,
                  });
                }
              });
            });
          }
          // If at GND, don't allow flow back to 5V (wrong direction)
        }
      }
    });

    // Add this component's powered LEDs to the global set
    poweredLeds.forEach((ledId) => allPoweredLeds.add(ledId));

    // Add this component's powered Arduinos to the global set
    poweredArduinos.forEach((arduinoId) => allPoweredArduinos.add(arduinoId));
  });

  // Update LED and Arduino powered states only if they changed
  let hasChanges = false;
  const updatedNodes = currentNodes.map((node) => {
    if (node.type === "led") {
      const shouldBePowered = allPoweredLeds.has(node.id);
      const currentlyPowered = (node.data as LedData).isPowered || false;

      if (shouldBePowered !== currentlyPowered) {
        hasChanges = true;
        return {
          ...node,
          data: {
            ...node.data,
            isPowered: shouldBePowered,
          } as LedData,
        };
      }
    } else if (node.type === "arduino-uno") {
      const shouldBePowered = allPoweredArduinos.has(node.id);
      const currentlyPowered =
        (node.data as ArduinoUnoData)?.isPowered || false;

      if (shouldBePowered !== currentlyPowered) {
        hasChanges = true;
        return {
          ...node,
          data: {
            ...node.data,
            isPowered: shouldBePowered,
          } as ArduinoUnoData,
        };
      }
    }
    return node;
  });

  return hasChanges ? updatedNodes : currentNodes;
}
