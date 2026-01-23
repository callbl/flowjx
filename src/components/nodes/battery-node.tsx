import { Handle, Position } from "@xyflow/react";
import type { BatteryData } from "../circuit-flow";

export function BatteryNode({ data }: { data: BatteryData }) {
  return (
    <div className="px-4 py-3 rounded-lg border-2 border-gray-700 bg-white shadow-md min-w-[120px]">
      <div className="font-semibold text-sm mb-2">
        {data.label} ({data.voltage}V)
      </div>
      <div className="flex justify-center gap-2 mb-2">
        <div className="flex flex-col items-center">
          <div className="w-6 h-10 bg-gray-700 rounded-sm border-2 border-gray-800" />
          <div className="text-xs text-red-500 font-bold mt-1">−</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-12 bg-gray-700 rounded-sm border-2 border-gray-800" />
          <div className="text-xs text-green-500 font-bold mt-1">+</div>
        </div>
      </div>
      {/* Plus handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="plus"
        style={{ top: "35%", background: "#22c55e" }}
        className="w-3 h-3"
      />
      {/* Minus handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="minus"
        style={{ top: "65%", background: "#ef4444" }}
        className="w-3 h-3"
      />
    </div>
  );
}
