// Arduino-Circuit Integration Hook
// Bridges Arduino code execution with circuit component states

import { useEffect, useRef } from "react";
import { useArduinoStore } from "@/arduino/store";
import { useCircuitStore } from "@/stores/circuit-store";
import type { Node } from "@xyflow/react";
import type { PinRuntimeState } from "@/arduino/types";

/**
 * Hook that integrates Arduino runtime with circuit simulation
 *
 * Output Flow: Arduino code → Component states
 * - digitalWrite(pin, HIGH) → LED turns on
 * - analogWrite(pin, value) → LED brightness, motor speed, servo angle
 *
 * Input Flow: Component states → Arduino code
 * - Button pressed → digitalRead(pin) returns LOW
 * - Sensor value → analogRead(pin) returns sensor data
 */
export function useArduinoIntegration() {
  const runtime = useArduinoStore((state) => state.runtime);
  const isRunning = useArduinoStore((state) => state.isRunning);
  const boardType = useArduinoStore((state) => state.boardType);

  const nodes = useCircuitStore((state) => state.nodes);
  const updateNodeData = useCircuitStore((state) => state.updateNodeData);

  const prevPinStatesRef = useRef<Map<string, PinRuntimeState>>(new Map());

  useEffect(() => {
    if (!runtime || !isRunning) {
      // When Arduino stops, clear arduinoControlled flag from all components
      if (!isRunning) {
        const nodes = useCircuitStore.getState().nodes;
        const updateNodeData = useCircuitStore.getState().updateNodeData;

        nodes.forEach((node) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((node.data as any)?.arduinoControlled) {
            updateNodeData(node.id, {
              arduinoControlled: false,
              isPowered: false, // Reset powered state
            });
          }
        });
      }
      return;
    }

    // Initialize all connected components with Arduino control when starting
    const currentNodes = useCircuitStore.getState().nodes;
    const mcuNode = currentNodes.find(
      (node) => node.type === "arduino-uno" || node.type === "esp32"
    );

    if (mcuNode) {
      // Find all components connected to Arduino and set initial state
      const initialPinStates = runtime.getAllPinStates();
      initialPinStates.forEach((pinState, pinId) => {
        handlePinChange(pinId, pinState, currentNodes, useCircuitStore.getState().updateNodeData);
      });
    }

    // Set up pin change monitoring
    const checkPinChanges = () => {
      if (!runtime || !isRunning) return;

      const currentPinStates = runtime.getAllPinStates();
      const currentNodes = useCircuitStore.getState().nodes;
      const currentUpdateNodeData = useCircuitStore.getState().updateNodeData;

      currentPinStates.forEach((pinState, pinId) => {
        const prevState = prevPinStatesRef.current.get(pinId);

        // Check if pin state changed OR if this is a new Arduino run
        if (
          !prevState ||
          prevState.value !== pinState.value ||
          prevState.mode !== pinState.mode ||
          prevState.pwmValue !== pinState.pwmValue
        ) {
          handlePinChange(pinId, pinState, currentNodes, currentUpdateNodeData);
        }
      });

      prevPinStatesRef.current = new Map(currentPinStates);
    };

    // Poll for pin changes every 50ms
    const intervalId = setInterval(checkPinChanges, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [runtime, isRunning]);

  /**
   * Handle Arduino pin state change → Update connected components
   */
  const handlePinChange = (
    pinId: string,
    pinState: PinRuntimeState,
    currentNodes: Node[],
    currentUpdateNodeData: (nodeId: string, data: any) => void
  ) => {
    // Find MCU node in circuit
    const mcuNode = currentNodes.find(
      (node) =>
        node.type === "arduino-uno" || node.type === "esp32"
    );

    if (!mcuNode) return;

    // Find components connected to this pin
    const connectedComponents = findConnectedComponents(mcuNode.id, pinId, currentNodes);

    connectedComponents.forEach((component) => {
      updateComponentFromPin(component, pinState, currentUpdateNodeData);
    });
  };

  /**
   * Find components connected to a specific MCU pin
   */
  const findConnectedComponents = (mcuNodeId: string, pinId: string, currentNodes: Node[]): Node[] => {
    const edges = useCircuitStore.getState().edges;
    const connectedNodes: Node[] = [];

    // Find edges connected to this pin
    edges.forEach((edge) => {
      const sourceKey = `${edge.source}:${edge.sourceHandle}`;
      const targetKey = `${edge.target}:${edge.targetHandle}`;
      const pinKey = `${mcuNodeId}:${pinId}`;

      // Check if edge connects to this pin
      if (sourceKey === pinKey) {
        const targetNode = currentNodes.find((n) => n.id === edge.target);
        if (targetNode) connectedNodes.push(targetNode);
      } else if (targetKey === pinKey) {
        const sourceNode = currentNodes.find((n) => n.id === edge.source);
        if (sourceNode) connectedNodes.push(sourceNode);
      }
    });

    return connectedNodes;
  };

  /**
   * Update component state based on pin output
   */
  const updateComponentFromPin = (
    node: Node,
    pinState: PinRuntimeState,
    currentUpdateNodeData: (nodeId: string, data: any) => void
  ) => {
    const { type, id, data } = node;

    // Output is only valid if pin is in OUTPUT mode
    if (pinState.mode !== 1) return; // 1 = OUTPUT

    switch (type) {
      case "led":
        // Digital: HIGH/LOW → on/off
        // PWM: 0-255 → brightness 0-1
        if (pinState.pwmValue !== undefined) {
          currentUpdateNodeData(id, {
            isPowered: pinState.pwmValue > 0,
            brightness: pinState.pwmValue / 255,
            arduinoControlled: true, // Mark as Arduino-controlled
          });
        } else {
          currentUpdateNodeData(id, {
            isPowered: pinState.value > 0,
            brightness: 1,
            arduinoControlled: true, // Mark as Arduino-controlled
          });
        }
        break;

      case "rgb-led":
        // Requires 3 pins for R, G, B
        // Each pin PWM value maps to color component
        // This is handled by tracking multiple pins
        // For now, simplified single-pin control
        if (pinState.pwmValue !== undefined) {
          currentUpdateNodeData(id, {
            isPowered: pinState.pwmValue > 0,
            red: pinState.pwmValue,
            green: 0,
            blue: 0,
            arduinoControlled: true,
          });
        }
        break;

      case "dc-motor":
        // PWM value → motor speed
        if (pinState.pwmValue !== undefined) {
          const speed = Math.round((pinState.pwmValue / 255) * 100);
          currentUpdateNodeData(id, {
            isRunning: speed > 0,
            speed,
            direction: speed > 0 ? "cw" : "stopped",
            arduinoControlled: true,
          });
        } else {
          currentUpdateNodeData(id, {
            isRunning: pinState.value > 0,
            speed: pinState.value > 0 ? 100 : 0,
            direction: pinState.value > 0 ? "cw" : "stopped",
            arduinoControlled: true,
          });
        }
        break;

      case "servo":
        // PWM pulse width → angle (simplified)
        // In real Arduino: 544-2400μs pulses
        // We'll map PWM value 0-255 → 0-180°
        if (pinState.pwmValue !== undefined) {
          const angle = Math.round((pinState.pwmValue / 255) * 180);
          currentUpdateNodeData(id, {
            angle,
            isPowered: true,
            arduinoControlled: true,
          });
        }
        break;

      case "buzzer":
        // Digital output → buzzer on/off
        currentUpdateNodeData(id, {
          isActive: pinState.value > 0,
          frequency: pinState.value > 0 ? 1000 : 0,
          arduinoControlled: true,
        });
        break;

      case "relay":
        // Digital output → relay state
        currentUpdateNodeData(id, {
          isActivated: pinState.value > 0,
          arduinoControlled: true,
        });
        break;

      case "lcd16x2":
        // LCD updates via library functions (not direct pin control)
        // Just track power state
        currentUpdateNodeData(id, {
          isPowered: pinState.value > 0,
          arduinoControlled: true,
        });
        break;

      case "seven-segment":
        // 7-segment typically controlled by 7+ pins
        // Simplified: HIGH → show segment
        currentUpdateNodeData(id, {
          isPowered: pinState.value > 0,
          arduinoControlled: true,
        });
        break;

      default:
        // Generic: just track power state
        if (data && "isPowered" in data) {
          currentUpdateNodeData(id, {
            isPowered: pinState.value > 0,
            arduinoControlled: true,
          });
        }
        break;
    }
  };

  /**
   * Feed component states back to Arduino runtime (input flow)
   */
  useEffect(() => {
    if (!runtime || !isRunning) return;

    const currentNodes = useCircuitStore.getState().nodes;
    const mcuNode = currentNodes.find(
      (node) => node.type === "arduino-uno" || node.type === "esp32"
    );
    if (!mcuNode) return;

    // Update Arduino input pins from component states
    currentNodes.forEach((node) => {
      const { type, data } = node;

      // Find pins connected to this component
      const connectedPins = findConnectedPins(mcuNode.id, node.id);

      connectedPins.forEach((pinId) => {
        updateArduinoPin(pinId, type, data);
      });
    });
  }, [runtime, isRunning]);

  /**
   * Find MCU pins connected to a component
   */
  const findConnectedPins = (mcuNodeId: string, componentNodeId: string): string[] => {
    const edges = useCircuitStore.getState().edges;
    const pins: string[] = [];

    edges.forEach((edge) => {
      if (
        (edge.source === mcuNodeId && edge.target === componentNodeId) ||
        (edge.target === mcuNodeId && edge.source === componentNodeId)
      ) {
        // Get the MCU pin handle
        const pinHandle =
          edge.source === mcuNodeId ? edge.sourceHandle : edge.targetHandle;
        if (pinHandle) pins.push(pinHandle);
      }
    });

    return pins;
  };

  /**
   * Update Arduino pin input from component state
   */
  const updateArduinoPin = (pinId: string, componentType: string, data: any) => {
    if (!runtime) return;

    const pinState = runtime.getPinState(pinId);
    if (!pinState || pinState.mode !== 0) return; // 0 = INPUT

    switch (componentType) {
      case "button":
        // Button closed → pin reads LOW (0)
        // Button open → pin reads HIGH (1) with INPUT_PULLUP
        const buttonValue = data.isClosed ? 0 : 1;
        runtime.setExternalPinState(pinId, buttonValue);
        break;

      case "light-sensor":
        // Analog sensor → set raw value
        if (data.rawValue !== undefined) {
          // Map 0-1023 to 0-255 for pin value
          const pinValue = Math.round((data.rawValue / 1023) * 255);
          runtime.setExternalPinState(pinId, pinValue);
        }
        break;

      case "temperature-sensor":
        // Analog sensor → set raw value
        if (data.rawValue !== undefined) {
          const pinValue = Math.round((data.rawValue / 1023) * 255);
          runtime.setExternalPinState(pinId, pinValue);
        }
        break;

      case "ultrasonic-sensor":
        // Distance sensor → analog value
        if (data.distance !== undefined) {
          // Map distance (0-400cm) to analog range
          const rawValue = Math.min(1023, Math.round((data.distance / 400) * 1023));
          const pinValue = Math.round((rawValue / 1023) * 255);
          runtime.setExternalPinState(pinId, pinValue);
        }
        break;

      case "pir-sensor":
        // Motion sensor → digital HIGH/LOW
        const pirValue = data.motionDetected ? 1 : 0;
        runtime.setExternalPinState(pinId, pirValue);
        break;

      case "potentiometer":
        // Potentiometer → analog value
        if (data.value !== undefined) {
          const pinValue = Math.round((data.value / 1023) * 255);
          runtime.setExternalPinState(pinId, pinValue);
        }
        break;

      default:
        break;
    }
  };
}
