import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface ArduinoUnoData {
  label: string;
  isPowered: boolean;
  onboardLedPowered?: boolean;
  digitalPins?: Record<string, { mode: "INPUT" | "OUTPUT"; value: 0 | 1 }>;
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
    const edges: InternalEdge[] = [];

    // Internal power distribution (one-way, from power sources to GND)
    // Mimics real Arduino regulator: VIN feeds 5V/3.3V outputs, all connect to GND rails
    edges.push(
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
      { from: { nodeId, handleId: "3v3" }, to: { nodeId, handleId: "gnd2" } }
    );

    // Bidirectional signal pins (D0-D13, A0-A5, RESET, AREF)
    // These pins have both source and target handles with identical IDs in the config,
    // which makes them inherently bidirectional in the graph (same key ${nodeId}:${handleId}).
    // External connections to these pins can conduct in both directions automatically.
    // No internal edges needed - bidirectionality is achieved through config design.

    // Signal pins from arduinoUnoNodeConfig: d0-d13, a0-a5, reset, aref
    // Each has both source and target handles with the same ID, enabling bidirectional flow.

    return edges;
  },

  deriveState: (context: TraversalContext): Partial<ArduinoUnoData> | undefined => {
    const { graph, nodesInCompletePaths, nodeId } = context;

    // Check if power source (VIN or 5V) and at least one GND are connected
    const vinKey = `${nodeId}:vin`;
    const fiveVKey = `${nodeId}:5v`;
    const gnd1Key = `${nodeId}:gnd1`;
    const gnd2Key = `${nodeId}:gnd2`;
    const d13Key = `${nodeId}:d13`;

    const vinConnected = graph.has(vinKey) && graph.get(vinKey)!.length > 0;
    const fiveVConnected = graph.has(fiveVKey) && graph.get(fiveVKey)!.length > 0;
    const gndConnected =
      (graph.has(gnd1Key) && graph.get(gnd1Key)!.length > 0) ||
      (graph.has(gnd2Key) && graph.get(gnd2Key)!.length > 0);
    const d13Connected = graph.has(d13Key) && graph.get(d13Key)!.length > 0;

    // Arduino is powered if (VIN or 5V) and GND connected AND it's in a complete path
    const isPowered =
      (vinConnected || fiveVConnected) &&
      gndConnected &&
      nodesInCompletePaths.has(nodeId);

    // Onboard D13 LED is powered when Arduino is powered AND D13 has external connection
    const onboardLedPowered = isPowered && d13Connected;

    return { isPowered, onboardLedPowered };
  },
};
