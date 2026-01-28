// Arduino board types and runtime type definitions

export type BoardType = "arduino-uno" | "esp32";

export type PinMode = 0 | 1 | 2;

export const PinMode = {
  INPUT: 0 as PinMode,
  OUTPUT: 1 as PinMode,
  INPUT_PULLUP: 2 as PinMode,
} as const;

export interface PinRuntimeState {
  mode: PinMode;
  value: number; // 0-1 for digital, 0-255 for PWM
  pwmValue?: number; // PWM duty cycle if applicable
}

export interface BoardConfig {
  name: string;
  type: BoardType;
  analogResolution: number; // bits (10 for Arduino, 12 for ESP32)
  pwmResolution: number; // bits (8 for both by default)
  clockSpeed: number; // MHz
  pins: {
    digital: string[]; // e.g., ['D0', 'D1', ...]
    analog: string[]; // e.g., ['A0', 'A1', ...]
    pwmCapable: string[]; // pins that support PWM
  };
}

// Arduino Uno board configuration
export const ARDUINO_UNO_CONFIG: BoardConfig = {
  name: "Arduino Uno",
  type: "arduino-uno",
  analogResolution: 10, // 0-1023
  pwmResolution: 8, // 0-255
  clockSpeed: 16, // MHz
  pins: {
    digital: [
      "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7",
      "D8", "D9", "D10", "D11", "D12", "D13"
    ],
    analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
    pwmCapable: ["D3", "D5", "D6", "D9", "D10", "D11"],
  },
};

// ESP32 board configuration
export const ESP32_CONFIG: BoardConfig = {
  name: "ESP32 DevKit",
  type: "esp32",
  analogResolution: 12, // 0-4095
  pwmResolution: 8, // 0-255 (can support up to 16-bit)
  clockSpeed: 240, // MHz
  pins: {
    digital: [
      "GPIO0", "GPIO2", "GPIO4", "GPIO5", "GPIO12", "GPIO13", "GPIO14", "GPIO15",
      "GPIO16", "GPIO17", "GPIO18", "GPIO19", "GPIO21", "GPIO22", "GPIO23",
      "GPIO25", "GPIO26", "GPIO27", "GPIO32", "GPIO33", "GPIO34", "GPIO35",
      "GPIO36", "GPIO37", "GPIO38", "GPIO39"
    ],
    analog: [
      "GPIO32", "GPIO33", "GPIO34", "GPIO35", "GPIO36", "GPIO37", "GPIO38", "GPIO39"
    ],
    pwmCapable: [
      "GPIO2", "GPIO4", "GPIO5", "GPIO12", "GPIO13", "GPIO14", "GPIO15",
      "GPIO16", "GPIO17", "GPIO18", "GPIO19", "GPIO21", "GPIO22", "GPIO23",
      "GPIO25", "GPIO26", "GPIO27", "GPIO32", "GPIO33"
    ],
  },
};

// Get board configuration by type
export function getBoardConfig(type: BoardType): BoardConfig {
  switch (type) {
    case "arduino-uno":
      return ARDUINO_UNO_CONFIG;
    case "esp32":
      return ESP32_CONFIG;
  }
}

// Transpile result types
export interface TranspileResult {
  success: boolean;
  code?: string;
  error?: string;
  warnings?: string[];
}

// Runtime execution context
export interface ArduinoExecutionContext {
  setup: () => void | Promise<void>;
  loop: () => void | Promise<void>;
}
