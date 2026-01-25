import type { Node } from "@xyflow/react";
import { Battery, Lightbulb, CircleDot, Cpu } from "lucide-react";
import { getNodeConfig } from "@/components/nodes/config";
import { BatteryNode } from "@/components/nodes/battery-node";
import { LedNode } from "@/components/nodes/led-node";
import { ButtonNode } from "@/components/nodes/button-node";
import { ArduinoUnoNode } from "@/components/nodes/arduino-uno-node";

import type { NodeCatalogEntry, CreateDefaultNodeParams } from "./types";
import { batteryElectrical, type BatteryData } from "@/circuit/definitions/battery";
import { ledElectrical, type LedData } from "@/circuit/definitions/led";
import { buttonElectrical, type ButtonData } from "@/circuit/definitions/button";
import {
  arduinoUnoElectrical,
  type ArduinoUnoData,
} from "@/circuit/definitions/arduino-uno";

/**
 * Node Catalog - Single source of truth for all node types.
 * Maps node type to its complete definition including UI, config, and electrical behavior.
 */
export const NODE_CATALOG = {
  battery: {
    type: "battery",
    label: "Battery",
    icon: Battery,
    uiComponent: BatteryNode,
    config: getNodeConfig("battery")!,
    defaults: (label: string): BatteryData => ({
      label,
      voltage: 5,
    }),
    electrical: batteryElectrical,
  } satisfies NodeCatalogEntry<BatteryData>,

  led: {
    type: "led",
    label: "LED",
    icon: Lightbulb,
    uiComponent: LedNode,
    config: getNodeConfig("led")!,
    defaults: (label: string): LedData => ({
      label,
      isPowered: false,
      color: "#ef4444",
    }),
    electrical: ledElectrical,
  } satisfies NodeCatalogEntry<LedData>,

  button: {
    type: "button",
    label: "Button",
    icon: CircleDot,
    uiComponent: ButtonNode,
    config: getNodeConfig("button")!,
    defaults: (label: string): ButtonData => ({
      label,
      isClosed: false,
    }),
    electrical: buttonElectrical,
  } satisfies NodeCatalogEntry<ButtonData>,

  "arduino-uno": {
    type: "arduino-uno",
    label: "Arduino Uno",
    icon: Cpu,
    uiComponent: ArduinoUnoNode,
    config: getNodeConfig("arduino-uno")!,
    defaults: (label: string): ArduinoUnoData => ({
      label,
      isPowered: false,
      onboardLedPowered: false,
      digitalPins: {
        d0: { mode: "INPUT", value: 0 },
        d1: { mode: "INPUT", value: 0 },
        d2: { mode: "INPUT", value: 0 },
        d3: { mode: "INPUT", value: 0 },
        d4: { mode: "INPUT", value: 0 },
        d5: { mode: "INPUT", value: 0 },
        d6: { mode: "INPUT", value: 0 },
        d7: { mode: "INPUT", value: 0 },
        d8: { mode: "INPUT", value: 0 },
        d9: { mode: "INPUT", value: 0 },
        d10: { mode: "INPUT", value: 0 },
        d11: { mode: "INPUT", value: 0 },
        d12: { mode: "INPUT", value: 0 },
        d13: { mode: "OUTPUT", value: 0 },
      },
    }),
    electrical: arduinoUnoElectrical,
  } satisfies NodeCatalogEntry<ArduinoUnoData>,
} as const;

// Validate that all catalog entries have valid configs at initialization
Object.entries(NODE_CATALOG).forEach(([type, entry]) => {
  if (!entry.config) {
    throw new Error(
      `Node type "${type}" is missing configuration in nodes/config.ts. ` +
        `All catalog entries must reference a valid NodeConfig.`,
    );
  }
});

/**
 * Node types mapping for ReactFlow.
 * Automatically derived from catalog.
 */
export const NODE_TYPES = Object.fromEntries(
  Object.entries(NODE_CATALOG).map(([type, entry]) => [type, entry.uiComponent]),
);

/**
 * Equipment items for the UI toolbox.
 * Automatically derived from catalog.
 */
export const EQUIPMENT_ITEMS = Object.values(NODE_CATALOG).map((entry) => ({
  type: entry.type,
  label: entry.label,
  icon: entry.icon,
}));

/**
 * Helper to create a default node from the catalog.
 *
 * @param params - Node creation parameters
 * @returns A new ReactFlow node with default data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createDefaultNode(params: CreateDefaultNodeParams): Node<any> {
  const { type, position, id = crypto.randomUUID() } = params;

  const catalogEntry = NODE_CATALOG[type as keyof typeof NODE_CATALOG];
  if (!catalogEntry) {
    throw new Error(
      `Unknown node type "${type}". Valid types: ${Object.keys(NODE_CATALOG).join(", ")}`,
    );
  }

  return {
    id,
    type,
    position,
    data: catalogEntry.defaults(catalogEntry.label),
  };
}

/**
 * Type guard to check if a type is a valid catalog key
 */
export function isValidNodeType(type: string): type is keyof typeof NODE_CATALOG {
  return type in NODE_CATALOG;
}

/**
 * Get catalog entry for a node type (type-safe)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCatalogEntry(type: string): NodeCatalogEntry<any> | undefined {
  if (!isValidNodeType(type)) {
    return undefined;
  }
  return NODE_CATALOG[type];
}

// Re-export types for convenience
export type { NodeCatalogEntry, CreateDefaultNodeParams } from "./types";
export type {
  BatteryData,
  LedData,
  ButtonData,
  ArduinoUnoData,
};
