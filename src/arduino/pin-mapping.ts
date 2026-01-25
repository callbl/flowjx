/**
 * Arduino Uno pin mapping to ATmega328P ports
 * Maps Arduino digital pin numbers to AVR port/bit combinations
 */
export interface PinMapping {
  port: 'B' | 'C' | 'D';
  bit: number;
}

/**
 * Complete pin mapping for Arduino Uno (ATmega328P)
 */
export const ARDUINO_UNO_PIN_MAP: Record<number, PinMapping> = {
  // Digital pins 0-7 (Port D)
  0: { port: 'D', bit: 0 },  // RX
  1: { port: 'D', bit: 1 },  // TX
  2: { port: 'D', bit: 2 },
  3: { port: 'D', bit: 3 },  // PWM
  4: { port: 'D', bit: 4 },
  5: { port: 'D', bit: 5 },  // PWM
  6: { port: 'D', bit: 6 },  // PWM
  7: { port: 'D', bit: 7 },

  // Digital pins 8-13 (Port B)
  8: { port: 'B', bit: 0 },
  9: { port: 'B', bit: 1 },  // PWM
  10: { port: 'B', bit: 2 }, // PWM
  11: { port: 'B', bit: 3 }, // PWM
  12: { port: 'B', bit: 4 },
  13: { port: 'B', bit: 5 }, // Built-in LED

  // Analog pins A0-A5 (Port C)
  14: { port: 'C', bit: 0 }, // A0
  15: { port: 'C', bit: 1 }, // A1
  16: { port: 'C', bit: 2 }, // A2
  17: { port: 'C', bit: 3 }, // A3
  18: { port: 'C', bit: 4 }, // A4
  19: { port: 'C', bit: 5 }, // A5
};

/**
 * Map Arduino digital pin to AVR port configuration
 */
export function getPortMapping(digitalPin: number): PinMapping | undefined {
  return ARDUINO_UNO_PIN_MAP[digitalPin];
}

/**
 * Map handle ID to Arduino pin number
 */
export function handleIdToPinNumber(handleId: string): number | undefined {
  // Digital pins: d0-d13 -> 0-13
  if (handleId.startsWith('d')) {
    const pin = parseInt(handleId.substring(1), 10);
    if (!isNaN(pin) && pin >= 0 && pin <= 13) {
      return pin;
    }
  }
  
  // Analog pins: a0-a5 -> 14-19
  if (handleId.startsWith('a')) {
    const pin = parseInt(handleId.substring(1), 10);
    if (!isNaN(pin) && pin >= 0 && pin <= 5) {
      return 14 + pin;
    }
  }
  
  return undefined;
}

/**
 * Map Arduino pin number to handle ID
 */
export function pinNumberToHandleId(pinNumber: number): string | undefined {
  if (pinNumber >= 0 && pinNumber <= 13) {
    return `d${pinNumber}`;
  }
  if (pinNumber >= 14 && pinNumber <= 19) {
    return `a${pinNumber - 14}`;
  }
  return undefined;
}
