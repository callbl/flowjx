import { Copy, Trash2 } from "lucide-react";
import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import { useCircuitActions } from "@/hooks/use-circuit";

type NodeToolbarContentProps = {
  nodeId: string;
};

export function NodeToolbarContent({ nodeId }: NodeToolbarContentProps) {
  const { deleteNode, duplicateNode } = useCircuitActions();

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
      className="flex gap-1 bg-background border rounded-md shadow-lg p-1"
    >
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
