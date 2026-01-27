import { type NodeProps } from "@xyflow/react";
import type { BatteryData } from "@/circuit/catalog";
import { BlueprintNode } from "./blueprint-node";
import { batteryNodeConfig } from "./config";
import { useCircuitActions } from "@/hooks/use-circuit";

export function BatteryNode(props: NodeProps) {
  const data = props.data as unknown as BatteryData;
  const { updateNodeData } = useCircuitActions();

  const handleVoltageChange = (newVoltage: number) => {
    updateNodeData(props.id, { voltage: newVoltage });
  };

  const voltageOptions = [1.5, 3, 3.3, 5, 6, 9, 12, 24];

  return (
    <BlueprintNode {...props} config={batteryNodeConfig}>
      <div className="flex flex-col gap-2">
        {/* Voltage Selector */}
        <div className="text-center">
          <div className="text-amber-400 font-bold text-lg mb-1">{data.voltage}V</div>
          <select
            value={data.voltage}
            onChange={(e) => handleVoltageChange(Number(e.target.value))}
            className="text-xs bg-gray-800 text-gray-200 border border-gray-700 rounded px-2 py-1 cursor-pointer hover:bg-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {voltageOptions.map((v) => (
              <option key={v} value={v}>
                {v}V
              </option>
            ))}
          </select>
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
