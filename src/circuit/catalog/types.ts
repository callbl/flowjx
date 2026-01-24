import type { LucideIcon } from "lucide-react";
import type { NodeConfig } from "@/components/nodes/config";

/**
 * Internal edge definition for electrical routing inside a component.
 * Connects two handles within the same node or between different nodes.
 */
export interface InternalEdge {
  from: {
    nodeId: string;
    handleId: string;
  };
  to: {
    nodeId: string;
    handleId: string;
  };
}

/**
 * Traversal context exposed by the circuit simulation engine.
 * Provides enough data for nodes to derive their state without knowing simulation internals.
 */
export interface TraversalContext {
  /** Graph of connections: key is `nodeId:handleId`, value is array of connected points */
  graph: Map<string, Array<{ nodeId: string; handleId: string }>>;
  /** Node IDs that are part of at least one completed circuit path from battery+ to battery- */
  nodesInCompletePaths: Set<string>;
  /** Current node being evaluated */
  nodeId: string;
  /** Current node data */
  nodeData: unknown;
}

/**
 * Electrical behavior definition for a node type.
 * Defines how current flows through the component and how its state is derived.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ElectricalDefinition<TData = any> {
  /**
   * Returns internal edges based on the node's current data.
   * These represent how current flows inside the component.
   *
   * @param nodeId - The node ID
   * @param data - The node's data
   * @returns Array of internal edges (can be empty)
   */
  internalEdges: (nodeId: string, data: TData) => InternalEdge[];

  /**
   * Derives the node's state based on traversal results.
   * Returns updated data or undefined if no changes needed.
   *
   * @param context - Traversal context from the simulation engine
   * @returns Updated data object or undefined if no changes
   */
  deriveState: (context: TraversalContext) => Partial<TData> | undefined;
}

/**
 * Complete catalog entry for a circuit component node type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface NodeCatalogEntry<TData = any> {
  /** Unique node type identifier */
  type: string;

  /** Display label for UI */
  label: string;

  /** Lucide icon component */
  icon: LucideIcon;

  /** React component for rendering the node */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uiComponent: React.ComponentType<any>;

  /** Node configuration (handles, title, etc.) from nodes/config.ts */
  config: NodeConfig;

  /** Factory function to create default data for new nodes */
  defaults: (label: string) => TData;

  /** Electrical behavior definition */
  electrical: ElectricalDefinition<TData>;
}

/**
 * Type-safe catalog registry
 */
export type NodeCatalog = Record<string, NodeCatalogEntry>;

/**
 * Helper type to extract the data type from a catalog entry
 */
export type NodeDataType<T extends NodeCatalogEntry> =
  T extends NodeCatalogEntry<infer TData> ? TData : never;

/**
 * Factory function signature for creating default nodes
 */
export interface CreateDefaultNodeParams {
  type: string;
  position: { x: number; y: number };
  id?: string;
}
