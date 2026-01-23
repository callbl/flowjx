import type { Node, Edge } from "@xyflow/react";
import type { LedData, ButtonData } from "@/components/circuit-flow";

/**
 * Pure circuit simulation function using BFS graph traversal.
 *
 * Algorithm:
 * 1. Build bidirectional adjacency graph from edges with keys: `nodeId:handleId`
 * 2. For each battery, perform BFS from positive terminal to negative terminal
 * 3. Track all LEDs found in complete circuit paths
 * 4. Verify LED polarity (both anode and cathode must be connected)
 * 5. Return updated nodes with LED isPowered states
 *
 * @param currentNodes - Array of circuit nodes
 * @param currentEdges - Array of circuit edges
 * @returns Updated nodes array with LED powered states
 */
export function simulateCircuit(
  currentNodes: Node[],
  currentEdges: Edge[]
): Node[] {
  // Build adjacency list from edges - bidirectional graph
  const graph = new Map<
    string,
    Array<{ nodeId: string; handleId: string }>
  >();

  currentEdges.forEach((edge) => {
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

  // Find all batteries
  const batteries = currentNodes.filter((n) => n.type === "battery");
  const poweredLeds = new Set<string>();

  // For each battery, trace circuits from + to -
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
          const node = currentNodes.find((n) => n.id === nodeId);
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
          }
        });
        continue;
      }

      // Get current node
      const currentNode = currentNodes.find((n) => n.id === current.nodeId);
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
              queue.push({
                nodeId: neighbor.nodeId,
                handleId: neighbor.handleId,
                path: current.path, // Don't add LED again to path
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
      }
    }
  });

  // Update LED powered states only if they changed
  let hasChanges = false;
  const updatedNodes = currentNodes.map((node) => {
    if (node.type === "led") {
      const shouldBePowered = poweredLeds.has(node.id);
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
    }
    return node;
  });

  return hasChanges ? updatedNodes : currentNodes;
}
