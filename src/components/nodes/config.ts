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
  description?: string; // Optional description shown in tooltip
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
      description: "Positive terminal - connects to power input",
    },
    {
      id: "minus",
      type: "source",
      position: Position.Right,
      label: "−",
      dataType: "value",
      offsetPercentage: 65,
      description: "Negative terminal - ground reference",
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
      description: "Anode - positive terminal (longer leg)",
    },
    {
      id: "anode",
      type: "source",
      position: Position.Left,
      label: "+",
      dataType: "value",
      offsetPercentage: 35,
      description: "Anode - positive terminal (longer leg)",
    },
    {
      id: "cathode",
      type: "target",
      position: Position.Left,
      label: "-",
      dataType: "value",
      offsetPercentage: 65,
      description: "Cathode - negative terminal (shorter leg)",
    },
    {
      id: "cathode",
      type: "source",
      position: Position.Left,
      label: "-",
      dataType: "value",
      offsetPercentage: 65,
      description: "Cathode - negative terminal (shorter leg)",
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
      description: "Input connection - receives current",
    },
    {
      id: "out",
      type: "source",
      position: Position.Right,
      label: "Out",
      dataType: "value",
      offsetPercentage: 50,
      description: "Output connection - active when button is pressed",
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
      description: "External power input (7-12V recommended)",
    },
    {
      id: "vin",
      type: "target",
      position: Position.Left,
      label: "VIN",
      dataType: "value",
      offsetPercentage: 55,
      description: "External power input (7-12V recommended)",
    },
    {
      id: "5v",
      type: "source",
      position: Position.Left,
      label: "5V",
      dataType: "value",
      offsetPercentage: 40,
      description: "Regulated 5V power output",
    },
    {
      id: "5v",
      type: "target",
      position: Position.Left,
      label: "5V",
      dataType: "value",
      offsetPercentage: 40,
      description: "Regulated 5V power output",
    },
    {
      id: "3v3",
      type: "source",
      position: Position.Left,
      label: "3.3V",
      dataType: "value",
      offsetPercentage: 35,
      description: "Regulated 3.3V power output (max 50mA)",
    },
    {
      id: "3v3",
      type: "target",
      position: Position.Left,
      label: "3.3V",
      dataType: "value",
      offsetPercentage: 35,
      description: "Regulated 3.3V power output (max 50mA)",
    },
    {
      id: "gnd1",
      type: "source",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 50,
      description: "Ground reference - connect to circuit ground",
    },
    {
      id: "gnd1",
      type: "target",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 50,
      description: "Ground reference - connect to circuit ground",
    },
    {
      id: "gnd2",
      type: "source",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 45,
      description: "Ground reference - connect to circuit ground",
    },
    {
      id: "gnd2",
      type: "target",
      position: Position.Left,
      label: "GND",
      dataType: "value",
      offsetPercentage: 45,
      description: "Ground reference - connect to circuit ground",
    },
    {
      id: "reset",
      type: "source",
      position: Position.Left,
      label: "RST",
      dataType: "value",
      offsetPercentage: 30,
      description: "Reset the microcontroller (active LOW)",
    },
    {
      id: "reset",
      type: "target",
      position: Position.Left,
      label: "RST",
      dataType: "value",
      offsetPercentage: 30,
      description: "Reset the microcontroller (active LOW)",
    },
    {
      id: "aref",
      type: "source",
      position: Position.Left,
      label: "AREF",
      dataType: "value",
      offsetPercentage: 25,
      description: "Analog reference voltage for ADC",
    },
    {
      id: "aref",
      type: "target",
      position: Position.Left,
      label: "AREF",
      dataType: "value",
      offsetPercentage: 25,
      description: "Analog reference voltage for ADC",
    },

    // Analog pins (Left)
    {
      id: "a0",
      type: "source",
      position: Position.Left,
      label: "A0",
      dataType: "value",
      offsetPercentage: 65,
      description: "Analog input 0 (10-bit ADC, 0-5V)",
    },
    {
      id: "a0",
      type: "target",
      position: Position.Left,
      label: "A0",
      dataType: "value",
      offsetPercentage: 65,
      description: "Analog input 0 (10-bit ADC, 0-5V)",
    },
    {
      id: "a1",
      type: "source",
      position: Position.Left,
      label: "A1",
      dataType: "value",
      offsetPercentage: 70,
      description: "Analog input 1 (10-bit ADC, 0-5V)",
    },
    {
      id: "a1",
      type: "target",
      position: Position.Left,
      label: "A1",
      dataType: "value",
      offsetPercentage: 70,
      description: "Analog input 1 (10-bit ADC, 0-5V)",
    },
    {
      id: "a2",
      type: "source",
      position: Position.Left,
      label: "A2",
      dataType: "value",
      offsetPercentage: 75,
      description: "Analog input 2 (10-bit ADC, 0-5V)",
    },
    {
      id: "a2",
      type: "target",
      position: Position.Left,
      label: "A2",
      dataType: "value",
      offsetPercentage: 75,
      description: "Analog input 2 (10-bit ADC, 0-5V)",
    },
    {
      id: "a3",
      type: "source",
      position: Position.Left,
      label: "A3",
      dataType: "value",
      offsetPercentage: 80,
      description: "Analog input 3 (10-bit ADC, 0-5V)",
    },
    {
      id: "a3",
      type: "target",
      position: Position.Left,
      label: "A3",
      dataType: "value",
      offsetPercentage: 80,
      description: "Analog input 3 (10-bit ADC, 0-5V)",
    },
    {
      id: "a4",
      type: "source",
      position: Position.Left,
      label: "A4",
      dataType: "value",
      offsetPercentage: 85,
      description: "Analog input 4 (10-bit ADC, 0-5V) - also I2C SDA",
    },
    {
      id: "a4",
      type: "target",
      position: Position.Left,
      label: "A4",
      dataType: "value",
      offsetPercentage: 85,
      description: "Analog input 4 (10-bit ADC, 0-5V) - also I2C SDA",
    },
    {
      id: "a5",
      type: "source",
      position: Position.Left,
      label: "A5",
      dataType: "value",
      offsetPercentage: 90,
      description: "Analog input 5 (10-bit ADC, 0-5V) - also I2C SCL",
    },
    {
      id: "a5",
      type: "target",
      position: Position.Left,
      label: "A5",
      dataType: "value",
      offsetPercentage: 90,
      description: "Analog input 5 (10-bit ADC, 0-5V) - also I2C SCL",
    },

    // Digital pins (Right side)
    {
      id: "d0",
      type: "source",
      position: Position.Right,
      label: "D0",
      dataType: "value",
      offsetPercentage: 90,
      description: "Digital I/O pin 0 - also Serial RX",
    },
    {
      id: "d0",
      type: "target",
      position: Position.Right,
      label: "D0",
      dataType: "value",
      offsetPercentage: 90,
      description: "Digital I/O pin 0 - also Serial RX",
    },
    {
      id: "d1",
      type: "source",
      position: Position.Right,
      label: "D1",
      dataType: "value",
      offsetPercentage: 85,
      description: "Digital I/O pin 1 - also Serial TX",
    },
    {
      id: "d1",
      type: "target",
      position: Position.Right,
      label: "D1",
      dataType: "value",
      offsetPercentage: 85,
      description: "Digital I/O pin 1 - also Serial TX",
    },
    {
      id: "d2",
      type: "source",
      position: Position.Right,
      label: "D2",
      dataType: "value",
      offsetPercentage: 80,
      description: "Digital I/O pin 2 - supports interrupts",
    },
    {
      id: "d2",
      type: "target",
      position: Position.Right,
      label: "D2",
      dataType: "value",
      offsetPercentage: 80,
      description: "Digital I/O pin 2 - supports interrupts",
    },
    {
      id: "d3",
      type: "source",
      position: Position.Right,
      label: "D3",
      dataType: "value",
      offsetPercentage: 75,
      description: "Digital I/O pin 3 - PWM enabled, supports interrupts",
    },
    {
      id: "d3",
      type: "target",
      position: Position.Right,
      label: "D3",
      dataType: "value",
      offsetPercentage: 75,
      description: "Digital I/O pin 3 - PWM enabled, supports interrupts",
    },
    {
      id: "d4",
      type: "source",
      position: Position.Right,
      label: "D4",
      dataType: "value",
      offsetPercentage: 70,
      description: "Digital I/O pin 4",
    },
    {
      id: "d4",
      type: "target",
      position: Position.Right,
      label: "D4",
      dataType: "value",
      offsetPercentage: 70,
      description: "Digital I/O pin 4",
    },
    {
      id: "d5",
      type: "source",
      position: Position.Right,
      label: "D5",
      dataType: "value",
      offsetPercentage: 65,
      description: "Digital I/O pin 5 - PWM enabled",
    },
    {
      id: "d5",
      type: "target",
      position: Position.Right,
      label: "D5",
      dataType: "value",
      offsetPercentage: 65,
      description: "Digital I/O pin 5 - PWM enabled",
    },
    {
      id: "d6",
      type: "source",
      position: Position.Right,
      label: "D6",
      dataType: "value",
      offsetPercentage: 60,
      description: "Digital I/O pin 6 - PWM enabled",
    },
    {
      id: "d6",
      type: "target",
      position: Position.Right,
      label: "D6",
      dataType: "value",
      offsetPercentage: 60,
      description: "Digital I/O pin 6 - PWM enabled",
    },
    {
      id: "d7",
      type: "source",
      position: Position.Right,
      label: "D7",
      dataType: "value",
      offsetPercentage: 55,
      description: "Digital I/O pin 7",
    },
    {
      id: "d7",
      type: "target",
      position: Position.Right,
      label: "D7",
      dataType: "value",
      offsetPercentage: 55,
      description: "Digital I/O pin 7",
    },
    {
      id: "d8",
      type: "source",
      position: Position.Right,
      label: "D8",
      dataType: "value",
      offsetPercentage: 50,
      description: "Digital I/O pin 8",
    },
    {
      id: "d8",
      type: "target",
      position: Position.Right,
      label: "D8",
      dataType: "value",
      offsetPercentage: 50,
      description: "Digital I/O pin 8",
    },
    {
      id: "d9",
      type: "source",
      position: Position.Right,
      label: "D9",
      dataType: "value",
      offsetPercentage: 45,
      description: "Digital I/O pin 9 - PWM enabled",
    },
    {
      id: "d9",
      type: "target",
      position: Position.Right,
      label: "D9",
      dataType: "value",
      offsetPercentage: 45,
      description: "Digital I/O pin 9 - PWM enabled",
    },
    {
      id: "d10",
      type: "source",
      position: Position.Right,
      label: "D10",
      dataType: "value",
      offsetPercentage: 40,
      description: "Digital I/O pin 10 - PWM enabled, SPI SS",
    },
    {
      id: "d10",
      type: "target",
      position: Position.Right,
      label: "D10",
      dataType: "value",
      offsetPercentage: 40,
      description: "Digital I/O pin 10 - PWM enabled, SPI SS",
    },
    {
      id: "d11",
      type: "source",
      position: Position.Right,
      label: "D11",
      dataType: "value",
      offsetPercentage: 35,
      description: "Digital I/O pin 11 - PWM enabled, SPI MOSI",
    },
    {
      id: "d11",
      type: "target",
      position: Position.Right,
      label: "D11",
      dataType: "value",
      offsetPercentage: 35,
      description: "Digital I/O pin 11 - PWM enabled, SPI MOSI",
    },
    {
      id: "d12",
      type: "source",
      position: Position.Right,
      label: "D12",
      dataType: "value",
      offsetPercentage: 30,
      description: "Digital I/O pin 12 - SPI MISO",
    },
    {
      id: "d12",
      type: "target",
      position: Position.Right,
      label: "D12",
      dataType: "value",
      offsetPercentage: 30,
      description: "Digital I/O pin 12 - SPI MISO",
    },
    {
      id: "d13",
      type: "source",
      position: Position.Right,
      label: "D13",
      dataType: "value",
      offsetPercentage: 25,
      description: "Digital I/O pin 13 - built-in LED, SPI SCK",
    },
    {
      id: "d13",
      type: "target",
      position: Position.Right,
      label: "D13",
      dataType: "value",
      offsetPercentage: 25,
      description: "Digital I/O pin 13 - built-in LED, SPI SCK",
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
