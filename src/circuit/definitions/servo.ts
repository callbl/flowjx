import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface ServoData {
  label: string;
  isPowered: boolean;
  angle: number; // 0-180 degrees
}

/**
 * Servo motor electrical behavior.
 * Three pins: VCC (power), GND (ground), signal (PWM control)
 */
export const servoElectrical: ElectricalDefinition<ServoData> = {
  internalEdges: (nodeId: string, _data: ServoData): InternalEdge[] => {
    // Current flows: vcc → gnd
    return [
      {
        from: { nodeId, handleId: "vcc" },
        to: { nodeId, handleId: "gnd" },
      },
    ];
  },

  deriveState: (context: TraversalContext): Partial<ServoData> | undefined => {
    const { nodesInCompletePaths, nodeId } = context;

    // Servo is powered if in complete path
    const isPowered = nodesInCompletePaths.has(nodeId);

    return { isPowered };
  },
};
