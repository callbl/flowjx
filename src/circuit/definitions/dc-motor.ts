import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface DCMotorData {
  label: string;
  isRunning: boolean;
  speed: number; // 0-100%
  direction: "cw" | "ccw" | "stopped";
}

/**
 * DC Motor electrical behavior.
 * Two pins: positive and negative
 * Speed controlled by PWM, direction by polarity
 */
export const dcMotorElectrical: ElectricalDefinition<DCMotorData> = {
  internalEdges: (nodeId: string, _data: DCMotorData): InternalEdge[] => {
    // Current flows: positive → negative
    return [
      {
        from: { nodeId, handleId: "positive" },
        to: { nodeId, handleId: "negative" },
      },
    ];
  },

  deriveState: (context: TraversalContext): Partial<DCMotorData> | undefined => {
    const { nodesInCompletePaths, nodeId } = context;

    // Motor runs if powered
    const isRunning = nodesInCompletePaths.has(nodeId);

    return {
      isRunning,
      direction: isRunning ? "cw" : "stopped",
    };
  },
};
