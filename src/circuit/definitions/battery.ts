import type {
  ElectricalDefinition,
  InternalEdge,
  TraversalContext,
} from "@/circuit/catalog/types";

export interface BatteryData {
  label: string;
  voltage: number;
}

/**
 * Battery electrical behavior.
 * Batteries have no internal edges - they are the power source.
 * Current flows from + terminal to - terminal through external circuit.
 */
export const batteryElectrical: ElectricalDefinition<BatteryData> = {
  internalEdges: (_nodeId: string, _data: BatteryData): InternalEdge[] => {
    // No internal routing - battery is the power source
    return [];
  },

  deriveState: (_context: TraversalContext): Partial<BatteryData> | undefined => {
    // Battery state doesn't change based on circuit
    return undefined;
  },
};
