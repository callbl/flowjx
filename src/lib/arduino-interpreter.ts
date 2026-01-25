/**
 * Arduino Code Interpreter
 * Executes a simplified subset of Arduino code
 */

export type PinMode = "INPUT" | "OUTPUT" | "INPUT_PULLUP";
export type PinValue = "HIGH" | "LOW" | number;

export interface ArduinoState {
  digitalPins: Map<number, { mode: PinMode; value: PinValue }>;
  analogPins: Map<number, number>;
  serialOutput: string[];
  isRunning: boolean;
  loopInterval?: number;
}

export class ArduinoInterpreter {
  private state: ArduinoState;
  private setupCode: string = "";
  private loopCode: string = "";
  private loopHandle?: number;

  constructor() {
    this.state = {
      digitalPins: new Map(),
      analogPins: new Map(),
      serialOutput: [],
      isRunning: false,
    };

    // Initialize digital pins (0-13)
    for (let i = 0; i <= 13; i++) {
      this.state.digitalPins.set(i, { mode: "INPUT", value: "LOW" });
    }

    // Initialize analog pins (A0-A5 = 14-19)
    for (let i = 14; i <= 19; i++) {
      this.state.analogPins.set(i, 0);
    }
  }

  /**
   * Parse Arduino code and extract setup() and loop() functions
   */
  parseCode(code: string): { setup: string; loop: string } {
    const setupMatch = code.match(/void\s+setup\s*\(\s*\)\s*{([^}]*)}/s);
    const loopMatch = code.match(/void\s+loop\s*\(\s*\)\s*{([^}]*)}/s);

    return {
      setup: setupMatch ? setupMatch[1].trim() : "",
      loop: loopMatch ? loopMatch[1].trim() : "",
    };
  }

  /**
   * Execute a single line of Arduino code
   */
  private executeLine(line: string): void {
    line = line.trim();
    if (!line || line.startsWith("//")) return;

    // pinMode(pin, mode)
    const pinModeMatch = line.match(/pinMode\s*\(\s*(\d+)\s*,\s*(\w+)\s*\)/);
    if (pinModeMatch) {
      const pin = parseInt(pinModeMatch[1]);
      const mode = pinModeMatch[2] as PinMode;
      const pinState = this.state.digitalPins.get(pin);
      if (pinState) {
        pinState.mode = mode;
      }
      return;
    }

    // digitalWrite(pin, value)
    const digitalWriteMatch = line.match(
      /digitalWrite\s*\(\s*(\d+)\s*,\s*(\w+)\s*\)/
    );
    if (digitalWriteMatch) {
      const pin = parseInt(digitalWriteMatch[1]);
      const value = digitalWriteMatch[2] as "HIGH" | "LOW";
      const pinState = this.state.digitalPins.get(pin);
      if (pinState && pinState.mode === "OUTPUT") {
        pinState.value = value;
      }
      return;
    }

    // analogWrite(pin, value)
    const analogWriteMatch = line.match(
      /analogWrite\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/
    );
    if (analogWriteMatch) {
      const pin = parseInt(analogWriteMatch[1]);
      const value = parseInt(analogWriteMatch[2]);
      const pinState = this.state.digitalPins.get(pin);
      if (pinState && pinState.mode === "OUTPUT") {
        pinState.value = Math.max(0, Math.min(255, value));
      }
      return;
    }

    // Serial.println(text)
    const serialMatch = line.match(/Serial\.println\s*\(\s*"([^"]*)"\s*\)/);
    if (serialMatch) {
      this.state.serialOutput.push(serialMatch[1]);
      // Keep only last 50 lines
      if (this.state.serialOutput.length > 50) {
        this.state.serialOutput.shift();
      }
      return;
    }

    // delay(ms) - ignored in this implementation
    if (line.match(/delay\s*\(\s*\d+\s*\)/)) {
      return;
    }
  }

  /**
   * Run the setup function once
   */
  runSetup(): void {
    if (!this.setupCode) return;

    const lines = this.setupCode.split(";");
    for (const line of lines) {
      try {
        this.executeLine(line);
      } catch (error) {
        console.error("Error executing setup line:", line, error);
      }
    }
  }

  /**
   * Run the loop function once
   */
  runLoop(): void {
    if (!this.loopCode) return;

    const lines = this.loopCode.split(";");
    for (const line of lines) {
      try {
        this.executeLine(line);
      } catch (error) {
        console.error("Error executing loop line:", line, error);
      }
    }
  }

  /**
   * Start running the Arduino code
   */
  start(code: string, loopInterval: number = 100): void {
    this.stop();

    const { setup, loop } = this.parseCode(code);
    this.setupCode = setup;
    this.loopCode = loop;

    // Run setup once
    this.runSetup();

    // Start loop
    this.state.isRunning = true;
    this.state.loopInterval = loopInterval;
    this.loopHandle = window.setInterval(() => {
      this.runLoop();
    }, loopInterval);
  }

  /**
   * Stop running the Arduino code
   */
  stop(): void {
    if (this.loopHandle) {
      clearInterval(this.loopHandle);
      this.loopHandle = undefined;
    }
    this.state.isRunning = false;
  }

  /**
   * Get current state
   */
  getState(): ArduinoState {
    return this.state;
  }

  /**
   * Set external pin value (for input pins from circuit)
   */
  setDigitalInput(pin: number, value: "HIGH" | "LOW"): void {
    const pinState = this.state.digitalPins.get(pin);
    if (pinState && pinState.mode === "INPUT") {
      pinState.value = value;
    }
  }

  /**
   * Set analog input value (for analog pins from circuit)
   */
  setAnalogInput(pin: number, value: number): void {
    this.state.analogPins.set(pin, Math.max(0, Math.min(1023, value)));
  }

  /**
   * Get digital pin output value
   */
  getDigitalOutput(pin: number): PinValue {
    const pinState = this.state.digitalPins.get(pin);
    return pinState?.value ?? "LOW";
  }

  /**
   * Clear serial output
   */
  clearSerial(): void {
    this.state.serialOutput = [];
  }
}
