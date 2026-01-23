import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Button } from "../ui/button";
import type { ButtonData } from "../circuit-flow";
import { NodeToolbarContent } from "../node-toolbar-content";

export function ButtonNode({ id, data, selected }: NodeProps<Node<ButtonData>>) {
  const isClosed = data.isClosed || false;

  return (
    <>
      {selected && <NodeToolbarContent nodeId={id} />}
      <div className="px-4 py-3 rounded-lg border-2 border-blue-300 bg-white shadow-md min-w-[120px]">
        <div className="font-semibold text-sm mb-2">{data.label}</div>
        <div className="flex justify-center mb-2">
          <Button
            variant={isClosed ? "default" : "outline"}
            size="sm"
            className="nodrag"
            onClick={() => data.onToggle?.()}
          >
            {isClosed ? "ON" : "OFF"}
          </Button>
        </div>
        {/* Input handle */}
        <Handle
          type="target"
          position={Position.Left}
          id="in"
          style={{ background: "#3b82f6" }}
          className="w-3 h-3"
        />
        {/* Output handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          style={{ background: "#3b82f6" }}
          className="w-3 h-3"
        />
      </div>
    </>
  );
}
