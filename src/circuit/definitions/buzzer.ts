import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface BuzzerData {
  label: string;
  isActive: boolean;
  frequency: number; // Hz
}

/**
 * Buzzer electrical behavior.
 * Simple two-pin device with positive and ground
 */
export const buzzerElectrical: ElectricalDefinition<BuzzerData> = {
  internalEdges: (nodeId: string, _data: BuzzerData): InternalEdge[] => {
    // Current flows: positive → ground
    return [
      {
        from: { nodeId, handleId: "positive" },
        to: { nodeId, handleId: "ground" },
      },
    ];
  },

  deriveState: (context: TraversalContext): Partial<BuzzerData> | undefined => {
    const { nodesInCompletePaths, nodeId } = context;

    // Buzzer is active if powered
    const isActive = nodesInCompletePaths.has(nodeId);

    return { isActive };
  },
};
