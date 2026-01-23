import type { ReactFlowJsonObject } from "@xyflow/react";

/**
 * Circuit file format version 1.
 * Wraps React Flow's JSON object with metadata for versioning and validation.
 */
export type CircuitFileV1 = {
  format: "circuit-flow";
  version: 1;
  createdAt: string;
  app: {
    name: string;
    build?: string;
  };
  flow: ReactFlowJsonObject;
};

/**
 * Serializes the current circuit state into a CircuitFileV1 format.
 */
export function serializeCircuitFile(
  flow: ReactFlowJsonObject,
): CircuitFileV1 {
  return {
    format: "circuit-flow",
    version: 1,
    createdAt: new Date().toISOString(),
    app: {
      name: "FlowJX Circuit Simulator",
      build: import.meta.env.VITE_APP_VERSION ?? "dev",
    },
    flow,
  };
}

/**
 * Validation error for circuit file parsing.
 */
export class CircuitFileParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitFileParseError";
  }
}

/**
 * Parses and validates a circuit file from JSON text.
 * Throws CircuitFileParseError if validation fails.
 */
export function parseCircuitFile(jsonText: string): CircuitFileV1 {
  let parsed: unknown;

  // Parse JSON
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new CircuitFileParseError("Invalid JSON file");
  }

  // Validate structure
  if (typeof parsed !== "object" || parsed === null) {
    throw new CircuitFileParseError("File is not a valid circuit file");
  }

  const file = parsed as Record<string, unknown>;

  // Validate format
  if (file.format !== "circuit-flow") {
    throw new CircuitFileParseError(
      "Unsupported file format (expected 'circuit-flow')",
    );
  }

  // Validate version
  if (file.version !== 1) {
    throw new CircuitFileParseError(
      `Unsupported file version: ${file.version} (expected 1)`,
    );
  }

  // Validate flow structure
  if (typeof file.flow !== "object" || file.flow === null) {
    throw new CircuitFileParseError("Missing or invalid flow data");
  }

  const flow = file.flow as Record<string, unknown>;

  if (!Array.isArray(flow.nodes)) {
    throw new CircuitFileParseError("Missing or invalid nodes array");
  }

  if (!Array.isArray(flow.edges)) {
    throw new CircuitFileParseError("Missing or invalid edges array");
  }

  // Viewport is optional but should be validated if present
  if (
    flow.viewport !== undefined &&
    (typeof flow.viewport !== "object" || flow.viewport === null)
  ) {
    throw new CircuitFileParseError("Invalid viewport data");
  }

  return file as CircuitFileV1;
}
