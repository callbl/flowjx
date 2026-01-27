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
import { NODE_CATALOG, createDefaultNode } from "@/circuit/catalog";
import type { ButtonData } from "@/circuit/catalog";

// Derive EquipmentType from catalog keys
export type EquipmentType = keyof typeof NODE_CATALOG;

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

  // ReactFlow Integration
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // UI Actions
  setPanelOpen: (open: boolean) => void;

  // Debug Actions
  logConnections: () => void;
}

export const useCircuitStore = create<CircuitState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        nodes: [],
        edges: [],
        poweredLeds: new Set(),
        isPanelOpen: false,

        // Node Actions
        addNode: (type: EquipmentType) => {
          const { nodes } = get();

          // Position node with offset based on current node count
          const position = {
            x: 250 + nodes.length * 20,
            y: 100 + nodes.length * 20,
          };

          // Create node using catalog defaults
          const newNode = createDefaultNode({ type, position });

          set({
            nodes: [...nodes, newNode],
            isPanelOpen: false,
          });

          // Run simulation after adding node
          get().runSimulation();
        },

        deleteNode: (nodeId: string) => {
          const { nodes, edges } = get();

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
          const { nodes } = get();

          const updatedNodes = nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              };
            }
            return node;
          });

          set({ nodes: updatedNodes });

          // Skip simulation if this is Arduino control update (performance optimization)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isArduinoUpdate = (data as any)?.arduinoControlled !== undefined;
          if (!isArduinoUpdate) {
            get().runSimulation();
          }
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
              const buttonData = node.data as unknown as ButtonData;
              return {
                ...node,
                data: {
                  ...buttonData,
                  isClosed: !buttonData.isClosed,
                },
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
          const { nodes, edges } = get();
          const updatedNodes = simulateCircuit(nodes, edges);

          // Extract powered LEDs for potential UI indicators
          const poweredLeds = new Set<string>();
          updatedNodes.forEach((node) => {
            if (
              node.type === "led" &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (node.data as any).isPowered
            ) {
              poweredLeds.add(node.id);
            }
          });

          set({
            nodes: updatedNodes,
            poweredLeds,
          });
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
