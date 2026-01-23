import { useCallback, useState, useEffect } from "react";
import { ToolCaseIcon } from "lucide-react";
import {
  ReactFlow,
  Panel,
  Background,
  Controls,
  type OnConnect,
  type Node,
  type Edge,
  addEdge,
  useNodesState,
  useEdgesState,
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

const nodeTypes = {
  battery: BatteryNode,
  led: LedNode,
  button: ButtonNode,
};

const edgeTypes = {
  default: DataEdge,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

type EquipmentType = "battery" | "led" | "button";

// Extended node data types
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const simulateCircuit = useCallback(
    (currentNodes: Node[], currentEdges: Edge[]) => {
      // Build adjacency list from edges - bidirectional graph
      const graph = new Map<
        string,
        Array<{ nodeId: string; handleId: string }>
      >();

      currentEdges.forEach((edge) => {
        const sourceKey = `${edge.source}:${edge.sourceHandle}`;
        const targetKey = `${edge.target}:${edge.targetHandle}`;

        if (!graph.has(sourceKey)) graph.set(sourceKey, []);
        if (!graph.has(targetKey)) graph.set(targetKey, []);

        graph
          .get(sourceKey)!
          .push({ nodeId: edge.target, handleId: edge.targetHandle || "" });
        graph
          .get(targetKey)!
          .push({ nodeId: edge.source, handleId: edge.sourceHandle || "" });
      });

      // Find all batteries
      const batteries = currentNodes.filter((n) => n.type === "battery");
      const poweredLeds = new Set<string>();

      // For each battery, trace circuits from + to -
      batteries.forEach((battery) => {
        const visited = new Set<string>();
        const queue: Array<{
          nodeId: string;
          handleId: string;
          path: string[];
        }> = [];

        // Start from battery positive terminal
        queue.push({
          nodeId: battery.id,
          handleId: "plus",
          path: [battery.id],
        });

        while (queue.length > 0) {
          const current = queue.shift()!;
          const key = `${current.nodeId}:${current.handleId}`;

          if (visited.has(key)) continue;
          visited.add(key);

          // Check if we reached battery negative terminal - complete circuit!
          if (current.nodeId === battery.id && current.handleId === "minus") {
            // Mark all LEDs in this path as powered (only if properly connected)
            current.path.forEach((nodeId) => {
              const node = currentNodes.find((n) => n.id === nodeId);
              if (node?.type === "led") {
                // Verify LED is connected with correct polarity
                const ledAnodeKey = `${nodeId}:anode`;
                const ledCathodeKey = `${nodeId}:cathode`;

                // Check if both anode and cathode are connected
                const anodeConnected =
                  graph.has(ledAnodeKey) && graph.get(ledAnodeKey)!.length > 0;
                const cathodeConnected =
                  graph.has(ledCathodeKey) &&
                  graph.get(ledCathodeKey)!.length > 0;

                if (anodeConnected && cathodeConnected) {
                  poweredLeds.add(nodeId);
                }
              }
            });
            continue;
          }

          // Get current node
          const currentNode = currentNodes.find((n) => n.id === current.nodeId);
          if (!currentNode) continue;

          // First, explore direct neighbors from this handle
          const neighbors = graph.get(key) || [];
          neighbors.forEach((neighbor) => {
            const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
            if (!visited.has(neighborKey)) {
              queue.push({
                nodeId: neighbor.nodeId,
                handleId: neighbor.handleId,
                path: [...current.path, neighbor.nodeId],
              });
            }
          });

          // Then handle internal component connections
          if (currentNode.type === "led") {
            // LED: Current flows anode → cathode only
            if (current.handleId === "anode") {
              // Can flow through to cathode
              const cathodeKey = `${current.nodeId}:cathode`;
              const cathodeNeighbors = graph.get(cathodeKey) || [];

              cathodeNeighbors.forEach((neighbor) => {
                const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
                if (!visited.has(neighborKey)) {
                  queue.push({
                    nodeId: neighbor.nodeId,
                    handleId: neighbor.handleId,
                    path: current.path, // Don't add LED again to path
                  });
                }
              });
            }
            // If at cathode, don't allow flow back to anode (wrong direction)
          } else if (currentNode.type === "button") {
            // Button: Only conducts when closed, bidirectional
            if ((currentNode.data as ButtonData).isClosed) {
              const otherHandle = current.handleId === "in" ? "out" : "in";
              const otherKey = `${current.nodeId}:${otherHandle}`;
              const otherNeighbors = graph.get(otherKey) || [];

              otherNeighbors.forEach((neighbor) => {
                const neighborKey = `${neighbor.nodeId}:${neighbor.handleId}`;
                if (!visited.has(neighborKey)) {
                  queue.push({
                    nodeId: neighbor.nodeId,
                    handleId: neighbor.handleId,
                    path: current.path,
                  });
                }
              });
            }
            // If button is open, it blocks current flow (already handled by not exploring)
          }
        }
      });

      // Update LED powered states only if they changed
      setNodes((nds) => {
        let hasChanges = false;
        const updatedNodes = nds.map((node) => {
          if (node.type === "led") {
            const shouldBePowered = poweredLeds.has(node.id);
            const currentlyPowered = (node.data as LedData).isPowered || false;

            if (shouldBePowered !== currentlyPowered) {
              hasChanges = true;
              return {
                ...node,
                data: {
                  ...node.data,
                  isPowered: shouldBePowered,
                } as LedData,
              };
            }
          }
          return node;
        });

        return hasChanges ? updatedNodes : nds;
      });
    },
    [setNodes],
  );

  // Run circuit simulation whenever nodes or edges change
  useEffect(() => {
    simulateCircuit(nodes, edges);
  }, [nodes, edges, simulateCircuit]);

  const toggleButton = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId && node.type === "button") {
            return {
              ...node,
              data: {
                ...node.data,
                isClosed: !(node.data as ButtonData).isClosed,
              } as ButtonData,
            };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const addNode = useCallback(
    (type: EquipmentType) => {
      const id = crypto.randomUUID();
      const label =
        equipmentItems.find((item) => item.type === type)?.label || type;

      // Add node at center with small offset based on current node count
      const position = {
        x: 250 + nodes.length * 20,
        y: 100 + nodes.length * 20,
      };

      // Create node data based on type
      let data: BatteryData | LedData | ButtonData;

      switch (type) {
        case "battery":
          data = { label, voltage: 5 };
          break;
        case "led":
          data = { label, isPowered: false };
          break;
        case "button":
          data = {
            label,
            isClosed: false,
            onToggle: () => toggleButton(id),
          };
          break;
      }

      const newNode = {
        id,
        type,
        position,
        data,
      };

      setNodes((nds) => [...nds, newNode]);
      setIsPanelOpen(false); // Close panel after adding
    },
    [nodes.length, setNodes, toggleButton],
  );

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
        snapToGrid
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />

        {/* Equipment Sheet - Top Left */}
        <Panel position="top-left">
          <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
            <SheetTrigger asChild>
              <Button className="shadow-lg" size="icon-lg" variant="secondary">
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
