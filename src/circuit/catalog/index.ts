import type { Node } from "@xyflow/react";
import { Battery, Lightbulb, CircleDot, Cpu, Volume2, Fan, Gauge, Monitor, Hash } from "lucide-react";
import { getNodeConfig } from "@/components/nodes/config";
import { BatteryNode } from "@/components/nodes/battery-node";
import { LedNode } from "@/components/nodes/led-node";
import { ButtonNode } from "@/components/nodes/button-node";
import { ArduinoUnoNode } from "@/components/nodes/arduino-uno-node";
import { Esp32Node } from "@/components/nodes/esp32-node";
import { RgbLedNode } from "@/components/nodes/rgb-led-node";
import { BuzzerNode } from "@/components/nodes/buzzer-node";
import { DCMotorNode } from "@/components/nodes/dc-motor-node";
import { ServoNode } from "@/components/nodes/servo-node";
import { LCD16x2Node } from "@/components/nodes/lcd16x2-node";
import { SevenSegmentNode } from "@/components/nodes/seven-segment-node";

import type { NodeCatalogEntry, CreateDefaultNodeParams } from "./types";
import { batteryElectrical, type BatteryData } from "@/circuit/definitions/battery";
import { ledElectrical, type LedData } from "@/circuit/definitions/led";
import { buttonElectrical, type ButtonData } from "@/circuit/definitions/button";
import {
  arduinoUnoElectrical,
  type ArduinoUnoData,
} from "@/circuit/definitions/arduino-uno";
import { esp32Electrical, type Esp32Data } from "@/circuit/definitions/esp32";
import { rgbLedElectrical, type RgbLedData } from "@/circuit/definitions/rgb-led";
import { buzzerElectrical, type BuzzerData } from "@/circuit/definitions/buzzer";
import { dcMotorElectrical, type DCMotorData } from "@/circuit/definitions/dc-motor";
import { servoElectrical, type ServoData } from "@/circuit/definitions/servo";
import { lcd16x2Electrical, type LCD16x2Data } from "@/circuit/definitions/lcd16x2";
import { sevenSegmentElectrical, type SevenSegmentData } from "@/circuit/definitions/seven-segment";

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
    }),
    electrical: arduinoUnoElectrical,
  } satisfies NodeCatalogEntry<ArduinoUnoData>,

  esp32: {
    type: "esp32",
    label: "ESP32 DevKit",
    icon: Cpu,
    uiComponent: Esp32Node,
    config: getNodeConfig("esp32")!,
    defaults: (label: string): Esp32Data => ({
      label,
      isPowered: false,
    }),
    electrical: esp32Electrical,
  } satisfies NodeCatalogEntry<Esp32Data>,

  "rgb-led": {
    type: "rgb-led",
    label: "RGB LED",
    icon: Lightbulb,
    uiComponent: RgbLedNode,
    config: getNodeConfig("rgb-led")!,
    defaults: (label: string): RgbLedData => ({
      label,
      isPowered: false,
      red: 0,
      green: 0,
      blue: 0,
    }),
    electrical: rgbLedElectrical,
  } satisfies NodeCatalogEntry<RgbLedData>,

  buzzer: {
    type: "buzzer",
    label: "Buzzer",
    icon: Volume2,
    uiComponent: BuzzerNode,
    config: getNodeConfig("buzzer")!,
    defaults: (label: string): BuzzerData => ({
      label,
      isActive: false,
      frequency: 0,
    }),
    electrical: buzzerElectrical,
  } satisfies NodeCatalogEntry<BuzzerData>,

  "dc-motor": {
    type: "dc-motor",
    label: "DC Motor",
    icon: Fan,
    uiComponent: DCMotorNode,
    config: getNodeConfig("dc-motor")!,
    defaults: (label: string): DCMotorData => ({
      label,
      isRunning: false,
      speed: 0,
      direction: "stopped",
    }),
    electrical: dcMotorElectrical,
  } satisfies NodeCatalogEntry<DCMotorData>,

  servo: {
    type: "servo",
    label: "Servo Motor",
    icon: Gauge,
    uiComponent: ServoNode,
    config: getNodeConfig("servo")!,
    defaults: (label: string): ServoData => ({
      label,
      isPowered: false,
      angle: 90,
    }),
    electrical: servoElectrical,
  } satisfies NodeCatalogEntry<ServoData>,

  lcd16x2: {
    type: "lcd16x2",
    label: "LCD 16x2",
    icon: Monitor,
    uiComponent: LCD16x2Node,
    config: getNodeConfig("lcd16x2")!,
    defaults: (label: string): LCD16x2Data => ({
      label,
      isPowered: false,
      line1: "Hello, World!",
      line2: "Arduino LCD",
      backlight: true,
      cursorPos: { row: 0, col: 0 },
    }),
    electrical: lcd16x2Electrical,
  } satisfies NodeCatalogEntry<LCD16x2Data>,

  "seven-segment": {
    type: "seven-segment",
    label: "7-Segment",
    icon: Hash,
    uiComponent: SevenSegmentNode,
    config: getNodeConfig("seven-segment")!,
    defaults: (label: string): SevenSegmentData => ({
      label,
      isPowered: false,
      digit: 0,
      segments: {
        a: false,
        b: false,
        c: false,
        d: false,
        e: false,
        f: false,
        g: false,
        dp: false,
      },
    }),
    electrical: sevenSegmentElectrical,
  } satisfies NodeCatalogEntry<SevenSegmentData>,
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
  Esp32Data,
  RgbLedData,
  BuzzerData,
  DCMotorData,
  ServoData,
  LCD16x2Data,
  SevenSegmentData,
};
