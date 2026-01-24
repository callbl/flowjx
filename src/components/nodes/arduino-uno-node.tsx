import { type NodeProps, type Node } from "@xyflow/react";
import type { ArduinoUnoData } from "../circuit-flow";
import { BlueprintNode } from "./blueprint-node";
import { arduinoUnoNodeConfig } from "./config";

export function ArduinoUnoNode(props: NodeProps<Node<ArduinoUnoData>>) {
  return (
    <BlueprintNode {...props} config={arduinoUnoNodeConfig}>
      <div className="flex flex-col gap-3 p-4">
        {/* Arduino Board Visual */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Main board */}
            <div className="w-40 h-56 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg border-2 border-blue-800 shadow-lg">
              {/* USB Port */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-gray-300 rounded-sm border border-gray-400" />

              {/* ATmega chip */}
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-20 bg-gray-900 rounded border border-gray-700 flex items-center justify-center">
                <div className="text-[8px] text-gray-400 font-mono text-center">
                  ATmega
                  <br />
                  328P
                </div>
              </div>

              {/* Power LED */}
              <div className="absolute top-6 left-4 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_4px_#4ade80]" />

              {/* Pin headers - Left */}
              <div className="absolute left-0 top-10 flex flex-col gap-1.5 -translate-x-1">
                {[...Array(7)].map((_, i) => (
                  <div key={`left-${i}`} className="w-2 h-1.5 bg-gray-900 border border-gray-700" />
                ))}
              </div>

              {/* Pin headers - Right */}
              <div className="absolute right-0 top-2 flex flex-col gap-1.5 translate-x-1">
                {[...Array(14)].map((_, i) => (
                  <div key={`right-${i}`} className="w-2 h-1.5 bg-gray-900 border border-gray-700" />
                ))}
              </div>

              {/* Pin headers - Bottom (Analog) */}
              <div className="absolute bottom-0 left-4 flex gap-1.5 translate-y-1">
                {[...Array(6)].map((_, i) => (
                  <div key={`bottom-${i}`} className="w-1.5 h-2 bg-gray-900 border border-gray-700" />
                ))}
              </div>

              {/* Arduino text */}
              <div className="absolute bottom-2 right-3 text-[10px] text-white font-bold opacity-80">
                UNO
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <div className="text-xs text-gray-400">
            ATmega328P • 5V Logic
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
