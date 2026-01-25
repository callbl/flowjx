/**
 * Arduino code compilation service
 * Compiles Arduino C++ code to AVR machine code (Intel HEX format)
 */

export interface CompilationResult {
  success: boolean;
  hex?: string; // Compiled hex code
  errors?: string[];
  warnings?: string[];
}

/**
 * Compile Arduino code to AVR machine code
 * 
 * For now, uses pre-compiled hex files for common sketches.
 * In production, you could use:
 * 1. Arduino CLI WebAssembly build
 * 2. Cloud compilation service (Wokwi API)
 * 3. Server-side compilation endpoint
 */
export async function compileArduinoCode(
  code: string
): Promise<CompilationResult> {
  try {
    // Check if code matches a pre-compiled sketch
    const normalizedCode = code.trim().replace(/\s+/g, ' ');
    
    for (const [name, sketch] of Object.entries(DEFAULT_SKETCHES)) {
      const normalizedSketch = sketch.trim().replace(/\s+/g, ' ');
      if (normalizedCode === normalizedSketch) {
        const hex = PRECOMPILED_HEX[name as keyof typeof PRECOMPILED_HEX];
        if (hex) {
          return {
            success: true,
            hex,
          };
        }
      }
    }

    // For custom code, return a helpful message
    return {
      success: false,
      errors: [
        'Custom code compilation not yet supported.',
        'Please use one of the provided example sketches.',
        'Future updates will add full compilation support.',
      ],
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Parse Intel HEX format to Uint16Array for AVR8js
 */
export function parseHex(hex: string): Uint16Array {
  const program = new Uint16Array(16384); // 32KB for ATmega328P
  
  const lines = hex.split('\n');
  
  for (const line of lines) {
    if (!line.startsWith(':')) continue;
    
    const bytes = parseInt(line.substr(1, 2), 16);
    const addr = parseInt(line.substr(3, 4), 16) / 2; // Word address
    const type = parseInt(line.substr(7, 2), 16);
    
    if (type === 0) { // Data record
      for (let i = 0; i < bytes; i += 2) {
        const byte1 = parseInt(line.substr(9 + i * 2, 2), 16);
        const byte2 = parseInt(line.substr(11 + i * 2, 2), 16);
        program[addr + i / 2] = byte1 | (byte2 << 8);
      }
    }
  }
  
  return program;
}

/**
 * Default Arduino sketches for quick start
 */
export const DEFAULT_SKETCHES = {
  blink: `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`,

  multiLED: `const int ledPins[] = {9, 10, 11, 12, 13};
const int numLeds = 5;

void setup() {
  for (int i = 0; i < numLeds; i++) {
    pinMode(ledPins[i], OUTPUT);
  }
}

void loop() {
  for (int i = 0; i < numLeds; i++) {
    digitalWrite(ledPins[i], HIGH);
    delay(200);
    digitalWrite(ledPins[i], LOW);
  }
}`,

  pwmFade: `int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(ledPin, brightness);
    delay(10);
  }
  for (int brightness = 255; brightness >= 0; brightness--) {
    analogWrite(ledPin, brightness);
    delay(10);
  }
}`,
};

/**
 * Pre-compiled HEX files for default sketches
 * These are compiled using Arduino CLI for ATmega328P
 * 
 * TODO: Add actual compiled hex files
 * For now, these are placeholders - you'll need to compile the sketches
 * using Arduino CLI and paste the HEX output here
 */
export const PRECOMPILED_HEX: Record<keyof typeof DEFAULT_SKETCHES, string> = {
  blink: ':100000000C9434000C943E000C943E000C943E0082\n:00000001FF',
  multiLED: ':100000000C9434000C943E000C943E000C943E0082\n:00000001FF',
  pwmFade: ':100000000C9434000C943E000C943E000C943E0082\n:00000001FF',
};
