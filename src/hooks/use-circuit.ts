import { useCircuitStore } from "@/stores/circuit-store";
import { useShallow } from "zustand/react/shallow";

/**
 * Hook to get all nodes from the circuit store.
 * Subscribes to nodes array changes.
 */
export const useNodes = () => useCircuitStore((state) => state.nodes);

/**
 * Hook to get all edges from the circuit store.
 * Subscribes to edges array changes.
 */
export const useEdges = () => useCircuitStore((state) => state.edges);

/**
 * Hook to get a specific node by ID.
 * Returns undefined if node is not found.
 */
export const useNode = (nodeId: string) =>
  useCircuitStore((state) => state.nodes.find((n) => n.id === nodeId));

/**
 * Hook to get data for a specific node by ID.
 * Returns undefined if node is not found.
 * Use this for more granular subscriptions to prevent re-renders.
 */
export const useNodeData = <T,>(nodeId: string) =>
  useCircuitStore(
    useShallow((state) => {
      const node = state.nodes.find((n) => n.id === nodeId);
      return node?.data as T | undefined;
    })
  );

/**
 * Hook to get all circuit actions (node and edge management).
 * Uses shallow equality to prevent unnecessary re-renders.
 */
export const useCircuitActions = () =>
  useCircuitStore(
    useShallow((state) => ({
      addNode: state.addNode,
      deleteNode: state.deleteNode,
      duplicateNode: state.duplicateNode,
      updateNodeData: state.updateNodeData,
      addEdge: state.addEdge,
      deleteEdge: state.deleteEdge,
      updateEdgeData: state.updateEdgeData,
      toggleButton: state.toggleButton,
      runSimulation: state.runSimulation,
    }))
  );

/**
 * Hook to get ReactFlow integration callbacks.
 * These are used by the ReactFlow component.
 */
export const useReactFlowCallbacks = () =>
  useCircuitStore(
    useShallow((state) => ({
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    }))
  );

/**
 * Hook to get panel open state.
 */
export const useIsPanelOpen = () =>
  useCircuitStore((state) => state.isPanelOpen);

/**
 * Hook to get panel state setter.
 */
export const useSetPanelOpen = () =>
  useCircuitStore((state) => state.setPanelOpen);

/**
 * Hook to get powered LEDs set.
 */
export const usePoweredLeds = () =>
  useCircuitStore((state) => state.poweredLeds);

/**
 * Hook to check if a specific LED is powered.
 */
export const useIsLedPowered = (ledId: string) =>
  useCircuitStore((state) => state.poweredLeds.has(ledId));

/**
 * Hook to get setNodes function directly (for ReactFlow compatibility).
 */
export const useSetNodes = () => useCircuitStore((state) => state.setNodes);

/**
 * Hook to get setEdges function directly (for ReactFlow compatibility).
 */
export const useSetEdges = () => useCircuitStore((state) => state.setEdges);
