import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  Position,
  useStore,
  type Edge,
  type EdgeProps,
  type Node,
} from "@xyflow/react";
import { Button } from "./ui/button";
import { ColorSelector } from "./color-selector";
import { PathSelector } from "./path-selector";
import { useCircuitActions } from "@/hooks/use-circuit";
import { DEFAULT_EDGE_COLOR } from "@/lib/constants";

export type DataEdge<T extends Node = Node> = Edge<{
  /**
   * The key to lookup in the source node's `data` object. For additional safety,
   * you can parameterize the `DataEdge` over the type of one of your nodes to
   * constrain the possible values of this key.
   *
   * If no key is provided this edge behaves identically to React Flow's default
   * edge component.
   */
  key?: keyof T["data"];
  /**
   * Which of React Flow's path algorithms to use. Each value corresponds to one
   * of React Flow's built-in edge types.
   *
   * If not provided, this defaults to `"bezier"`.
   */
  pathType?: "bezier" | "smoothstep" | "step" | "straight";
  /**
   * The color of the edge. If not provided, defaults to foreground color.
   */
  color?: string;
}>;

export function DataEdge({
  data = {},
  id,
  markerEnd,
  selected,
  source,
  sourcePosition,
  sourceX,
  sourceY,
  style,
  targetPosition,
  targetX,
  targetY,
}: EdgeProps<DataEdge>) {
  const { deleteEdge, updateEdgeData } = useCircuitActions();
  const nodeData = useStore((state) => state.nodeLookup.get(source)?.data);
  const pathType = data.pathType || "bezier";
  const [edgePath, labelX, labelY] = getPath({
    type: pathType,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = useMemo(() => {
    if (data.key && nodeData) {
      const value = nodeData[data.key];

      switch (typeof value) {
        case "string":
        case "number":
          return value;

        case "object":
          return JSON.stringify(value);

        default:
          return "";
      }
    }
  }, [data, nodeData]);

  const handleDelete = () => {
    deleteEdge(id);
  };

  const handleColorChange = (color: string) => {
    updateEdgeData(id, { color });
  };

  const handlePathChange = (
    pathType: "bezier" | "smoothstep" | "step" | "straight",
  ) => {
    updateEdgeData(id, { pathType });
  };

  const labelTransform = `translate(${labelX}px,${labelY}px) translate(-50%, -50%)`;
  const toolbarTransform = `translate(${labelX}px,${labelY - 30}px) translate(-50%, -50%)`;

  const edgeColor = data.color || DEFAULT_EDGE_COLOR;
  const edgeStyle = {
    ...style,
    stroke: edgeColor,
    strokeWidth: 2,
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={edgeStyle}
      />
      <EdgeLabelRenderer>
        {data.key && (
          <div
            className="absolute rounded border bg-background px-1 text-foreground"
            style={{ transform: labelTransform }}
          >
            <pre className="text-xs">{label}</pre>
          </div>
        )}
        {selected && (
          <div
            className="absolute flex flex-wrap items-center justify-center gap-1 bg-background border rounded-lg shadow-lg p-1 nopan"
            style={{
              transform: toolbarTransform,
              pointerEvents: "all",
              zIndex: 1000,
            }}
          >
            <ColorSelector
              selectedColor={edgeColor}
              onColorChange={handleColorChange}
            />
            <div className="h-4 w-px bg-border mx-0.5" />
            <PathSelector
              selectedPath={pathType}
              onPathChange={handlePathChange}
            />
            <div className="h-4 w-px bg-border mx-0.5" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              title="Delete Edge"
              className="cursor-pointer"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

/**
 * Chooses which of React Flow's edge path algorithms to use based on the provided
 * `type`.
 */
function getPath({
  type,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: {
  type: "bezier" | "smoothstep" | "step" | "straight";
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
}) {
  switch (type) {
    case "bezier":
      return getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });

    case "smoothstep":
      return getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
      });

    case "step":
      return getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius: 0,
      });

    case "straight":
      return getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
  }
}
