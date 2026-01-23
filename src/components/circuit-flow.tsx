import { useCallback, useState } from "react";
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
import { Button } from "./ui/button";

const nodeTypes = {
  battery: BatteryNode,
  led: LedNode,
  button: ButtonNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

type EquipmentType = "battery" | "led" | "button";

const equipmentItems: Array<{ type: EquipmentType; label: string; icon: string }> = [
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
    [setEdges]
  );

  const addNode = useCallback(
    (type: EquipmentType) => {
      const id = crypto.randomUUID();
      const label = equipmentItems.find((item) => item.type === type)?.label || type;

      // Add node at center with small offset based on current node count
      const position = {
        x: 250 + nodes.length * 20,
        y: 100 + nodes.length * 20,
      };

      const newNode = {
        id,
        type,
        position,
        data: { label },
      };

      setNodes((nds) => [...nds, newNode]);
      setIsPanelOpen(false); // Close panel after adding
    },
    [nodes.length, setNodes]
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
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />

        {/* Toggle Button - Top Left */}
        <Panel position="top-left">
          <Button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="shadow-lg"
          >
            {isPanelOpen ? "Close" : "Add Equipment"}
          </Button>
        </Panel>

        {/* Equipment Palette - Center Left */}
        <Panel position="center-left">
          <div
            className={`bg-white rounded-lg shadow-xl border border-gray-200 p-4 transition-transform duration-300 ${
              isPanelOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{ minWidth: "200px" }}
          >
            <h3 className="font-semibold text-lg mb-4">Equipment</h3>
            <div className="space-y-2">
              {equipmentItems.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addNode(item.type)}
                  className="w-full px-4 py-3 text-left border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center gap-3"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
