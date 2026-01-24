import { type NodeProps } from "@xyflow/react";
import type { LedData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { ledNodeConfig } from "./config";

export function LedNode(props: NodeProps) {
  const data = props.data as unknown as LedData;
  const isPowered = data.isPowered || false;
  const color = data.color || "#ef4444";

  return (
    <BlueprintNode {...props} config={ledNodeConfig}>
      <div className="flex flex-col gap-3">
        {/* Status */}
        <div className="text-center">
          <div
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: isPowered ? color : "#9ca3af" }}
          >
            {isPowered ? "Powered" : "Off"}
          </div>
        </div>

        {/* LED Visual */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="w-14 h-14 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isPowered ? color : "#374151",
                boxShadow: isPowered
                  ? `0 0 20px ${color}, 0 0 40px ${color}80`
                  : "none",
                border: `3px solid ${isPowered ? color : "#4b5563"}`,
              }}
            />
            {isPowered && (
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  backgroundColor: `${color}40`,
                  filter: "blur(8px)",
                }}
              />
            )}
          </div>
        </div>

        {/* Pin Labels */}
        <div className="flex justify-between text-xs text-gray-400 px-2">
          <div>
            <div className="text-amber-400">+</div>
            <div className="text-[10px]">Anode</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400">−</div>
            <div className="text-[10px]">Cathode</div>
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
