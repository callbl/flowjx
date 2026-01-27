// Arduino state management with Zustand

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  BoardType,
  PinRuntimeState,
  TranspileResult,
} from "./types";
import { getBoardConfig } from "./types";
import { ArduinoInterpreter } from "./interpreter";
import { ArduinoRuntime } from "./runtime";

interface ArduinoState {
  // Code state
  code: string;
  activeNodeId: string | null;
  boardType: BoardType;

  // Runtime state
  isRunning: boolean;
  serialOutput: string[];
  pinStates: Map<string, PinRuntimeState>;
  compileResult: TranspileResult | null;

  // Instances
  runtime: ArduinoRuntime | null;
  interpreter: ArduinoInterpreter | null;

  // Actions
  setCode: (code: string) => void;
  setActiveNodeId: (nodeId: string | null) => void;
  setBoardType: (type: BoardType) => void;
  compile: () => TranspileResult;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  clearSerialOutput: () => void;
  addSerialOutput: (message: string) => void;
  updatePinStates: () => void;
}

export const useArduinoStore = create<ArduinoState>()(
  devtools(
    (set, get) => ({
      // Initial state
      code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}`,
      activeNodeId: null,
      boardType: "arduino-uno",
      isRunning: false,
      serialOutput: [],
      pinStates: new Map(),
      compileResult: null,
      runtime: null,
      interpreter: null,

      // Set code
      setCode: (code: string) => {
        set({ code });
      },

      // Set active Arduino node
      setActiveNodeId: (nodeId: string | null) => {
        set({ activeNodeId: nodeId });
      },

      // Set board type
      setBoardType: (type: BoardType) => {
        const state = get();

        // Stop current runtime if running
        if (state.runtime) {
          state.runtime.stop();
        }

        // Create new interpreter for board
        const boardConfig = getBoardConfig(type);
        const interpreter = new ArduinoInterpreter(boardConfig);

        set({
          boardType: type,
          interpreter,
          runtime: null,
          isRunning: false,
          compileResult: null,
        });
      },

      // Compile code
      compile: () => {
        const state = get();

        // Create interpreter if needed
        let interpreter = state.interpreter;
        if (!interpreter) {
          const boardConfig = getBoardConfig(state.boardType);
          interpreter = new ArduinoInterpreter(boardConfig);
          set({ interpreter });
        }

        // Transpile code
        const result = interpreter.transpile(state.code);
        set({ compileResult: result });

        return result;
      },

      // Start execution
      start: async () => {
        const state = get();

        // Compile if not already compiled
        let compileResult = state.compileResult;
        if (!compileResult) {
          compileResult = get().compile();
        }

        if (!compileResult.success || !compileResult.code) {
          const errorMsg = compileResult.error || "Compilation failed";
          get().addSerialOutput(`\nCOMPILE ERROR: ${errorMsg}\n`);
          throw new Error(errorMsg);
        }

        // Log successful compilation
        console.log("[Arduino] Compilation successful");
        console.log("[Arduino] Transpiled code:", compileResult.code);

        // Stop existing runtime
        if (state.runtime) {
          state.runtime.stop();
        }

        // Create new runtime
        const boardConfig = getBoardConfig(state.boardType);
        const runtime = new ArduinoRuntime(
          boardConfig,
          (pin, pinState) => {
            // Pin change callback
            const currentStates = get().pinStates;
            currentStates.set(pin, pinState);
            set({ pinStates: new Map(currentStates) });
          },
          (message) => {
            // Serial output callback
            get().addSerialOutput(message);
          }
        );

        set({ runtime, isRunning: true });

        // Execute program
        try {
          console.log("[Arduino] Executing program...");
          await runtime.execute(compileResult.code);
          console.log("[Arduino] Program started successfully");
        } catch (error) {
          set({ isRunning: false });
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          console.error("[Arduino] Execution error:", errorMsg);
          get().addSerialOutput(`\nERROR: ${errorMsg}\n`);
          throw error;
        }
      },

      // Stop execution
      stop: () => {
        const state = get();
        if (state.runtime) {
          state.runtime.stop();
        }
        set({ isRunning: false });
      },

      // Reset runtime
      reset: () => {
        const state = get();
        if (state.runtime) {
          state.runtime.reset();
        }
        set({
          isRunning: false,
          serialOutput: [],
          pinStates: new Map(),
          compileResult: null,
        });
      },

      // Clear serial output
      clearSerialOutput: () => {
        set({ serialOutput: [] });
      },

      // Add serial output message
      addSerialOutput: (message: string) => {
        set((state) => {
          const newOutput = [...state.serialOutput, message];
          // Limit to 500 messages
          if (newOutput.length > 500) {
            newOutput.splice(0, newOutput.length - 500);
          }
          return { serialOutput: newOutput };
        });
      },

      // Update pin states from runtime
      updatePinStates: () => {
        const state = get();
        if (state.runtime) {
          const pinStates = state.runtime.getAllPinStates();
          set({ pinStates });
        }
      },
    }),
    { name: "ArduinoStore" }
  )
);

// Selector hooks for common state
export const useArduinoCode = () => useArduinoStore((state) => state.code);
export const useArduinoBoardType = () => useArduinoStore((state) => state.boardType);
export const useArduinoIsRunning = () => useArduinoStore((state) => state.isRunning);
export const useArduinoSerialOutput = () => useArduinoStore((state) => state.serialOutput);
export const useArduinoCompileResult = () => useArduinoStore((state) => state.compileResult);
export const useArduinoActions = () =>
  useArduinoStore((state) => ({
    setCode: state.setCode,
    setBoardType: state.setBoardType,
    compile: state.compile,
    start: state.start,
    stop: state.stop,
    reset: state.reset,
    clearSerialOutput: state.clearSerialOutput,
  }));
