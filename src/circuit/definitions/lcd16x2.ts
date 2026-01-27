import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface LCD16x2Data {
  label: string;
  isPowered: boolean;
  line1: string; // Max 16 characters
  line2: string; // Max 16 characters
  backlight: boolean;
  cursorPos: { row: number; col: number };
}

/**
 * LCD 16x2 Display electrical behavior.
 * Multiple pins: VSS (GND), VDD (5V), RS, RW, E, D0-D7, A (backlight+), K (backlight-)
 * Simplified to VCC and GND for circuit simulation
 */
export const lcd16x2Electrical: ElectricalDefinition<LCD16x2Data> = {
  internalEdges: (nodeId: string, _data: LCD16x2Data): InternalEdge[] => {
    // Current flows: vcc → gnd
    return [
      {
        from: { nodeId, handleId: "vcc" },
        to: { nodeId, handleId: "gnd" },
      },
    ];
  },

  deriveState: (context: TraversalContext): Partial<LCD16x2Data> | undefined => {
    const { nodesInCompletePaths, nodeId } = context;

    // LCD is powered if in complete circuit path
    const isPowered = nodesInCompletePaths.has(nodeId);

    return { isPowered };
  },
};
