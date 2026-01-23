import { ToolCaseIcon } from "lucide-react";
import {
  ReactFlow,
  Panel,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { BatteryNode } from "./nodes/battery-node";
import { LedNode } from "./nodes/led-node";
import { ButtonNode } from "./nodes/button-node";
import { DataEdge } from "./data-edge";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  useNodes,
  useEdges,
  useReactFlowCallbacks,
  useIsPanelOpen,
  useSetPanelOpen,
  useCircuitActions,
} from "@/hooks/use-circuit";

const nodeTypes = {
  battery: BatteryNode,
  led: LedNode,
  button: ButtonNode,
};

const edgeTypes = {
  default: DataEdge,
};

// Node data types (exported for use in other files)
export type BatteryData = {
  label: string;
  voltage: number;
};

export type LedData = {
  label: string;
  isPowered: boolean;
};

export type ButtonData = {
  label: string;
  isClosed: boolean;
  onToggle?: () => void;
};

type EquipmentType = "battery" | "led" | "button";

const equipmentItems: Array<{
  type: EquipmentType;
  label: string;
  icon: string;
}> = [
  { type: "battery", label: "Battery", icon: "🔋" },
  { type: "led", label: "LED", icon: "💡" },
  { type: "button", label: "Button", icon: "🔘" },
];

export function CircuitFlow() {
  // Zustand store hooks
  const nodes = useNodes();
  const edges = useEdges();
  const { onNodesChange, onEdgesChange, onConnect } = useReactFlowCallbacks();
  const isPanelOpen = useIsPanelOpen();
  const setPanelOpen = useSetPanelOpen();
  const { addNode } = useCircuitActions();

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />

        {/* Equipment Sheet - Top Left */}
        <Panel position="top-left">
          <Sheet open={isPanelOpen} onOpenChange={setPanelOpen}>
            <SheetTrigger asChild>
              <Button className="shadow-lg" size="icon" variant="secondary">
                <ToolCaseIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Equipment</SheetTitle>
                <SheetDescription>
                  Select components to add to your circuit
                </SheetDescription>
              </SheetHeader>
              <div className="p-4 grid grid-cols-2 gap-3 mt-6">
                {equipmentItems.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addNode(item.type)}
                    className="flex flex-col items-center gap-2 p-4 border-1 border-primary/5 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </Panel>
      </ReactFlow>
    </div>
  );
}
