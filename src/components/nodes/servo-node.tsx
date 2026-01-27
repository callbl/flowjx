import { type NodeProps } from "@xyflow/react";
import type { ServoData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { servoNodeConfig } from "./config";

export function ServoNode(props: NodeProps) {
  const data = props.data as unknown as ServoData;
  const isPowered = data?.isPowered || false;
  const angle = data?.angle || 90;

  return (
    <BlueprintNode {...props} config={servoNodeConfig}>
      <div className="flex flex-col items-center gap-2 p-4">
        {/* Servo Visual */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Servo body */}
          <div className="absolute bottom-0 w-16 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded border-2 border-blue-900 shadow-lg">
            {/* Mounting holes */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-gray-900" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-gray-900" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-gray-900" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-gray-900" />

            {/* Wires */}
            <div className="absolute -bottom-2 left-2 flex gap-1">
              <div className="w-1 h-3 bg-red-600 rounded-sm" />
              <div className="w-1 h-3 bg-gray-800 rounded-sm" />
              <div className="w-1 h-3 bg-orange-600 rounded-sm" />
            </div>
          </div>

          {/* Servo horn (rotates based on angle) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <div
              className="relative w-10 h-10 transition-transform duration-300 ease-out"
              style={{
                transform: `rotate(${angle - 90}deg)`,
              }}
            >
              {/* Horn arm */}
              <div className="absolute left-1/2 top-1/2 w-1 h-8 bg-white rounded-full -translate-x-1/2 origin-bottom shadow-lg" />

              {/* Horn center */}
              <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-gray-300 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-gray-600 shadow-md" />

              {/* Horn tip indicator */}
              <div className="absolute left-1/2 top-0 w-2 h-2 bg-red-500 rounded-full -translate-x-1/2 shadow-sm" />
            </div>
          </div>

          {/* Power indicator */}
          {isPowered && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_4px_#22c55e]" />
          )}
        </div>

        {/* Status */}
        <div className="text-center mt-2">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label}
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">
            {angle}°
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
