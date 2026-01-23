import { type Node, type NodeProps, Position } from "@xyflow/react";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "../base-node";
import { LabeledHandle } from "../labeled-handle";

export type BatteryNode = Node<{ isOn: true }>;

export function BatteryNode({ data }: NodeProps<BatteryNode>) {
  return (
    <BaseNode className="w-48">
      <BaseNodeHeader className="border-b">
        <BaseNodeHeaderTitle>Battery</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <div className="flex flex-col gap-2 items-center">
          {/* Battery visualization */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <div className="w-8 h-12 bg-gray-700 border-2 border-gray-800 rounded-sm" />
              <div className="text-xs text-center text-red-500 font-bold">
                -
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-8 h-16 bg-gray-700 border-2 border-gray-800 rounded-sm" />
              <div className="text-xs text-center text-green-500 font-bold">
                +
              </div>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {data.isOn ? "⚡ Providing power" : "No power"}
          </span>
        </div>
      </BaseNodeContent>
      <BaseNodeFooter className="bg-gray-100 items-end px-0 py-1 w-full rounded-b-md">
        <LabeledHandle title="out" type="source" position={Position.Right} />
      </BaseNodeFooter>
    </BaseNode>
  );
}
