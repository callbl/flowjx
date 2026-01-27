import { type NodeProps } from "@xyflow/react";
import type { LCD16x2Data } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { lcd16x2NodeConfig } from "./config";

export function LCD16x2Node(props: NodeProps) {
  const data = props.data as unknown as LCD16x2Data;
  const isPowered = data?.isPowered || false;
  const line1 = data?.line1 || "";
  const line2 = data?.line2 || "";
  const backlight = data?.backlight !== false; // default true

  return (
    <BlueprintNode {...props} config={lcd16x2NodeConfig}>
      <div className="flex flex-col items-center gap-2 p-4">
        {/* LCD Display */}
        <div className="relative w-64 h-24 bg-gradient-to-br from-green-900 to-green-950 rounded border-2 border-gray-700 shadow-lg overflow-hidden">
          {/* Backlight glow */}
          {isPowered && backlight && (
            <div className="absolute inset-0 bg-green-500/20" />
          )}

          {/* LCD Screen */}
          <div className={`absolute inset-2 rounded flex flex-col gap-1 p-2 font-mono text-sm transition-all ${
            isPowered && backlight
              ? "bg-green-400/90 text-gray-900"
              : "bg-green-950/50 text-green-800"
          }`}>
            {/* Line 1 */}
            <div className="h-6 flex items-center">
              {isPowered ? (
                <span className="tracking-wider">
                  {line1.padEnd(16, " ").substring(0, 16)}
                </span>
              ) : (
                <span className="opacity-30">................</span>
              )}
            </div>

            {/* Line 2 */}
            <div className="h-6 flex items-center">
              {isPowered ? (
                <span className="tracking-wider">
                  {line2.padEnd(16, " ").substring(0, 16)}
                </span>
              ) : (
                <span className="opacity-30">................</span>
              )}
            </div>
          </div>

          {/* PCB details */}
          <div className="absolute bottom-1 right-2 text-[8px] text-gray-500 font-mono">
            LCD1602
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400">
            16x2 Character Display
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
