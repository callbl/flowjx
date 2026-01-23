import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
  useStore,
} from "@xyflow/react";
import { useCallback, useEffect } from "react";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "../base-node";
import { LabeledHandle } from "../labeled-handle";
import { Button } from "../ui/button";

export type ButtonNode = Node<{ isOn: boolean; isPressed: boolean }>;

export function ButtonNode({ id, data }: NodeProps<ButtonNode>) {
  const { updateNodeData, getNodeConnections } = useReactFlow();

  // Check if receiving power from battery
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

  const toggleButton = useCallback(() => {
    updateNodeData(id, { ...data, isPressed: !data.isPressed });
  }, [id, data, updateNodeData]);

  // Button is ON only if powered AND pressed
  useEffect(() => {
    updateNodeData(id, { ...data, isOn: isPowered && data.isPressed });
  }, [id, isPowered, data.isPressed]);

  return (
    <BaseNode className="w-48">
      <BaseNodeHeader className="border-b">
        <BaseNodeHeaderTitle>Switch</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent className="px-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-start w-full">
            <LabeledHandle
              title="in"
              id="in"
              type="target"
              position={Position.Left}
            />
          </div>
          <div className="flex flex-col gap-2 items-center py-2">
            <Button
              onClick={toggleButton}
              variant={data.isPressed ? "default" : "outline"}
              className={`w-full nodrag ${
                data.isPressed
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {data.isPressed ? "ON" : "OFF"}
            </Button>
            <span className="text-xs text-muted-foreground">
              {data.isOn ? "⚡ Conducting" : "⚫ Not conducting"}
            </span>
          </div>
        </div>
      </BaseNodeContent>
      <BaseNodeFooter className="bg-gray-100 items-end px-0 py-1 w-full rounded-b-md">
        <LabeledHandle title="out" type="source" position={Position.Right} />
      </BaseNodeFooter>
    </BaseNode>
  );
}
