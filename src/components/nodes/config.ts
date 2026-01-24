import { Position } from "@xyflow/react";
import {
  Battery,
  Lightbulb,
  CircleDot,
  Cpu,
  type LucideIcon,
} from "lucide-react";

/**
 * Handle/Pin configuration for node connection points
 */
export interface HandleConfig {
  id: string;
  type: "source" | "target";
  position: Position;
  label: string;
  dataType: "execution" | "object" | "value" | "boolean" | "vector";
  offsetPercentage?: number; // Percentage from top (0-100)
}

/**
 * Complete node configuration
 */
export interface NodeConfig {
  type: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  handles: HandleConfig[];
  width?: number;
  height?: number;
}

/**
 * Data type to color mapping for handles
 */
export const handleColors: Record<HandleConfig["dataType"], string> = {
  execution: "#ffffff",
  object: "#3b82f6", // blue-500
  value: "#f59e0b", // amber-500
  boolean: "#10b981", // emerald-500
  vector: "#8b5cf6", // violet-500
};

/**
 * Battery Node Configuration
 */
export const batteryNodeConfig: NodeConfig = {
  type: "battery",
  title: "Battery",
  subtitle: "Power Source",
  icon: Battery,
  handles: [
    {
      id: "plus",
      type: "source",
      position: Position.Right,
      label: "+",
      dataType: "value",
      offsetPercentage: 35,
    },
    {
      id: "minus",
      type: "source",
      position: Position.Right,
      label: "−",
      dataType: "value",
      offsetPercentage: 65,
    },
  ],
  width: 180,
  height: 100,
};

/**
 * LED Node Configuration
 */
export const ledNodeConfig: NodeConfig = {
  type: "led",
  title: "LED",
  subtitle: "Light Emitter",
  icon: Lightbulb,
  handles: [
    {
      id: "anode",
      type: "target",
      position: Position.Left,
      label: "+",
      dataType: "value",
      offsetPercentage: 35,
    },
    {
      id: "anode",
      type: "source",
      position: Position.Left,
      label: "+",
      dataType: "value",
      offsetPercentage: 35,
    },
    {
      id: "cathode",
      type: "target",
      position: Position.Left,
      label: "-",
      dataType: "value",
      offsetPercentage: 65,
    },
    {
      id: "cathode",
      type: "source",
      position: Position.Left,
      label: "-",
      dataType: "value",
      offsetPercentage: 65,
    },
  ],
  width: 180,
  height: 120,
};

/**
 * Button Node Configuration
 */
export const buttonNodeConfig: NodeConfig = {
  type: "button",
  title: "Button",
  subtitle: "Switch Control",
  icon: CircleDot,
  handles: [
    {
      id: "in",
      type: "target",
      position: Position.Left,
      label: "In",
      dataType: "value",
      offsetPercentage: 50,
    },
    {
      id: "out",
      type: "source",
      position: Position.Right,
      label: "Out",
      dataType: "value",
      offsetPercentage: 50,
    },
  ],
  width: 180,
  height: 100,
};

/**
 * Arduino Uno Node Configuration
 */
export const arduinoUnoNodeConfig: NodeConfig = {
  type: "arduino-uno",
  title: "Arduino Uno",
  subtitle: "Microcontroller",
  icon: Cpu,
  handles: [
    // Power/Control pins (Left side)
    {
      id: "vin",
      type: "source",
      position: Position.Left,
      label: "VIN",
      dataType: "value",
      offsetPercentage: 55,
    },
    {
      id: "vin",
      type: "target",
      position: Position.Left,
      label: "VIN",
      dataType: "value",
      offsetPercentage: 55,
    },
    {
      id: "5v",
      type: "source",
      position: Position.Left,
      label: "5V",
      dataType: "value",
      offsetPercentage: 40,
    },
    {
      id: "5v",
      type: "target",
      position: Position.Left,
      label: "5V",
      dataType: "value",
      offsetPercentage: 40,
    },
    {
      id: "3v3",
      type: "source",
      position: Position.Left,
      label: "3.3V",
      dataType: "value",
      offsetPercentage: 35,
    },
    {
      id: "3v3",
      type: "target",
      position: Position.Left,
      label: "3.3V",
      dataType: "value",
      offsetPercentage: 35,
    },
    {
      id: "gnd1",
      type: "source",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 50,
    },
    {
      id: "gnd1",
      type: "target",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 50,
    },
    {
      id: "gnd2",
      type: "source",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 45,
    },
    {
      id: "gnd2",
      type: "target",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 45,
    },
    {
      id: "reset",
      type: "source",
      position: Position.Left,
      label: "RST",
      dataType: "value",
      offsetPercentage: 30,
    },
    {
      id: "reset",
      type: "target",
      position: Position.Left,
      label: "RST",
      dataType: "value",
      offsetPercentage: 30,
    },
    {
      id: "aref",
      type: "source",
      position: Position.Left,
      label: "AREF",
      dataType: "value",
      offsetPercentage: 25,
    },
    {
      id: "aref",
      type: "target",
      position: Position.Left,
      label: "AREF",
      dataType: "value",
      offsetPercentage: 25,
    },

    // Analog pins (Left)
    {
      id: "a0",
      type: "source",
      position: Position.Left,
      label: "A0",
      dataType: "value",
      offsetPercentage: 65,
    },
    {
      id: "a0",
      type: "target",
      position: Position.Left,
      label: "A0",
      dataType: "value",
      offsetPercentage: 65,
    },
    {
      id: "a1",
      type: "source",
      position: Position.Left,
      label: "A1",
      dataType: "value",
      offsetPercentage: 70,
    },
    {
      id: "a1",
      type: "target",
      position: Position.Left,
      label: "A1",
      dataType: "value",
      offsetPercentage: 70,
    },
    {
      id: "a2",
      type: "source",
      position: Position.Left,
      label: "A2",
      dataType: "value",
      offsetPercentage: 75,
    },
    {
      id: "a2",
      type: "target",
      position: Position.Left,
      label: "A2",
      dataType: "value",
      offsetPercentage: 75,
    },
    {
      id: "a3",
      type: "source",
      position: Position.Left,
      label: "A3",
      dataType: "value",
      offsetPercentage: 80,
    },
    {
      id: "a3",
      type: "target",
      position: Position.Left,
      label: "A3",
      dataType: "value",
      offsetPercentage: 80,
    },
    {
      id: "a4",
      type: "source",
      position: Position.Left,
      label: "A4",
      dataType: "value",
      offsetPercentage: 85,
    },
    {
      id: "a4",
      type: "target",
      position: Position.Left,
      label: "A4",
      dataType: "value",
      offsetPercentage: 85,
    },
    {
      id: "a5",
      type: "source",
      position: Position.Left,
      label: "A5",
      dataType: "value",
      offsetPercentage: 90,
    },
    {
      id: "a5",
      type: "target",
      position: Position.Left,
      label: "A5",
      dataType: "value",
      offsetPercentage: 90,
    },

    // Digital pins (Right side)
    {
      id: "d0",
      type: "source",
      position: Position.Right,
      label: "D0",
      dataType: "value",
      offsetPercentage: 90,
    },
    {
      id: "d0",
      type: "target",
      position: Position.Right,
      label: "D0",
      dataType: "value",
      offsetPercentage: 90,
    },
    {
      id: "d1",
      type: "source",
      position: Position.Right,
      label: "D1",
      dataType: "value",
      offsetPercentage: 85,
    },
    {
      id: "d1",
      type: "target",
      position: Position.Right,
      label: "D1",
      dataType: "value",
      offsetPercentage: 85,
    },
    {
      id: "d2",
      type: "source",
      position: Position.Right,
      label: "D2",
      dataType: "value",
      offsetPercentage: 80,
    },
    {
      id: "d2",
      type: "target",
      position: Position.Right,
      label: "D2",
      dataType: "value",
      offsetPercentage: 80,
    },
    {
      id: "d3",
      type: "source",
      position: Position.Right,
      label: "D3",
      dataType: "value",
      offsetPercentage: 75,
    },
    {
      id: "d3",
      type: "target",
      position: Position.Right,
      label: "D3",
      dataType: "value",
      offsetPercentage: 75,
    },
    {
      id: "d4",
      type: "source",
      position: Position.Right,
      label: "D4",
      dataType: "value",
      offsetPercentage: 70,
    },
    {
      id: "d4",
      type: "target",
      position: Position.Right,
      label: "D4",
      dataType: "value",
      offsetPercentage: 70,
    },
    {
      id: "d5",
      type: "source",
      position: Position.Right,
      label: "D5",
      dataType: "value",
      offsetPercentage: 65,
    },
    {
      id: "d5",
      type: "target",
      position: Position.Right,
      label: "D5",
      dataType: "value",
      offsetPercentage: 65,
    },
    {
      id: "d6",
      type: "source",
      position: Position.Right,
      label: "D6",
      dataType: "value",
      offsetPercentage: 60,
    },
    {
      id: "d6",
      type: "target",
      position: Position.Right,
      label: "D6",
      dataType: "value",
      offsetPercentage: 60,
    },
    {
      id: "d7",
      type: "source",
      position: Position.Right,
      label: "D7",
      dataType: "value",
      offsetPercentage: 55,
    },
    {
      id: "d7",
      type: "target",
      position: Position.Right,
      label: "D7",
      dataType: "value",
      offsetPercentage: 55,
    },
    {
      id: "d8",
      type: "source",
      position: Position.Right,
      label: "D8",
      dataType: "value",
      offsetPercentage: 50,
    },
    {
      id: "d8",
      type: "target",
      position: Position.Right,
      label: "D8",
      dataType: "value",
      offsetPercentage: 50,
    },
    {
      id: "d9",
      type: "source",
      position: Position.Right,
      label: "D9",
      dataType: "value",
      offsetPercentage: 45,
    },
    {
      id: "d9",
      type: "target",
      position: Position.Right,
      label: "D9",
      dataType: "value",
      offsetPercentage: 45,
    },
    {
      id: "d10",
      type: "source",
      position: Position.Right,
      label: "D10",
      dataType: "value",
      offsetPercentage: 40,
    },
    {
      id: "d10",
      type: "target",
      position: Position.Right,
      label: "D10",
      dataType: "value",
      offsetPercentage: 40,
    },
    {
      id: "d11",
      type: "source",
      position: Position.Right,
      label: "D11",
      dataType: "value",
      offsetPercentage: 35,
    },
    {
      id: "d11",
      type: "target",
      position: Position.Right,
      label: "D11",
      dataType: "value",
      offsetPercentage: 35,
    },
    {
      id: "d12",
      type: "source",
      position: Position.Right,
      label: "D12",
      dataType: "value",
      offsetPercentage: 30,
    },
    {
      id: "d12",
      type: "target",
      position: Position.Right,
      label: "D12",
      dataType: "value",
      offsetPercentage: 30,
    },
    {
      id: "d13",
      type: "source",
      position: Position.Right,
      label: "D13",
      dataType: "value",
      offsetPercentage: 25,
    },
    {
      id: "d13",
      type: "target",
      position: Position.Right,
      label: "D13",
      dataType: "value",
      offsetPercentage: 25,
    },
  ],
  width: 364,
  height: 400,
};

/**
 * Registry of all node configurations
 */
export const nodeConfigs: Record<string, NodeConfig> = {
  battery: batteryNodeConfig,
  led: ledNodeConfig,
  button: buttonNodeConfig,
  "arduino-uno": arduinoUnoNodeConfig,
};

/**
 * Get configuration for a specific node type
 */
export function getNodeConfig(type: string): NodeConfig | undefined {
  return nodeConfigs[type];
}
