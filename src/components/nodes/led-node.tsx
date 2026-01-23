import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { PlusIcon, MinusIcon } from "lucide-react";
import type { LedData } from "../circuit-flow";
import { NodeToolbarContent } from "../node-toolbar-content";

export function LedNode({ id, data, selected }: NodeProps<Node<LedData>>) {
  const isPowered = data.isPowered || false;
  const color = data.color || "#ef4444"; // Default to red

  return (
    <>
      {selected && <NodeToolbarContent nodeId={id} />}
      <div
        className="px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[100px] relative"
        style={{
          borderColor: color,
        }}
      >
        <div className="font-semibold text-sm mb-2">{data.label}</div>
        <div className="flex justify-center mb-2">
          <div
            className={`size-12 rounded-full border-4 transition-all duration-300 ${
              isPowered ? "shadow-lg" : ""
            }`}
            style={{
              borderColor: color,
              backgroundColor: isPowered ? color : `${color}20`,
            }}
          />
        </div>
        {/* Polarity indicators */}
        <PlusIcon className="absolute left-2 top-[35%] translate-y-[-50%] translate-x-[-50%] size-2 text-green-500" />
        <MinusIcon className="absolute left-2 top-[65%] translate-y-[-50%] translate-x-[-50%] size-2 text-gray-800" />
        {/* Anode handle (positive terminal) - both input and output */}
        <Handle
          type="target"
          position={Position.Left}
          id="anode"
          style={{ top: "35%" }}
          className="size-2"
        />
        <Handle
          type="source"
          position={Position.Left}
          id="anode"
          style={{ top: "35%" }}
          className="size-2"
        />
        {/* Cathode handle (negative terminal) - both input and output */}
        <Handle
          type="target"
          position={Position.Left}
          id="cathode"
          style={{ top: "65%" }}
          className="size-2"
        />
        <Handle
          type="source"
          position={Position.Left}
          id="cathode"
          style={{ top: "65%" }}
          className="size-2"
        />
      </div>
    </>
  );
}
