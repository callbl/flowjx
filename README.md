# FlowJX

An interactive circuit simulator built with React and ReactFlow. Design and simulate electronic circuits in a visual, node-based interface.

## Features

- **Visual Circuit Editor**: Drag-and-drop interface for building circuits
- **Real-time Simulation**: Circuits simulate automatically as you build them
- **Interactive Components**:
  - Battery (5V power source)
  - LED (with proper polarity support)
  - Button (toggle on/off to control circuit flow)
- **Circuit Analysis**: Automatic circuit tracing from battery positive to negative terminals
- **Component Customization**: Edit component properties using node toolbars
- **Edge Toolbars**: Customize connections between components

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. Click the toolbox icon in the top-left corner to open the equipment panel
2. Select a component (Battery, LED, or Button) to add it to the canvas
3. Drag components to position them
4. Connect components by dragging from one handle to another
5. Click on nodes or edges to access toolbars for customization
6. Interactive buttons can be toggled on/off to open or close the circuit
7. LEDs will light up when properly powered in a complete circuit

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ReactFlow** (@xyflow/react) - Node-based editor
- **TailwindCSS** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/
│   ├── nodes/          # Component node implementations
│   │   ├── battery-node.tsx
│   │   ├── led-node.tsx
│   │   └── button-node.tsx
│   ├── ui/             # Reusable UI components
│   ├── base-node.tsx   # Base node component
│   ├── base-handle.tsx # Connection handle component
│   ├── data-edge.tsx   # Custom edge component
│   └── circuit-flow.tsx # Main circuit editor
├── App.tsx
└── main.tsx
```

## Circuit Simulation

The simulator implements realistic circuit behavior:

- Current flows from battery positive (+) to negative (-) terminals
- LEDs require correct polarity connection (anode to cathode)
- Buttons act as switches that can open or close circuits
- Components are analyzed using graph traversal to detect complete circuits
- Visual feedback shows which LEDs are powered in real-time

## Development Notes

- React Compiler is enabled for optimized performance
- ESLint is configured for code quality
- TypeScript strict mode for type safety
- Uses React 19 with Fast Refresh for optimal DX

## License

Private project
