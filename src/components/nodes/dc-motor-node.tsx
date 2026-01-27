import { type NodeProps } from "@xyflow/react";
import type { DCMotorData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { dcMotorNodeConfig } from "./config";

export function DCMotorNode(props: NodeProps) {
  const data = props.data as unknown as DCMotorData;
  const isRunning = data?.isRunning || false;
  const speed = data?.speed || 0;
  const direction = data?.direction || "stopped";

  return (
    <BlueprintNode {...props} config={dcMotorNodeConfig}>
      <div className="flex flex-col items-center gap-2 p-4">
        {/* Motor Visual */}
        <div className="relative flex items-center justify-center">
          {/* Motor body */}
          <div className="relative w-16 h-20">
            {/* Motor casing */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-600 rounded-lg border-2 border-gray-700 shadow-lg" />

            {/* Motor shaft with rotation */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-8 h-8 flex items-center justify-center">
              <div
                className={`w-full h-full rounded-full border-4 border-gray-800 bg-gray-300 ${
                  isRunning ? "animate-spin" : ""
                }`}
                style={{
                  animationDuration: isRunning ? `${Math.max(0.3, 2 - speed / 50)}s` : "0s",
                  animationDirection: direction === "ccw" ? "reverse" : "normal",
                }}
              >
                {/* Rotation indicator line */}
                <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-red-500 -translate-x-1/2" />
              </div>
            </div>

            {/* Terminals */}
            <div className="absolute bottom-2 left-2 w-2 h-3 bg-yellow-600 rounded-sm" />
            <div className="absolute bottom-2 right-2 w-2 h-3 bg-yellow-600 rounded-sm" />

            {/* Speed indicator */}
            {isRunning && speed > 0 && (
              <div className="absolute -top-1 -right-1 flex gap-0.5">
                <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label}
          </div>
          {isRunning && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">
              {speed}% {direction.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </BlueprintNode>
  );
}
