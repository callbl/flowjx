import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
  useStore,
} from "@xyflow/react";
import { useEffect } from "react";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "../base-node";
import { LabeledHandle } from "../labeled-handle";

export type LedNode = Node<{ isOn: boolean }>;

export function LedNode({ id }: NodeProps<LedNode>) {
  const { updateNodeData, getNodeConnections } = useReactFlow();

  // Check if any connected source is ON
  const isPowered = useStore((state) => {
    const connections = getNodeConnections({
      nodeId: id,
      handleId: "in",
      type: "target",
    });

    return connections.some(({ source }) => {
      const node = state.nodeLookup.get(source);
      return node?.data?.isOn === true;
    });
  });

  useEffect(() => {
    updateNodeData(id, { isOn: isPowered });
  }, [id, isPowered, updateNodeData]);

  return (
    <BaseNode className="w-48">
      <BaseNodeHeader className="border-b">
        <BaseNodeHeaderTitle>LED</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent className="px-4">
        <div className="flex flex-col gap-3 items-center py-2">
          {/* LED Circle */}
          <div
            className={`w-16 h-16 rounded-full border-4 transition-all duration-300 ${
              isPowered
                ? "bg-red-500 border-red-600 shadow-lg shadow-red-500/50"
                : "bg-gray-200 border-gray-300"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isPowered ? "🔴 ON" : "⚪ OFF"}
          </span>
        </div>
        <div className="flex justify-start w-full">
          <LabeledHandle
            title="in"
            id="in"
            type="target"
            position={Position.Left}
          />
        </div>
      </BaseNodeContent>
    </BaseNode>
  );
}
