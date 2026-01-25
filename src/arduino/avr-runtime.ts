import { CPU, AVRIOPort, AVRTimer, timer0Config, timer1Config, timer2Config, AVRUSART, usart0Config } from 'avr8js';
import { getPortMapping, pinNumberToHandleId } from './pin-mapping';

export type PinMode = 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
export type PinValue = 0 | 1;

export interface PinState {
  mode: PinMode;
  value: PinValue;
}

export interface ArduinoRuntimeCallbacks {
  onPinChange?: (pin: number, value: PinValue) => void;
  onSerialData?: (data: string) => void;
}

/**
 * AVR8js runtime wrapper for Arduino Uno
 * Manages CPU execution and peripheral simulation
 */
export class ArduinoRuntime {
  private cpu: CPU;
  private portB: AVRIOPort;
  private portC: AVRIOPort;
  private portD: AVRIOPort;
  private timer0: AVRTimer;
  private timer1: AVRTimer;
  private timer2: AVRTimer;
  private usart: AVRUSART;
  private running = false;
  private animationFrame?: number;
  private callbacks: ArduinoRuntimeCallbacks;
  private pinStates: Map<number, PinState> = new Map();
  private lastPortValues = { B: 0, C: 0, D: 0 };

  constructor(program: Uint16Array, callbacks: ArduinoRuntimeCallbacks = {}) {
    this.callbacks = callbacks;
    
    // Initialize CPU
    this.cpu = new CPU(program);
    
    // Initialize I/O ports
    this.portB = new AVRIOPort(this.cpu, 'B');
    this.portC = new AVRIOPort(this.cpu, 'C');
    this.portD = new AVRIOPort(this.cpu, 'D');
    
    // Initialize timers
    this.timer0 = new AVRTimer(this.cpu, timer0Config);
    this.timer1 = new AVRTimer(this.cpu, timer1Config);
    this.timer2 = new AVRTimer(this.cpu, timer2Config);
    
    // Initialize USART (Serial)
    this.usart = new AVRUSART(this.cpu, usart0Config, 16000000);
    
    // Set up port listeners
    this.setupPortListeners();
    
    // Set up serial listener
    this.usart.onByteTransmit = (value) => {
      if (this.callbacks.onSerialData) {
        this.callbacks.onSerialData(String.fromCharCode(value));
      }
    };
  }

  /**
   * Set up listeners for port changes to detect pin state changes
   */
  private setupPortListeners() {
    // Monitor port B (pins 8-13)
    this.portB.addListener(() => {
      this.checkPortChanges('B', this.portB);
    });
    
    // Monitor port C (analog pins A0-A5)
    this.portC.addListener(() => {
      this.checkPortChanges('C', this.portC);
    });
    
    // Monitor port D (pins 0-7)
    this.portD.addListener(() => {
      this.checkPortChanges('D', this.portD);
    });
  }

  /**
   * Check for changes in port values and trigger callbacks
   */
  private checkPortChanges(portName: 'B' | 'C' | 'D', port: AVRIOPort) {
    const currentValue = port.portValue;
    const lastValue = this.lastPortValues[portName];
    
    if (currentValue !== lastValue) {
      this.lastPortValues[portName] = currentValue;
      
      // Check each bit
      for (let bit = 0; bit < 8; bit++) {
        const currentBit = (currentValue >> bit) & 1;
        const lastBit = (lastValue >> bit) & 1;
        
        if (currentBit !== lastBit) {
          // Find the Arduino pin number
          const pinNumber = this.getArduinoPinNumber(portName, bit);
          if (pinNumber !== undefined && this.callbacks.onPinChange) {
            this.callbacks.onPinChange(pinNumber, currentBit as PinValue);
          }
        }
      }
    }
  }

  /**
   * Get Arduino pin number from port and bit
   */
  private getArduinoPinNumber(port: 'B' | 'C' | 'D', bit: number): number | undefined {
    // Port D: pins 0-7
    if (port === 'D' && bit >= 0 && bit <= 7) return bit;
    // Port B: pins 8-13
    if (port === 'B' && bit >= 0 && bit <= 5) return 8 + bit;
    // Port C: A0-A5 (pins 14-19)
    if (port === 'C' && bit >= 0 && bit <= 5) return 14 + bit;
    return undefined;
  }

  /**
   * Start the Arduino program execution
   */
  start() {
    if (this.running) return;
    this.running = true;
    this.execute();
  }

  /**
   * Stop the Arduino program execution
   */
  stop() {
    this.running = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  /**
   * Reset the Arduino
   */
  reset() {
    this.stop();
    this.cpu.reset();
    this.pinStates.clear();
    this.lastPortValues = { B: 0, C: 0, D: 0 };
  }

  /**
   * Main execution loop
   */
  private execute() {
    if (!this.running) return;
    
    // Execute instructions (run for ~1ms of simulated time)
    const cyclesToExecute = 16000; // 16MHz, so ~1ms
    for (let i = 0; i < cyclesToExecute; i++) {
      this.cpu.tick();
    }
    
    // Schedule next execution
    this.animationFrame = requestAnimationFrame(() => this.execute());
  }

  /**
   * Get current state of all pins
   */
  getAllPinStates(): Map<number, PinState> {
    const states = new Map<number, PinState>();
    
    // Read all ports
    for (let pin = 0; pin <= 19; pin++) {
      const mapping = getPortMapping(pin);
      if (!mapping) continue;
      
      const port = this.getPort(mapping.port);
      const ddr = port.ddr; // Data Direction Register
      const portReg = port.portValue; // PORT register
      
      const isOutput = (ddr >> mapping.bit) & 1;
      const value = (portReg >> mapping.bit) & 1;
      
      states.set(pin, {
        mode: isOutput ? 'OUTPUT' : 'INPUT',
        value: value as PinValue,
      });
    }
    
    return states;
  }

  /**
   * Get port by name
   */
  private getPort(name: 'B' | 'C' | 'D'): AVRIOPort {
    switch (name) {
      case 'B': return this.portB;
      case 'C': return this.portC;
      case 'D': return this.portD;
    }
  }

  /**
   * Manually set an input pin value (for external input simulation)
   */
  setInputPin(pin: number, value: PinValue) {
    const mapping = getPortMapping(pin);
    if (!mapping) return;
    
    const port = this.getPort(mapping.port);
    
    // Set PIN register (input value)
    if (value) {
      port.pinValue |= (1 << mapping.bit);
    } else {
      port.pinValue &= ~(1 << mapping.bit);
    }
  }
}
