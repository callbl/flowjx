import { type NodeProps } from "@xyflow/react";
import type { RgbLedData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { rgbLedNodeConfig } from "./config";

export function RgbLedNode(props: NodeProps) {
  const data = props.data as unknown as RgbLedData;
  const isPowered = data?.isPowered || false;
  const red = data?.red || 0;
  const green = data?.green || 0;
  const blue = data?.blue || 0;

  return (
    <BlueprintNode {...props} config={rgbLedNodeConfig}>
      <div className="flex flex-col items-center gap-2 p-4">
        {/* RGB LED Visual */}
        <div className="relative flex items-center justify-center">
          {/* Glow effect when powered */}
          {isPowered && (red > 0 || green > 0 || blue > 0) && (
            <div
              className="absolute inset-0 rounded-full blur-xl transition-all duration-300"
              style={{
                backgroundColor: `rgb(${red}, ${green}, ${blue})`,
                opacity: 0.6,
                transform: "scale(1.8)",
              }}
            />
          )}

          {/* LED body */}
          <div className="relative w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            {/* LED color overlay */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                backgroundColor: isPowered
                  ? `rgb(${red}, ${green}, ${blue})`
                  : "rgb(40, 40, 40)",
                opacity: isPowered && (red > 0 || green > 0 || blue > 0) ? 0.9 : 0.3,
              }}
            />

            {/* LED lens effect */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label}
          </div>
          {isPowered && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">
              RGB({red}, {green}, {blue})
            </div>
          )}
        </div>
      </div>
    </BlueprintNode>
  );
}
