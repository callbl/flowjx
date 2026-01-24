import { Position } from "@xyflow/react";
import { Battery, Lightbulb, CircleDot, type LucideIcon } from "lucide-react";

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
 * Registry of all node configurations
 */
export const nodeConfigs: Record<string, NodeConfig> = {
  battery: batteryNodeConfig,
  led: ledNodeConfig,
  button: buttonNodeConfig,
};

/**
 * Get configuration for a specific node type
 */
export function getNodeConfig(type: string): NodeConfig | undefined {
  return nodeConfigs[type];
}
