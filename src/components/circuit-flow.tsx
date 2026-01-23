import { useCallback, useState, useEffect } from "react";
import { MenuIcon, XIcon } from "lucide-react";
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
      // Build adjacency list from edges
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
            // Mark all LEDs in this path as powered
            current.path.forEach((nodeId) => {
              const node = currentNodes.find((n) => n.id === nodeId);
              if (node?.type === "led") {
                poweredLeds.add(nodeId);
              }
            });
            continue;
          }

          // Get current node
          const currentNode = currentNodes.find((n) => n.id === current.nodeId);
          if (!currentNode) continue;

          // If it's a button and it's open, don't continue this path
          if (
            currentNode.type === "button" &&
            !(currentNode.data as ButtonData).isClosed
          ) {
            continue;
          }

          // Explore neighbors
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

          // For LEDs, also check the other handle
          if (currentNode.type === "led") {
            const otherHandle =
              current.handleId === "anode" ? "cathode" : "anode";
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

          // For buttons, check the other handle (in/out)
          if (
            currentNode.type === "button" &&
            (currentNode.data as ButtonData).isClosed
          ) {
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
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />

        {/* Toggle Button - Top Left */}
        <Panel position="top-left">
          <Button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="shadow-lg"
            size="icon-lg"
          >
            {isPanelOpen ? <XIcon /> : <MenuIcon />}
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
