import { useCallback } from "react";
import {
  ReactFlow,
  type Node,
  type Edge,
  type OnConnect,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { ButtonNode } from "./components/nodes/button-node";
import { LedNode } from "./components/nodes/led-node";
import { BatteryNode } from "./components/nodes/battery-node";
import { DataEdge } from "./components/data-edge";

const nodeTypes = {
  button: ButtonNode,
  led: LedNode,
  battery: BatteryNode,
};

const edgeTypes = {
  data: DataEdge,
};

const initialNodes: Node[] = [
  {
    id: "battery",
    type: "battery",
    data: { isOn: true },
    position: { x: 0, y: 100 },
  },
  {
    id: "button",
    type: "button",
    data: { isOn: false, isPressed: false },
    position: { x: 300, y: 100 },
  },
  {
    id: "led",
    type: "led",
    data: { isOn: false },
    position: { x: 600, y: 100 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "battery->button",
    type: "data",
    data: { key: "isOn" },
    source: "battery",
    target: "button",
    sourceHandle: "out",
    targetHandle: "in",
    animated: true,
  },
  {
    id: "button->led",
    type: "data",
    data: { key: "isOn" },
    source: "button",
    target: "led",
    sourceHandle: "out",
    targetHandle: "in",
    animated: true,
  },
];

function CircuitFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edges) =>
        addEdge({ type: "data", data: { key: "isOn" }, ...params }, edges)
      );
    },
    [setEdges]
  );

  return (
    <div className="h-screen w-screen bg-gray-50">
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
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

const App = () => {
  return <CircuitFlow />;
};

App.displayName = "App";
export default App;
