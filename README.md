# FlowJX

An interactive circuit simulator built with React and ReactFlow. Design and simulate electronic circuits in a visual, node-based interface.

## Features

- **Visual Circuit Editor**: Drag-and-drop interface for building circuits
- **Real-time Simulation**: Circuits simulate automatically as you build them
- **Interactive Components**:
  - Battery (5V power source)
  - LED (with proper polarity support and customizable colors)
  - Button (toggle on/off to control circuit flow)
  - Arduino Uno (complete ATmega328P microcontroller simulation with 20+ pins)
- **Circuit Analysis**: Automatic circuit tracing using graph traversal algorithms
- **Pin-Level Control**: Configure Arduino digital pins (INPUT/OUTPUT modes, HIGH/LOW values)
- **Component Customization**: Edit component properties using specialized toolbars
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
2. Select a component (Battery, LED, Button, or Arduino Uno) to add it to the canvas
3. Drag components to position them
4. Connect components by dragging from one handle to another
5. Click on nodes to access component-specific toolbars:
   - LEDs: Choose custom colors
   - Arduino Uno: Configure D13 pin mode (INPUT/OUTPUT) and value (HIGH/LOW)
   - All nodes: Duplicate or delete
6. Interactive buttons can be toggled on/off to open or close the circuit
7. LEDs will light up when properly powered in a complete circuit
8. Arduino Uno can power LEDs through its digital pins when set to OUTPUT/HIGH

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
│   ├── nodes/              # Component node implementations
│   │   ├── battery-node.tsx
│   │   ├── led-node.tsx
│   │   ├── button-node.tsx
│   │   ├── arduino-uno-node.tsx
│   │   ├── blueprint-node.tsx  # Base visual component
│   │   └── config.ts           # Handle/pin definitions
│   ├── toolbars/           # Component-specific toolbars
│   │   ├── led-toolbar.tsx
│   │   └── arduino-uno-toolbar.tsx
│   ├── ui/                 # Reusable UI components
│   ├── node-toolbar-content.tsx # Toolbar orchestrator
│   ├── base-handle.tsx     # Connection handle component
│   ├── data-edge.tsx       # Custom edge component
│   └── circuit-flow.tsx    # Main circuit editor
├── circuit/
│   ├── catalog/            # Component registry
│   │   ├── index.ts        # NODE_CATALOG
│   │   └── types.ts        # Type definitions
│   └── definitions/        # Electrical behavior
│       ├── battery.ts
│       ├── led.ts
│       ├── button.ts
│       └── arduino-uno.ts
├── lib/
│   └── circuit-simulation.ts  # BFS simulation engine
├── stores/
│   └── circuit-store.ts    # Zustand state management
├── App.tsx
└── main.tsx
```

## Circuit Simulation

The simulator implements realistic circuit behavior using a catalog-driven, definition-based architecture:

- Current flows from battery positive (+) to negative (-) terminals
- LEDs require correct polarity connection (anode to cathode)
- Buttons act as switches that can open or close circuits
- Arduino Uno simulates power distribution (VIN → 5V/3.3V → GND)
- Digital pins can drive components directly (e.g., D13 OUTPUT/HIGH powering an LED)
- Components are analyzed using bidirectional graph traversal to detect complete circuits
- Visual feedback shows which components are powered in real-time
- Each component defines its own electrical behavior through `internalEdges()` and `deriveState()` functions

## Arduino Uno Component

The Arduino Uno simulation includes:

**Pin Layout:**
- Power: VIN, 5V, 3.3V, GND (×2), AREF, RESET
- Digital I/O: D0-D13 (bidirectional, configurable)
- Analog Inputs: A0-A5 (bidirectional)

**Power Behavior:**
- Arduino powers when VIN or 5V is connected to a power source AND at least one GND is connected
- Internal voltage regulator simulated (VIN → 5V/3.3V → GND)
- Power LED (green) indicates when Arduino is receiving power

**Pin Control:**
- D13 pin defaults to OUTPUT mode
- Use the Arduino toolbar to toggle D13 between INPUT/OUTPUT modes
- When OUTPUT, toggle between HIGH (1) and LOW (0) values
- D13 LED (amber) glows when pin is OUTPUT/HIGH

**Pin-Driven Components:**
- Digital pins set to OUTPUT/HIGH can power LEDs and other components
- Example: Connect D13 → LED anode, LED cathode → battery GND to light an LED from the Arduino

## Development Notes

- React Compiler is enabled for optimized performance
- ESLint is configured for code quality
- TypeScript strict mode for type safety
- Uses React 19 with Fast Refresh for optimal DX

## License

Private project
