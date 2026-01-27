import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface SevenSegmentData {
  label: string;
  isPowered: boolean;
  digit: number; // -1 for off, 0-9 for display
  segments: {
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;
    e: boolean;
    f: boolean;
    g: boolean;
    dp: boolean; // decimal point
  };
}

/**
 * 7-Segment Display electrical behavior.
 * Each segment (a-g) plus decimal point (dp) has its own pin
 * Common cathode configuration
 */
export const sevenSegmentElectrical: ElectricalDefinition<SevenSegmentData> = {
  internalEdges: (nodeId: string, _data: SevenSegmentData): InternalEdge[] => {
    // Current flows from each segment pin to common cathode
    return [
      { from: { nodeId, handleId: "a" }, to: { nodeId, handleId: "cathode" } },
      { from: { nodeId, handleId: "b" }, to: { nodeId, handleId: "cathode" } },
      { from: { nodeId, handleId: "c" }, to: { nodeId, handleId: "cathode" } },
      { from: { nodeId, handleId: "d" }, to: { nodeId, handleId: "cathode" } },
      { from: { nodeId, handleId: "e" }, to: { nodeId, handleId: "cathode" } },
      { from: { nodeId, handleId: "f" }, to: { nodeId, handleId: "cathode" } },
      { from: { nodeId, handleId: "g" }, to: { nodeId, handleId: "cathode" } },
      { from: { nodeId, handleId: "dp" }, to: { nodeId, handleId: "cathode" } },
    ];
  },

  deriveState: (context: TraversalContext): Partial<SevenSegmentData> | undefined => {
    const { nodesInCompletePaths, nodeId } = context;

    // Display is powered if in complete circuit path
    const isPowered = nodesInCompletePaths.has(nodeId);

    return { isPowered };
  },
};
