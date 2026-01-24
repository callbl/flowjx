import { type NodeProps } from "@xyflow/react";
import type { BatteryData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { batteryNodeConfig } from "./config";

export function BatteryNode(props: NodeProps) {
  const data = props.data as unknown as BatteryData;

  return (
    <BlueprintNode {...props} config={batteryNodeConfig}>
      <div className="flex flex-col gap-2">
        {/* Voltage Display */}
        <div className="text-center">
          <div className="text-amber-400 font-bold text-lg">{data.voltage}V</div>
          <div className="text-gray-400 text-xs">Voltage</div>
        </div>

        {/* Battery Visual */}
        <div className="flex justify-center gap-2 py-2">
          <div className="flex flex-col items-center">
            <div className="w-5 h-8 bg-gray-600 rounded-sm border-2 border-gray-700" />
            <div className="text-xs text-gray-400 font-medium mt-1">−</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-5 h-10 bg-gray-600 rounded-sm border-2 border-gray-700" />
            <div className="text-xs text-amber-400 font-medium mt-1">+</div>
          </div>
        </div>
      </div>
    </BlueprintNode>
  );
}
