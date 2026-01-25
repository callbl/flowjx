import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as addReactFlowEdge,
} from "@xyflow/react";
import { simulateCircuit } from "@/lib/circuit-simulation";
import { ArduinoInterpreter } from "@/lib/arduino-interpreter";
import type {
  BatteryData,
  LedData,
  ButtonData,
  ArduinoUnoData,
} from "@/components/circuit-flow";

export type EquipmentType = "battery" | "led" | "button" | "arduinoUno";

export type EdgeData = {
  color?: string;
  pathType?: "bezier" | "smoothstep" | "step" | "straight";
};

interface CircuitState {
  // Core State
  nodes: Node[];
  edges: Edge[];
  poweredLeds: Set<string>;
  isPanelOpen: boolean;
  arduinoInterpreters: Map<string, ArduinoInterpreter>;

  // Node Actions
  addNode: (type: EquipmentType) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  updateNodeData: <T>(nodeId: string, data: Partial<T>) => void;
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;

  // Edge Actions
  addEdge: (connection: Connection) => void;
  deleteEdge: (edgeId: string) => void;
  updateEdgeData: (edgeId: string, data: Partial<EdgeData>) => void;
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;

  // Component-Specific Actions
  toggleButton: (nodeId: string) => void;

  // Simulation
  runSimulation: () => void;
  runArduinoSimulation: () => void;

  // ReactFlow Integration
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // UI Actions
  setPanelOpen: (open: boolean) => void;

  // Debug Actions
  logConnections: () => void;
}

const equipmentItems: Array<{
  type: EquipmentType;
  label: string;
  icon: string;
}> = [
  { type: "battery", label: "Battery", icon: "🔋" },
  { type: "led", label: "LED", icon: "💡" },
  { type: "button", label: "Button", icon: "🔘" },
  { type: "arduinoUno", label: "Arduino Uno", icon: "🎛️" },
];

export const useCircuitStore = create<CircuitState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        nodes: [],
        edges: [],
        poweredLeds: new Set(),
        isPanelOpen: false,
        arduinoInterpreters: new Map(),

        // Node Actions
        addNode: (type: EquipmentType) => {
          const { nodes } = get();
          const id = crypto.randomUUID();
          const label =
            equipmentItems.find((item) => item.type === type)?.label || type;

          // Position node with offset based on current node count
          const position = {
            x: 250 + nodes.length * 20,
            y: 100 + nodes.length * 20,
          };

          // Create node data based on type
          let data: BatteryData | LedData | ButtonData | ArduinoUnoData;

          switch (type) {
            case "battery":
              data = { label, voltage: 5 };
              break;
            case "led":
              data = { label, isPowered: false };
              break;
            case "button":
              data = {
                label,
                isClosed: false,
              };
              break;
            case "arduinoUno":
              data = { 
                label,
                code: undefined,
                isRunning: false,
                serialOutput: [],
                pinStates: new Map(),
              };
              // Create interpreter for this Arduino
              const { arduinoInterpreters } = get();
              arduinoInterpreters.set(id, new ArduinoInterpreter());
              break;
          }

          const newNode: Node = {
            id,
            type,
            position,
            data,
          };

          set({
            nodes: [...nodes, newNode],
            isPanelOpen: false,
          });

          // Run simulation after adding node
          get().runSimulation();
        },

        deleteNode: (nodeId: string) => {
          const { nodes, edges, arduinoInterpreters } = get();

          // Clean up Arduino interpreter if it exists
          const interpreter = arduinoInterpreters.get(nodeId);
          if (interpreter) {
            interpreter.stop();
            arduinoInterpreters.delete(nodeId);
          }

          // Remove node and connected edges
          const updatedNodes = nodes.filter((node) => node.id !== nodeId);
          const updatedEdges = edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId,
          );

          set({
            nodes: updatedNodes,
            edges: updatedEdges,
          });

          // Run simulation after deletion
          get().runSimulation();
        },

        duplicateNode: (nodeId: string) => {
          const { nodes } = get();
          const nodeToDuplicate = nodes.find((node) => node.id === nodeId);

          if (!nodeToDuplicate) return;

          const newId = crypto.randomUUID();
          const newNode: Node = {
            ...nodeToDuplicate,
            id: newId,
            position: {
              x: nodeToDuplicate.position.x + 50,
              y: nodeToDuplicate.position.y + 50,
            },
            selected: true, // Select the new duplicate
          };

          // If duplicating Arduino, create new interpreter
          if (nodeToDuplicate.type === "arduinoUno") {
            const { arduinoInterpreters } = get();
            arduinoInterpreters.set(newId, new ArduinoInterpreter());
            // Reset running state for duplicate
            newNode.data = {
              ...newNode.data,
              isRunning: false,
            };
          }

          // Deselect all other nodes (including the original)
          const updatedNodes = nodes.map((node) => ({
            ...node,
            selected: false,
          }));

          set({
            nodes: [...updatedNodes, newNode],
          });

          // Run simulation after duplication
          get().runSimulation();
        },

        updateNodeData: <T>(nodeId: string, data: Partial<T>) => {
          const { nodes, arduinoInterpreters } = get();

          const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
              const newData = {
                ...node.data,
                ...data,
              };

              // Handle Arduino code updates
              if (node.type === "arduinoUno") {
                const arduinoData = data as Partial<ArduinoUnoData>;
                const interpreter = arduinoInterpreters.get(nodeId);

                if (interpreter) {
                  // Handle running state changes
                  if (arduinoData.isRunning !== undefined) {
                    if (arduinoData.isRunning && arduinoData.code) {
                      interpreter.start(arduinoData.code);
                    } else if (!arduinoData.isRunning) {
                      interpreter.stop();
                    }
                  }

                  // Handle code updates while running
                  if (
                    arduinoData.code !== undefined &&
                    (node.data as ArduinoUnoData).isRunning
                  ) {
                    interpreter.start(arduinoData.code);
                  }
                }
              }

              return {
                ...node,
                data: newData,
              };
            }
            return node;
          });

          set({ nodes: updatedNodes });

          // Run simulation after data update
          get().runSimulation();
        },

        setNodes: (nodes) => {
          set((state) => ({
            nodes: typeof nodes === "function" ? nodes(state.nodes) : nodes,
          }));
        },

        // Edge Actions
        addEdge: (connection: Connection) => {
          const { edges } = get();
          const newEdges = addReactFlowEdge(connection, edges);

          set({ edges: newEdges });

          // Run simulation after adding edge
          get().runSimulation();
        },

        deleteEdge: (edgeId: string) => {
          const { edges } = get();

          set({
            edges: edges.filter((edge) => edge.id !== edgeId),
          });

          // Run simulation after deletion
          get().runSimulation();
        },

        updateEdgeData: (edgeId: string, data: Partial<EdgeData>) => {
          const { edges } = get();

          const updatedEdges = edges.map((edge) => {
            if (edge.id === edgeId) {
              return {
                ...edge,
                data: {
                  ...edge.data,
                  ...data,
                },
              };
            }
            return edge;
          });

          set({ edges: updatedEdges });

          // No simulation needed for visual edge changes
        },

        setEdges: (edges) => {
          set((state) => ({
            edges: typeof edges === "function" ? edges(state.edges) : edges,
          }));
        },

        // Component-Specific Actions
        toggleButton: (nodeId: string) => {
          const { nodes } = get();

          const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId && node.type === "button") {
              return {
                ...node,
                data: {
                  ...node.data,
                  isClosed: !(node.data as ButtonData).isClosed,
                } as ButtonData,
              };
            }
            return node;
          });

          set({ nodes: updatedNodes });

          // Run simulation after button toggle
          get().runSimulation();
        },

        // Simulation
        runSimulation: () => {
          // First run Arduino simulation to update pin states
          get().runArduinoSimulation();

          // Then run circuit simulation
          const { nodes, edges } = get();
          const updatedNodes = simulateCircuit(nodes, edges);

          // Extract powered LEDs for potential UI indicators
          const poweredLeds = new Set<string>();
          updatedNodes.forEach((node) => {
            if (node.type === "led" && (node.data as LedData).isPowered) {
              poweredLeds.add(node.id);
            }
          });

          set({
            nodes: updatedNodes,
            poweredLeds,
          });
        },

        runArduinoSimulation: () => {
          const { nodes, arduinoInterpreters } = get();

          // Update all Arduino nodes with their interpreter states
          const updatedNodes = nodes.map((node) => {
            if (node.type === "arduinoUno") {
              const interpreter = arduinoInterpreters.get(node.id);
              if (interpreter && (node.data as ArduinoUnoData).isRunning) {
                const state = interpreter.getState();

                // Convert Map to plain object for React state
                const pinStates = new Map<string, "HIGH" | "LOW" | number>();
                state.digitalPins.forEach((pinData, pinNum) => {
                  // Map pin numbers to pin IDs (D0-D13)
                  const pinId = `D${pinNum}`;
                  if (pinData.mode === "OUTPUT") {
                    pinStates.set(pinId, pinData.value);
                  }
                });

                return {
                  ...node,
                  data: {
                    ...node.data,
                    serialOutput: state.serialOutput,
                    pinStates,
                  } as ArduinoUnoData,
                };
              }
            }
            return node;
          });

          set({ nodes: updatedNodes });
        },

        // ReactFlow Integration
        onNodesChange: (changes) => {
          set((state) => ({
            nodes: applyNodeChanges(changes, state.nodes),
          }));

          // Run simulation after node changes (position, selection, etc.)
          // Note: We only simulate if it's a relevant change
          const hasRelevantChange = changes.some(
            (change) => change.type === "add" || change.type === "remove",
          );

          if (hasRelevantChange) {
            get().runSimulation();
          }
        },

        onEdgesChange: (changes) => {
          set((state) => ({
            edges: applyEdgeChanges(changes, state.edges),
          }));

          // Run simulation after edge changes
          const hasRelevantChange = changes.some(
            (change) => change.type === "add" || change.type === "remove",
          );

          if (hasRelevantChange) {
            get().runSimulation();
          }
        },

        onConnect: (connection) => {
          get().addEdge(connection);
        },

        // UI Actions
        setPanelOpen: (open: boolean) => {
          set({ isPanelOpen: open });
        },

        // Debug Actions
        logConnections: () => {
          const { edges, nodes } = get();

          const connectionsData = {
            nodes: nodes.map((node) => ({
              id: node.id,
              type: node.type,
              position: node.position,
              data: node.data,
            })),
            connections: edges.map((edge) => ({
              id: edge.id,
              source: edge.source,
              sourceHandle: edge.sourceHandle,
              target: edge.target,
              targetHandle: edge.targetHandle,
              data: edge.data,
            })),
          };

          console.info(
            "[Circuit Connections]",
            JSON.stringify(connectionsData, null, 2),
          );
        },
      }),
      {
        name: "circuit-storage",
        partialize: (state) => ({
          nodes: state.nodes,
          edges: state.edges,
        }),
      },
    ),
    { name: "CircuitStore" },
  ),
);

// Run Arduino simulation periodically (every 100ms) for all running Arduinos
setInterval(() => {
  const state = useCircuitStore.getState();
  const hasRunningArduino = state.nodes.some(
    (node) => node.type === "arduinoUno" && (node.data as ArduinoUnoData).isRunning
  );

  if (hasRunningArduino) {
    state.runArduinoSimulation();
  }
}, 100);
