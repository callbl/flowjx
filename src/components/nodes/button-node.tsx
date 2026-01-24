import { type NodeProps, type Node } from "@xyflow/react";
import type { ButtonData } from "../circuit-flow";
import { BlueprintNode } from "./blueprint-node";
import { buttonNodeConfig } from "./config";
import { useCircuitActions } from "@/hooks/use-circuit";
import { Button } from "../ui/button";

export function ButtonNode(props: NodeProps<Node<ButtonData>>) {
  const { id, data } = props;
  const isClosed = data.isClosed || false;
  const { toggleButton } = useCircuitActions();

  return (
    <BlueprintNode {...props} config={buttonNodeConfig}>
      <div className="flex flex-col gap-3">
        {/* Status Display */}
        <div className="text-center">
          <div
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: isClosed ? "#10b981" : "#6b7280" }}
          >
            {isClosed ? "Closed" : "Open"}
          </div>
        </div>

        {/* Button Control */}
        <div className="flex justify-center">
          <Button
            variant={isClosed ? "default" : "outline"}
            size="sm"
            className="nodrag min-w-[80px]"
            onClick={() => toggleButton(id)}
            style={{
              backgroundColor: isClosed ? "#10b981" : "transparent",
              borderColor: "#10b981",
              color: isClosed ? "#ffffff" : "#10b981",
            }}
          >
            {isClosed ? "ON" : "OFF"}
          </Button>
        </div>

        {/* Circuit Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: isClosed ? "#10b981" : "#374151",
              boxShadow: isClosed ? "0 0 8px #10b981" : "none",
            }}
          />
          <span>{isClosed ? "Circuit Closed" : "Circuit Open"}</span>
        </div>
      </div>
    </BlueprintNode>
  );
}
