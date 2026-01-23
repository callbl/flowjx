import { Copy, Trash2 } from "lucide-react";
import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import { ColorSelector } from "./color-selector";
import { useCircuitActions, useNode } from "@/hooks/use-circuit";
import type { LedData } from "./circuit-flow";

type NodeToolbarContentProps = {
  nodeId: string;
};

export function NodeToolbarContent({ nodeId }: NodeToolbarContentProps) {
  const { deleteNode, duplicateNode, updateNodeData } = useCircuitActions();
  const node = useNode(nodeId);
  const isLed = node?.type === "led";

  const handleDelete = () => {
    deleteNode(nodeId);
  };

  const handleDuplicate = () => {
    duplicateNode(nodeId);
  };

  const handleColorChange = (color: string) => {
    updateNodeData<LedData>(nodeId, { color });
  };

  return (
    <NodeToolbar
      nodeId={nodeId}
      isVisible
      position={Position.Top}
      className="flex items-center justify-center gap-1 bg-background border rounded-md shadow-lg p-1"
    >
      {isLed && (
        <>
          <ColorSelector
            selectedColor={(node.data as LedData).color}
            onColorChange={handleColorChange}
          />
          <div className="h-4 w-px bg-border mx-0.5" />
        </>
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
