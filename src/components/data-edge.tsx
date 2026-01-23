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
  useReactFlow,
  type Edge,
  type EdgeProps,
  type Node,
} from "@xyflow/react";
import { Button } from "./ui/button";

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
  path?: "bezier" | "smoothstep" | "step" | "straight";
}>;

export function DataEdge({
  data = { path: "bezier" },
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
  const { setEdges } = useReactFlow();
  const nodeData = useStore((state) => state.nodeLookup.get(source)?.data);
  const [edgePath, labelX, labelY] = getPath({
    type: data.path || "bezier",
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
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const labelTransform = `translate(${labelX}px,${labelY}px) translate(-50%, -50%)`;
  const toolbarTransform = `translate(${labelX}px,${labelY - 30}px) translate(-50%, -50%)`;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
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
            className="absolute flex gap-1 bg-background border rounded-lg shadow-lg p-1 nopan"
            style={{
              transform: toolbarTransform,
              pointerEvents: "all",
              zIndex: 1000,
            }}
          >
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
