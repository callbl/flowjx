import { type NodeProps } from "@xyflow/react";
import type { BuzzerData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { buzzerNodeConfig } from "./config";

export function BuzzerNode(props: NodeProps) {
  const data = props.data as unknown as BuzzerData;
  const isActive = data?.isActive || false;

  return (
    <BlueprintNode {...props} config={buzzerNodeConfig}>
      <div className="flex flex-col items-center gap-2 p-4">
        {/* Buzzer Visual */}
        <div className="relative flex items-center justify-center">
          {/* Sound waves when active */}
          {isActive && (
            <>
              <div className="absolute inset-0 animate-ping">
                <div className="w-full h-full rounded-full border-2 border-orange-400 opacity-75" />
              </div>
              <div className="absolute inset-0 animate-pulse delay-75">
                <div className="w-full h-full rounded-full border-2 border-orange-300 opacity-50" style={{ animationDelay: "150ms" }} />
              </div>
            </>
          )}

          {/* Buzzer body */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 shadow-lg">
            {/* Top speaker grille */}
            <div className="absolute inset-3 rounded-full bg-gray-950 flex items-center justify-center overflow-hidden">
              <div className="flex flex-col gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-0.5 rounded-full transition-colors ${
                      isActive ? "bg-orange-400" : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#f97316]" />
            )}
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {data.label}
          </div>
          {isActive && data.frequency > 0 && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">
              {data.frequency} Hz
            </div>
          )}
        </div>
      </div>
    </BlueprintNode>
  );
}
