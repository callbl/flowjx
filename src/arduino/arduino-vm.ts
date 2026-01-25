/**
 * Simplified Arduino Virtual Machine
 * Interprets Arduino code patterns and simulates execution
 * 
 * This is a simplified interpreter that recognizes common Arduino patterns
 * and simulates their behavior without full AVR emulation.
 */

import { handleIdToPinNumber, pinNumberToHandleId } from './pin-mapping';

export type PinMode = 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
export type PinValue = 0 | 1;

export interface PinState {
  mode: PinMode;
  value: PinValue;
}

export interface ArduinoVMState {
  isRunning: boolean;
  isCompiling: boolean;
  compilationError?: string;
  pinStates: Record<string, PinState>; // handleId -> PinState
  serialOutput: string;
}

export interface ArduinoVMCallbacks {
  onStateChange: (state: ArduinoVMState) => void;
  onPinUpdate: (handleId: string, mode: PinMode, value: PinValue) => void;
}

interface ParsedSketch {
  setupCommands: Command[];
  loopCommands: Command[];
}

interface Command {
  type: 'pinMode' | 'digitalWrite' | 'analogWrite' | 'delay' | 'serialPrint';
  pin?: number;
  value?: number | string;
  mode?: PinMode;
}

/**
 * Simplified Arduino Virtual Machine
 * Parses and executes Arduino code patterns
 */
export class ArduinoVM {
  private state: ArduinoVMState = {
    isRunning: false,
    isCompiling: false,
    pinStates: {},
    serialOutput: '',
  };
  private callbacks: ArduinoVMCallbacks;
  private sketch?: ParsedSketch;
  private loopInterval?: number;
  private pinModes: Map<number, PinMode> = new Map();
  private pinValues: Map<number, PinValue> = new Map();

  constructor(callbacks: ArduinoVMCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Load and parse Arduino code
   */
  async loadCode(code: string): Promise<boolean> {
    this.stop();
    this.updateState({ isCompiling: true, compilationError: undefined });

    try {
      // Parse the sketch
      const sketch = this.parseSketch(code);
      this.sketch = sketch;

      this.updateState({ isCompiling: false });
      return true;
    } catch (error) {
      this.updateState({
        isCompiling: false,
        compilationError: error instanceof Error ? error.message : 'Parse error',
      });
      return false;
    }
  }

  /**
   * Parse Arduino sketch into commands
   */
  private parseSketch(code: string): ParsedSketch {
    const setupCommands: Command[] = [];
    const loopCommands: Command[] = [];

    // Extract setup() function
    const setupMatch = code.match(/void\s+setup\s*\(\s*\)\s*\{([^}]+)\}/s);
    if (setupMatch) {
      setupCommands.push(...this.parseCommands(setupMatch[1]));
    }

    // Extract loop() function
    const loopMatch = code.match(/void\s+loop\s*\(\s*\)\s*\{([^}]+)\}/s);
    if (loopMatch) {
      loopCommands.push(...this.parseCommands(loopMatch[1]));
    }

    return { setupCommands, loopCommands };
  }

  /**
   * Parse commands from code block
   */
  private parseCommands(code: string): Command[] {
    const commands: Command[] = [];
    const lines = code.split(';').map(l => l.trim()).filter(l => l.length > 0);

    for (const line of lines) {
      // pinMode(pin, mode)
      const pinModeMatch = line.match(/pinMode\s*\(\s*(\d+)\s*,\s*(INPUT|OUTPUT|INPUT_PULLUP)\s*\)/);
      if (pinModeMatch) {
        commands.push({
          type: 'pinMode',
          pin: parseInt(pinModeMatch[1], 10),
          mode: pinModeMatch[2] as PinMode,
        });
        continue;
      }

      // digitalWrite(pin, HIGH/LOW)
      const digitalWriteMatch = line.match(/digitalWrite\s*\(\s*(\d+)\s*,\s*(HIGH|LOW)\s*\)/);
      if (digitalWriteMatch) {
        commands.push({
          type: 'digitalWrite',
          pin: parseInt(digitalWriteMatch[1], 10),
          value: digitalWriteMatch[2] === 'HIGH' ? 1 : 0,
        });
        continue;
      }

      // analogWrite(pin, value)
      const analogWriteMatch = line.match(/analogWrite\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
      if (analogWriteMatch) {
        commands.push({
          type: 'analogWrite',
          pin: parseInt(analogWriteMatch[1], 10),
          value: parseInt(analogWriteMatch[2], 10),
        });
        continue;
      }

      // delay(ms)
      const delayMatch = line.match(/delay\s*\(\s*(\d+)\s*\)/);
      if (delayMatch) {
        commands.push({
          type: 'delay',
          value: parseInt(delayMatch[1], 10),
        });
        continue;
      }

      // Serial.print/println
      const serialMatch = line.match(/Serial\.print(?:ln)?\s*\(\s*["']([^"']+)["']\s*\)/);
      if (serialMatch) {
        commands.push({
          type: 'serialPrint',
          value: serialMatch[1],
        });
        continue;
      }
    }

    return commands;
  }

  /**
   * Execute a command
   */
  private async executeCommand(command: Command): Promise<number> {
    switch (command.type) {
      case 'pinMode':
        if (command.pin !== undefined && command.mode) {
          this.setPinMode(command.pin, command.mode);
        }
        return 0;

      case 'digitalWrite':
        if (command.pin !== undefined && command.value !== undefined) {
          this.setPinValue(command.pin, command.value as PinValue);
        }
        return 0;

      case 'analogWrite':
        if (command.pin !== undefined && command.value !== undefined) {
          // Convert PWM value (0-255) to digital (0/1) for simplicity
          const digitalValue = command.value > 127 ? 1 : 0;
          this.setPinValue(command.pin, digitalValue as PinValue);
        }
        return 0;

      case 'delay':
        return command.value as number || 0;

      case 'serialPrint':
        this.appendSerial(command.value as string);
        return 0;

      default:
        return 0;
    }
  }

  /**
   * Set pin mode
   */
  private setPinMode(pin: number, mode: PinMode) {
    this.pinModes.set(pin, mode);
    const handleId = pinNumberToHandleId(pin);
    if (handleId) {
      const value = this.pinValues.get(pin) || 0;
      this.state.pinStates[handleId] = { mode, value };
      this.callbacks.onPinUpdate(handleId, mode, value);
    }
  }

  /**
   * Set pin value
   */
  private setPinValue(pin: number, value: PinValue) {
    this.pinValues.set(pin, value);
    const handleId = pinNumberToHandleId(pin);
    if (handleId) {
      const mode = this.pinModes.get(pin) || 'INPUT';
      this.state.pinStates[handleId] = { mode, value };
      this.callbacks.onPinUpdate(handleId, mode, value);
    }
  }

  /**
   * Append to serial output
   */
  private appendSerial(text: string) {
    this.updateState({
      serialOutput: this.state.serialOutput + text + '\n',
    });
  }

  /**
   * Start execution
   */
  async start() {
    if (!this.sketch || this.state.isRunning) return;

    this.updateState({ isRunning: true, serialOutput: '' });
    this.pinModes.clear();
    this.pinValues.clear();

    // Execute setup once
    for (const command of this.sketch.setupCommands) {
      await this.executeCommand(command);
    }

    // Execute loop repeatedly
    this.runLoop();
  }

  /**
   * Run loop() function repeatedly
   */
  private async runLoop() {
    if (!this.sketch || !this.state.isRunning) return;

    let totalDelay = 0;

    // Execute all commands in loop
    for (const command of this.sketch.loopCommands) {
      const delay = await this.executeCommand(command);
      totalDelay += delay;
    }

    // Schedule next iteration
    this.loopInterval = window.setTimeout(() => this.runLoop(), totalDelay || 100);
  }

  /**
   * Stop execution
   */
  stop() {
    if (this.loopInterval) {
      clearTimeout(this.loopInterval);
      this.loopInterval = undefined;
    }
    this.updateState({ isRunning: false });
  }

  /**
   * Reset the VM
   */
  reset() {
    this.stop();
    this.pinModes.clear();
    this.pinValues.clear();
    this.updateState({
      pinStates: {},
      serialOutput: '',
    });
  }

  /**
   * Update state and notify callbacks
   */
  private updateState(updates: Partial<ArduinoVMState>) {
    this.state = { ...this.state, ...updates };
    this.callbacks.onStateChange(this.state);
  }

  /**
   * Get current state
   */
  getState(): ArduinoVMState {
    return { ...this.state };
  }

  /**
   * Set input pin value (for external input simulation)
   */
  setInputPin(handleId: string, value: PinValue) {
    const pin = handleIdToPinNumber(handleId);
    if (pin !== undefined) {
      this.setPinValue(pin, value);
    }
  }
}
