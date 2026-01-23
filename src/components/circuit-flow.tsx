import { useEffect, useRef, useState } from "react";
import { DownloadIcon, ToolCaseIcon, UploadIcon, MenuIcon } from "lucide-react";
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  useNodes,
  useEdges,
  useReactFlowCallbacks,
  useIsPanelOpen,
  useSetPanelOpen,
  useCircuitActions,
  useSetNodes,
  useSetEdges,
} from "@/hooks/use-circuit";
import { downloadTextFile } from "@/persistence/download";
import {
  serializeCircuitFile,
  parseCircuitFile,
  CircuitFileParseError,
} from "@/persistence/circuit-file";

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
  color?: string;
};

export type ButtonData = {
  label: string;
  isClosed: boolean;
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

function CircuitFlowInner() {
  // Zustand store hooks
  const nodes = useNodes();
  const edges = useEdges();
  const setNodes = useSetNodes();
  const setEdges = useSetEdges();
  const { onNodesChange, onEdgesChange, onConnect } = useReactFlowCallbacks();
  const isPanelOpen = useIsPanelOpen();
  const setPanelOpen = useSetPanelOpen();
  const { addNode, logConnections, runSimulation } = useCircuitActions();

  // React Flow instance for toObject() and setViewport()
  const { toObject, setViewport } = useReactFlow();

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Import error state
  const [importError, setImportError] = useState<string | null>(null);

  // Auto-log connections every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      logConnections();
    }, 10000);

    return () => clearInterval(interval);
  }, [logConnections]);

  // Clear import error after 5 seconds
  useEffect(() => {
    if (importError) {
      const timeout = setTimeout(() => setImportError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [importError]);

  // Export handler
  const handleExport = () => {
    const flow = toObject();
    const circuitFile = serializeCircuitFile(flow);
    const json = JSON.stringify(circuitFile, null, 2);
    const filename = `diagram-${Date.now()}.circuit`;

    downloadTextFile({
      filename,
      text: json,
      mimeType: "application/json",
    });
  };

  // Import handler
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const circuitFile = parseCircuitFile(text);

      // Restore nodes and edges
      setNodes(circuitFile.flow.nodes || []);
      setEdges(circuitFile.flow.edges || []);

      // Restore viewport with defaults if missing
      const viewport = circuitFile.flow.viewport || { x: 0, y: 0, zoom: 1 };
      setViewport(viewport);

      // Run simulation to update LED states
      runSimulation();

      setImportError(null);
    } catch (error) {
      if (error instanceof CircuitFileParseError) {
        setImportError(error.message);
      } else {
        setImportError("Failed to load circuit file");
      }
    } finally {
      // Reset file input so the same file can be imported again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

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

        {/* File Menu - Top Right */}
        <Panel position="top-right">
          <div className="flex flex-col gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="shadow-lg"
                  size="icon"
                  variant="secondary"
                  title="File menu"
                >
                  <MenuIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  <DownloadIcon />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportClick}>
                  <UploadIcon />
                  Import
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".circuit,application/json"
              onChange={handleImport}
              style={{ display: "none" }}
            />

            {/* Import Error Message */}
            {importError && (
              <div className="bg-red-500 text-white text-xs p-2 rounded shadow-lg max-w-[200px]">
                {importError}
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
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
