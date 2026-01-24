import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface ArduinoUnoData {
  label: string;
  isPowered: boolean;
}

/**
 * Arduino Uno electrical behavior.
 * Current flows 5V → GND (one-way).
 * Arduino is powered when:
 * - 5V pin is connected
 * - At least one GND pin is connected
 * - Arduino is part of a completed circuit path
 */
export const arduinoUnoElectrical: ElectricalDefinition<ArduinoUnoData> = {
  internalEdges: (nodeId: string, _data: ArduinoUnoData): InternalEdge[] => {
    // Internal power distribution (one-way, from power sources to GND)
    // Mimics real Arduino regulator: VIN feeds 5V/3.3V outputs, all connect to GND rails
    return [
      // VIN → all power rails and grounds
      { from: { nodeId, handleId: "vin" }, to: { nodeId, handleId: "5v" } },
      { from: { nodeId, handleId: "vin" }, to: { nodeId, handleId: "3v3" } },
      { from: { nodeId, handleId: "vin" }, to: { nodeId, handleId: "gnd1" } },
      { from: { nodeId, handleId: "vin" }, to: { nodeId, handleId: "gnd2" } },

      // 5V → 3.3V and grounds
      { from: { nodeId, handleId: "5v" }, to: { nodeId, handleId: "3v3" } },
      { from: { nodeId, handleId: "5v" }, to: { nodeId, handleId: "gnd1" } },
      { from: { nodeId, handleId: "5v" }, to: { nodeId, handleId: "gnd2" } },

      // 3.3V → grounds
      { from: { nodeId, handleId: "3v3" }, to: { nodeId, handleId: "gnd1" } },
      { from: { nodeId, handleId: "3v3" }, to: { nodeId, handleId: "gnd2" } },
    ];
  },

  deriveState: (context: TraversalContext): Partial<ArduinoUnoData> | undefined => {
    const { graph, nodesInCompletePaths, nodeId } = context;

    // Check if 5V and at least one GND are connected
    const fiveVKey = `${nodeId}:5v`;
    const gnd1Key = `${nodeId}:gnd1`;
    const gnd2Key = `${nodeId}:gnd2`;

    const fiveVConnected = graph.has(fiveVKey) && graph.get(fiveVKey)!.length > 0;
    const gndConnected =
      (graph.has(gnd1Key) && graph.get(gnd1Key)!.length > 0) ||
      (graph.has(gnd2Key) && graph.get(gnd2Key)!.length > 0);

    // Arduino is powered if 5V and GND connected AND it's in a complete path
    const isPowered =
      fiveVConnected && gndConnected && nodesInCompletePaths.has(nodeId);

    return { isPowered };
  },
};
