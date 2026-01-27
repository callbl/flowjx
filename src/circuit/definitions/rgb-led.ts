import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface RgbLedData {
  label: string;
  isPowered: boolean;
  red: number; // 0-255
  green: number; // 0-255
  blue: number; // 0-255
}

/**
 * RGB LED electrical behavior.
 * Has 4 pins: R (red), G (green), B (blue), and cathode (-)
 * Each color channel flows through its pin to the common cathode
 */
export const rgbLedElectrical: ElectricalDefinition<RgbLedData> = {
  internalEdges: (nodeId: string, _data: RgbLedData): InternalEdge[] => {
    // Current flows: R → cathode, G → cathode, B → cathode
    return [
      {
        from: { nodeId, handleId: "r" },
        to: { nodeId, handleId: "cathode" },
      },
      {
        from: { nodeId, handleId: "g" },
        to: { nodeId, handleId: "cathode" },
      },
      {
        from: { nodeId, handleId: "b" },
        to: { nodeId, handleId: "cathode" },
      },
    ];
  },

  deriveState: (context: TraversalContext): Partial<RgbLedData> | undefined => {
    const { nodesInCompletePaths, nodeId } = context;

    // RGB LED is powered if it's in a complete circuit path
    const isPowered = nodesInCompletePaths.has(nodeId);

    return { isPowered };
  },
};
