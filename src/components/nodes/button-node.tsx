import { Handle, Position } from "@xyflow/react";
import { Button } from "../ui/button";

export function ButtonNode({ data }: { data: { label: string } }) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-blue-300 bg-white shadow-md min-w-[120px]">
      <div className="font-semibold text-sm mb-2">{data.label}</div>
      <div className="flex justify-center mb-2">
        <Button variant="outline" size="sm" className="nodrag">
          Press
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
  );
}
