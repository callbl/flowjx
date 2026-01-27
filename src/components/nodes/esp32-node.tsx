import { type NodeProps } from "@xyflow/react";
import type { Esp32Data } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { esp32NodeConfig } from "./config";

export function Esp32Node(props: NodeProps) {
  const data = props.data as unknown as Esp32Data;
  const isPowered = data?.isPowered || false;

  return (
    <BlueprintNode {...props} config={esp32NodeConfig}>
      <div className="flex flex-col gap-3 p-4">
        {/* ESP32 Board Visual */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Main board */}
            <div className="w-44 h-60 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg border-2 border-purple-800 shadow-lg">
              {/* USB Port */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-gray-300 rounded-sm border border-gray-400" />

              {/* ESP32 chip with antenna */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-20 h-24 bg-gray-900 rounded border border-gray-700">
                {/* Antenna pattern */}
                <div className="absolute top-1 right-1 w-4 h-4">
                  <div className="absolute inset-0 border-2 border-yellow-500 rounded-tl" />
                  <div className="absolute top-1 right-1 w-2 h-2 border-2 border-yellow-500 rounded-tl" />
                </div>
                <div className="flex items-center justify-center h-full">
                  <div className="text-[8px] text-gray-400 font-mono text-center">
                    ESP32
                    <br />
                    WROOM
                  </div>
                </div>
              </div>

              {/* Power LED - glows when powered */}
              <div
                className={`absolute top-6 left-4 w-2 h-2 rounded-full transition-all duration-300 ${
                  isPowered
                    ? "bg-blue-400 shadow-[0_0_8px_#60a5fa,0_0_16px_#60a5fa]"
                    : "bg-blue-900 shadow-none"
                }`}
              />

              {/* WiFi indicator icon */}
              <div className="absolute top-6 right-4 flex flex-col items-center gap-0.5">
                <div className="w-3 h-0.5 bg-cyan-400 rounded opacity-70" />
                <div className="w-2 h-0.5 bg-cyan-400 rounded opacity-70" />
                <div className="w-1 h-0.5 bg-cyan-400 rounded opacity-70" />
              </div>

              {/* Pin headers - Left */}
              <div className="absolute left-0 top-8 flex flex-col gap-1.5 -translate-x-1">
                {[...Array(19)].map((_, i) => (
                  <div key={`left-${i}`} className="w-2 h-1.5 bg-gray-900 border border-gray-700" />
                ))}
              </div>

              {/* Pin headers - Right */}
              <div className="absolute right-0 top-8 flex flex-col gap-1.5 translate-x-1">
                {[...Array(19)].map((_, i) => (
                  <div key={`right-${i}`} className="w-2 h-1.5 bg-gray-900 border border-gray-700" />
                ))}
              </div>

              {/* ESP32 text */}
              <div className="absolute bottom-2 right-3 text-[10px] text-white font-bold opacity-80">
                DevKit
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <div className="text-xs text-gray-400">
            Dual-core • WiFi + BT • 3.3V Logic
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
