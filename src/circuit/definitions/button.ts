import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface ButtonData {
  label: string;
  isClosed: boolean;
}

/**
 * Button electrical behavior.
 * Bidirectional flow (in ↔ out) when closed.
 * No flow when open.
 */
export const buttonElectrical: ElectricalDefinition<ButtonData> = {
  internalEdges: (nodeId: string, data: ButtonData): InternalEdge[] => {
    // Only conduct when button is closed
    if (!data.isClosed) {
      return [];
    }

    // Bidirectional flow when closed
    return [
      {
        from: { nodeId, handleId: "in" },
        to: { nodeId, handleId: "out" },
      },
      {
        from: { nodeId, handleId: "out" },
        to: { nodeId, handleId: "in" },
      },
    ];
  },

  deriveState: (_context: TraversalContext): Partial<ButtonData> | undefined => {
    // Button state is controlled by user, not by circuit
    return undefined;
  },
};
