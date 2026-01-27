import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface Esp32Data {
  label: string;
  isPowered: boolean;
}

/**
 * ESP32 DevKit electrical behavior.
 * Current flows 3.3V → GND (one-way).
 * ESP32 is powered when:
 * - 3.3V pin is connected
 * - At least one GND pin is connected
 * - ESP32 is part of a completed circuit path
 */
export const esp32Electrical: ElectricalDefinition<Esp32Data> = {
  internalEdges: (nodeId: string, _data: Esp32Data): InternalEdge[] => {
    // One-way flow: 3.3V → GND1, GND2, and GND3
    return [
      {
        from: { nodeId, handleId: "3v3" },
        to: { nodeId, handleId: "gnd1" },
      },
      {
        from: { nodeId, handleId: "3v3" },
        to: { nodeId, handleId: "gnd2" },
      },
      {
        from: { nodeId, handleId: "3v3" },
        to: { nodeId, handleId: "gnd3" },
      },
    ];
  },

  deriveState: (context: TraversalContext): Partial<Esp32Data> | undefined => {
    const { graph, nodesInCompletePaths, nodeId } = context;

    // Check if 3.3V and at least one GND are connected
    const threeV3Key = `${nodeId}:3v3`;
    const gnd1Key = `${nodeId}:gnd1`;
    const gnd2Key = `${nodeId}:gnd2`;
    const gnd3Key = `${nodeId}:gnd3`;

    const threeV3Connected = graph.has(threeV3Key) && graph.get(threeV3Key)!.length > 0;
    const gndConnected =
      (graph.has(gnd1Key) && graph.get(gnd1Key)!.length > 0) ||
      (graph.has(gnd2Key) && graph.get(gnd2Key)!.length > 0) ||
      (graph.has(gnd3Key) && graph.get(gnd3Key)!.length > 0);

    // ESP32 is powered if 3.3V and GND connected AND it's in a complete path
    const isPowered =
      threeV3Connected && gndConnected && nodesInCompletePaths.has(nodeId);

    return { isPowered };
  },
};
