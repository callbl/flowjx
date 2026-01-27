import { useState } from "react";
import { ToolCaseIcon, Code2 } from "lucide-react";
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { NODE_TYPES, EQUIPMENT_ITEMS } from "@/circuit/catalog";
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
import { useTheme } from "./providers/theme-provider";
import { ZoomSlider } from "./zoom-slider";
import AppMenu from "./app-menu";
import { ArduinoEditor } from "./arduino-editor";

const edgeTypes = {
  default: DataEdge,
};

// Re-export node data types from catalog for backward compatibility
export type {
  BatteryData,
  LedData,
  ButtonData,
  ArduinoUnoData,
} from "@/circuit/catalog";

function CircuitFlowInner() {
  // Zustand store hooks
  const nodes = useNodes();
  const edges = useEdges();
  const { onNodesChange, onEdgesChange, onConnect } = useReactFlowCallbacks();
  const isPanelOpen = useIsPanelOpen();
  const setPanelOpen = useSetPanelOpen();
  const { addNode } = useCircuitActions();
  const { theme } = useTheme();

  // Arduino Editor state
  const [isArduinoEditorOpen, setIsArduinoEditorOpen] = useState(false);

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        edgeTypes={edgeTypes}
        fitView
        colorMode={theme}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <ZoomSlider position="bottom-left" />

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
                {EQUIPMENT_ITEMS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => addNode(item.type as never)}
                      className="flex flex-col items-center gap-2 p-4 border-1 border-primary/5 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <IconComponent className="w-8 h-8" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </Panel>

        {/* Arduino Editor Button - Top Center */}
        <Panel position="top-center">
          <Button
            onClick={() => setIsArduinoEditorOpen(!isArduinoEditorOpen)}
            className="shadow-lg"
            variant={isArduinoEditorOpen ? "default" : "secondary"}
            size="sm"
          >
            <Code2 className="w-4 h-4 mr-2" />
            Arduino IDE
          </Button>
        </Panel>

        {/* File Menu - Top Right */}
        <Panel position="top-right">
          <AppMenu />
        </Panel>
      </ReactFlow>

      {/* Arduino Editor Panel */}
      <ArduinoEditor
        isOpen={isArduinoEditorOpen}
        onClose={() => setIsArduinoEditorOpen(false)}
      />
    </div>
  );
}

// Wrapper component that provides ReactFlowProvider context
export function CircuitFlow() {
  return (
    <ReactFlowProvider>
      <CircuitFlowInner />
    </ReactFlowProvider>
  );
}
