import { Copy, Trash2 } from "lucide-react";
import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCircuitActions, useNode } from "@/hooks/use-circuit";
import type { LedData, ArduinoUnoData } from "@/circuit/catalog";
import LedToolbar from "./toolbars/led-toolbar";

type NodeToolbarContentProps = {
  nodeId: string;
};

export function NodeToolbarContent({ nodeId }: NodeToolbarContentProps) {
  const { deleteNode, duplicateNode, updateNodeData } = useCircuitActions();
  const node = useNode(nodeId);
  const isLed = node?.type === "led";
  const isArduino = node?.type === "arduino-uno";

  const handleDelete = () => {
    deleteNode(nodeId);
  };

  const handleDuplicate = () => {
    duplicateNode(nodeId);
  };

  // Arduino pin control handlers
  const arduinoData = isArduino
    ? (node.data as unknown as ArduinoUnoData)
    : null;
  const pinState = arduinoData?.digitalPins?.d13 ?? {
    mode: "INPUT" as const,
    value: 0 as const,
  };

  const handleArduinoModeChange = (newMode: "INPUT" | "OUTPUT") => {
    if (!arduinoData) return;
    const nextPins = {
      ...(arduinoData.digitalPins ?? {}),
      d13: { ...pinState, mode: newMode },
    };
    updateNodeData<ArduinoUnoData>(nodeId, { digitalPins: nextPins });
  };

  const handleArduinoValueToggle = () => {
    if (!arduinoData || pinState.mode !== "OUTPUT") return;
    const nextValue = pinState.value === 1 ? 0 : 1;
    const nextPins = {
      ...(arduinoData.digitalPins ?? {}),
      d13: { ...pinState, value: nextValue as 0 | 1 },
    };
    updateNodeData<ArduinoUnoData>(nodeId, { digitalPins: nextPins });
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
        <>
          <div className="flex items-center gap-1.5 px-1">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              D13:
            </span>
            <Select
              value={pinState.mode}
              onValueChange={(value) =>
                handleArduinoModeChange(value as "INPUT" | "OUTPUT")
              }
            >
              <SelectTrigger className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INPUT">INPUT</SelectItem>
                <SelectItem value="OUTPUT">OUTPUT</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={pinState.value === 1 ? "default" : "outline"}
              size="sm"
              className="h-7 w-16 px-2 text-xs"
              disabled={pinState.mode !== "OUTPUT"}
              onClick={handleArduinoValueToggle}
            >
              {pinState.value === 1 ? "HIGH" : "LOW"}
            </Button>
          </div>
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
