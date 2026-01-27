import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface LedData {
  label: string;
  isPowered: boolean;
  color?: string;
  brightness?: number; // 0-1, for PWM control
  arduinoControlled?: boolean; // True when controlled by Arduino code
}

/**
 * LED electrical behavior.
 * Current flows anode → cathode only (unidirectional).
 * LED is powered when:
 * - Both anode and cathode are connected
 * - LED is part of a completed circuit path
 */
export const ledElectrical: ElectricalDefinition<LedData> = {
  internalEdges: (nodeId: string, _data: LedData): InternalEdge[] => {
    // One-way flow: anode → cathode
    return [
      {
        from: { nodeId, handleId: "anode" },
        to: { nodeId, handleId: "cathode" },
      },
    ];
  },

  deriveState: (context: TraversalContext): Partial<LedData> | undefined => {
    const { graph, nodesInCompletePaths, nodeId } = context;

    // Check if both anode and cathode are connected
    const anodeKey = `${nodeId}:anode`;
    const cathodeKey = `${nodeId}:cathode`;

    const anodeConnected = graph.has(anodeKey) && graph.get(anodeKey)!.length > 0;
    const cathodeConnected =
      graph.has(cathodeKey) && graph.get(cathodeKey)!.length > 0;

    // LED is powered if both terminals connected AND it's in a complete path
    const isPowered =
      anodeConnected && cathodeConnected && nodesInCompletePaths.has(nodeId);

    return { isPowered };
  },
};
