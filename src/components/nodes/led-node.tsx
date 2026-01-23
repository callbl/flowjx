import { Handle, Position } from "@xyflow/react";
import type { LedData } from "../circuit-flow";

export function LedNode({ data }: { data: LedData }) {
  const isPowered = data.isPowered || false;

  return (
    <div className="px-4 py-3 rounded-lg border-2 border-red-300 bg-white shadow-md min-w-[100px]">
      <div className="font-semibold text-sm mb-2">{data.label}</div>
      <div className="flex justify-center mb-2">
        <div
          className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${
            isPowered
              ? "border-yellow-400 bg-yellow-300 shadow-lg shadow-yellow-400/50"
              : "border-red-400 bg-red-100"
          }`}
        />
      </div>
      {/* Anode handle (top) */}
      <Handle
        type="target"
        position={Position.Left}
        id="anode"
        style={{ top: "35%", background: "#f87171" }}
        className="w-3 h-3"
      />
      {/* Cathode handle (bottom) */}
      <Handle
        type="target"
        position={Position.Left}
        id="cathode"
        style={{ top: "65%", background: "#dc2626" }}
        className="w-3 h-3"
      />
    </div>
  );
}
