import { Copy, Trash2 } from "lucide-react";
import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import { useCircuitActions, useNode } from "@/hooks/use-circuit";
import type { LedData, ArduinoUnoData } from "@/circuit/catalog";
import LedToolbar from "./toolbars/led-toolbar";
import ArduinoUnoToolbar from "./toolbars/arduino-uno-toolbar";

type NodeToolbarContentProps = {
  nodeId: string;
};

export function NodeToolbarContent({ nodeId }: NodeToolbarContentProps) {
  const { deleteNode, duplicateNode } = useCircuitActions();
  const node = useNode(nodeId);
  const isLed = node?.type === "led";
  const isArduino = node?.type === "arduino-uno";

  const handleDelete = () => {
    deleteNode(nodeId);
  };

  const handleDuplicate = () => {
    duplicateNode(nodeId);
  };

  return (
    <NodeToolbar
      nodeId={nodeId}
      isVisible
      position={Position.Top}
      className="flex items-center justify-center gap-1 bg-background border rounded-md shadow-lg p-1"
    >
      {isLed && (
        <LedToolbar nodeId={nodeId} data={node.data as unknown as LedData} />
      )}
      {isArduino && (
        <ArduinoUnoToolbar
          nodeId={nodeId}
          data={node.data as unknown as ArduinoUnoData}
        />
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDuplicate}
        title="Duplicate"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </NodeToolbar>
  );
}
