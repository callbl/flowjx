// Arduino Runtime Engine - Browser implementation of Arduino API

import type { BoardConfig, PinMode, PinRuntimeState } from "./types";

export type PinChangeCallback = (pin: string, state: PinRuntimeState) => void;

export class ArduinoRuntime {
  private boardConfig: BoardConfig;
  private pinStates: Map<string, PinRuntimeState> = new Map();
  private startTime: number = Date.now();
  private loopHandle: number | null = null;
  private isRunning: boolean = false;
  private onPinChange?: PinChangeCallback;
  private onSerialOutput?: (message: string) => void;
  private serialBuffer: string = "";
  private _randomSeedValue: number = Date.now();

  // Arduino constants
  public readonly INPUT = 0;
  public readonly OUTPUT = 1;
  public readonly INPUT_PULLUP = 2;
  public readonly LOW = 0;
  public readonly HIGH = 1;
  public readonly LED_BUILTIN: number;

  constructor(
    boardConfig: BoardConfig,
    onPinChange?: PinChangeCallback,
    onSerialOutput?: (message: string) => void
  ) {
    this.boardConfig = boardConfig;
    this.onPinChange = onPinChange;
    this.onSerialOutput = onSerialOutput;

    // Set LED_BUILTIN based on board type
    this.LED_BUILTIN = boardConfig.type === "arduino-uno" ? 13 : 2;

    // Initialize all pins to INPUT mode with LOW value
    [...boardConfig.pins.digital, ...boardConfig.pins.analog].forEach((pin) => {
      this.pinStates.set(pin.toLowerCase(), {
        mode: this.INPUT as PinMode,
        value: this.LOW,
      });
    });
  }

  /**
   * Get the API object to inject into user code scope
   */
  getAPI() {
    return {
      // Pin control
      pinMode: this.pinMode.bind(this),
      digitalWrite: this.digitalWrite.bind(this),
      digitalRead: this.digitalRead.bind(this),
      analogWrite: this.analogWrite.bind(this),
      analogRead: this.analogRead.bind(this),

      // Timing
      delay: this.delay.bind(this),
      delayMicroseconds: this.delayMicroseconds.bind(this),
      millis: this.millis.bind(this),
      micros: this.micros.bind(this),

      // Math
      map: this.map.bind(this),
      constrain: this.constrain.bind(this),
      min: Math.min,
      max: Math.max,
      abs: Math.abs,
      pow: Math.pow,
      sqrt: Math.sqrt,
      random: this.random.bind(this),
      randomSeed: this.randomSeed.bind(this),

      // Serial
      Serial: this.createSerialObject(),

      // Constants
      INPUT: this.INPUT,
      OUTPUT: this.OUTPUT,
      INPUT_PULLUP: this.INPUT_PULLUP,
      LOW: this.LOW,
      HIGH: this.HIGH,
      LED_BUILTIN: this.LED_BUILTIN,
    };
  }

  /**
   * Execute user program (setup once, then loop repeatedly)
   */
  async execute(code: string): Promise<void> {
    try {
      // Create execution context with API
      const api = this.getAPI();
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const executor = new AsyncFunction(...Object.keys(api), code);

      // Execute to get setup and loop functions
      const context = executor(...Object.values(api));

      if (!context.setup || !context.loop) {
        throw new Error("Program must define setup() and loop() functions");
      }

      // Run setup once
      await context.setup();

      // Start loop
      this.isRunning = true;
      this.runLoop(context.loop);
    } catch (error) {
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Run loop function repeatedly
   */
  private runLoop(loopFn: () => Promise<void>): void {
    if (!this.isRunning) return;

    const runIteration = async () => {
      try {
        await loopFn();
      } catch (error) {
        console.error("Error in loop():", error);
        this.stop();
        return;
      }

      // Schedule next iteration with minimum 10ms delay
      if (this.isRunning) {
        this.loopHandle = window.setTimeout(runIteration, 10);
      }
    };

    runIteration();
  }

  /**
   * Stop execution
   */
  stop(): void {
    this.isRunning = false;
    if (this.loopHandle !== null) {
      clearTimeout(this.loopHandle);
      this.loopHandle = null;
    }
  }

  /**
   * Reset runtime state
   */
  reset(): void {
    this.stop();
    this.startTime = Date.now();
    this.serialBuffer = "";
    this.pinStates.forEach((state) => {
      state.mode = this.INPUT as PinMode;
      state.value = this.LOW;
      state.pwmValue = undefined;
    });
  }

  // ===== Arduino API Functions =====

  /**
   * Set pin mode
   */
  pinMode(pin: number, mode: number): void {
    const pinName = this.normalizePinName(pin);
    const state = this.pinStates.get(pinName);
    if (!state) {
      console.warn(`pinMode: Unknown pin ${pin}`);
      return;
    }

    state.mode = mode as PinMode;
    this.notifyPinChange(pinName, state);
  }

  /**
   * Write digital value to pin
   */
  digitalWrite(pin: number, value: number): void {
    const pinName = this.normalizePinName(pin);
    const state = this.pinStates.get(pinName);
    if (!state) {
      console.warn(`digitalWrite: Unknown pin ${pin}`);
      return;
    }

    if (state.mode !== this.OUTPUT) {
      console.warn(`digitalWrite: Pin ${pin} not set to OUTPUT mode`);
    }

    state.value = value === this.HIGH ? 1 : 0;
    state.pwmValue = undefined;
    this.notifyPinChange(pinName, state);
  }

  /**
   * Read digital value from pin
   */
  digitalRead(pin: number): number {
    const pinName = this.normalizePinName(pin);
    const state = this.pinStates.get(pinName);
    if (!state) {
      console.warn(`digitalRead: Unknown pin ${pin}`);
      return this.LOW;
    }

    return state.value > 0 ? this.HIGH : this.LOW;
  }

  /**
   * Write analog value (PWM) to pin
   */
  analogWrite(pin: number, value: number): void {
    const pinName = this.normalizePinName(pin);
    const state = this.pinStates.get(pinName);
    if (!state) {
      console.warn(`analogWrite: Unknown pin ${pin}`);
      return;
    }

    if (!this.boardConfig.pins.pwmCapable.includes(pinName.toUpperCase())) {
      console.warn(`analogWrite: Pin ${pin} does not support PWM`);
    }

    // Clamp to 0-255
    const clampedValue = Math.max(0, Math.min(255, value));
    state.value = clampedValue;
    state.pwmValue = clampedValue;
    this.notifyPinChange(pinName, state);
  }

  /**
   * Read analog value from pin
   */
  analogRead(pin: number): number {
    const pinName = this.normalizePinName(pin);
    const state = this.pinStates.get(pinName);
    if (!state) {
      console.warn(`analogRead: Unknown pin ${pin}`);
      return 0;
    }

    // Return value scaled to board's analog resolution
    const maxValue = Math.pow(2, this.boardConfig.analogResolution) - 1;
    return Math.floor((state.value / 255) * maxValue);
  }

  /**
   * Delay execution (async)
   */
  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Delay execution in microseconds (minimum 1ms in browser)
   */
  delayMicroseconds(us: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, Math.max(1, us / 1000)));
  }

  /**
   * Get milliseconds since program start
   */
  millis(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Get microseconds since program start
   */
  micros(): number {
    return (Date.now() - this.startTime) * 1000;
  }

  /**
   * Map value from one range to another
   */
  map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Constrain value to range
   */
  constrain(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Generate random number
   */
  random(min: number, max?: number): number {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Seed random number generator (no-op in JavaScript)
   */
  randomSeed(seed: number): void {
    this._randomSeedValue = seed;
    // Note: JavaScript's Math.random() can't be seeded
  }

  /**
   * Create Serial object for communication
   */
  private createSerialObject() {
    return {
      begin: (baudRate: number) => {
        // No-op in browser
      },
      print: (value: any) => {
        const message = String(value);
        this.serialBuffer += message;
        if (this.onSerialOutput) {
          this.onSerialOutput(message);
        }
      },
      println: (value: any) => {
        const message = String(value) + "\n";
        this.serialBuffer += message;
        if (this.onSerialOutput) {
          this.onSerialOutput(message);
        }
      },
      available: () => {
        return this.serialBuffer.length;
      },
      read: () => {
        if (this.serialBuffer.length === 0) return -1;
        const char = this.serialBuffer.charCodeAt(0);
        this.serialBuffer = this.serialBuffer.slice(1);
        return char;
      },
      readString: () => {
        const str = this.serialBuffer;
        this.serialBuffer = "";
        return str;
      },
      write: (value: any) => {
        if (typeof value === "number") {
          this.serialBuffer += String.fromCharCode(value);
        } else {
          this.serialBuffer += String(value);
        }
      },
    };
  }

  /**
   * Normalize pin name (convert pin number to string identifier)
   */
  private normalizePinName(pin: number | string): string {
    if (typeof pin === "string") {
      return pin.toLowerCase();
    }

    // For Arduino Uno: 0-13 are digital, 14-19 are analog (A0-A5)
    if (this.boardConfig.type === "arduino-uno") {
      if (pin >= 0 && pin <= 13) {
        return `d${pin}`;
      } else if (pin >= 14 && pin <= 19) {
        return `a${pin - 14}`;
      }
    }

    // For ESP32: use GPIO numbers
    if (this.boardConfig.type === "esp32") {
      return `gpio${pin}`;
    }

    return String(pin).toLowerCase();
  }

  /**
   * Notify pin state change callback
   */
  private notifyPinChange(pin: string, state: PinRuntimeState): void {
    if (this.onPinChange) {
      this.onPinChange(pin, state);
    }
  }

  /**
   * Set external pin state (from circuit simulation)
   */
  setExternalPinState(pin: string, value: number): void {
    const state = this.pinStates.get(pin.toLowerCase());
    if (state && state.mode === this.INPUT) {
      state.value = value;
    }
  }

  /**
   * Get current pin state
   */
  getPinState(pin: string): PinRuntimeState | undefined {
    return this.pinStates.get(pin.toLowerCase());
  }

  /**
   * Get all pin states
   */
  getAllPinStates(): Map<string, PinRuntimeState> {
    return new Map(this.pinStates);
  }
}
