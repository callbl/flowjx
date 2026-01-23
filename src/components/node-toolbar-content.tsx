import { Copy, Trash2 } from "lucide-react";
import { NodeToolbar, Position, useReactFlow, type Node } from "@xyflow/react";
import { Button } from "./ui/button";

type NodeToolbarContentProps = {
  nodeId: string;
};

export function NodeToolbarContent({ nodeId }: NodeToolbarContentProps) {
  const { getNode, setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  const handleDuplicate = () => {
    const node = getNode(nodeId);
    if (!node) return;

    const newNode: Node = {
      ...node,
      id: crypto.randomUUID(),
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    };

    setNodes((nds) => [...nds, newNode]);
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
