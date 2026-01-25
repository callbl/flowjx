# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start Vite dev server on http://localhost:5173
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture Overview

FlowJX is a circuit simulator built on React Flow that implements real-time circuit analysis through a catalog-driven, definition-based graph traversal system.

### Core Circuit Simulation

The circuit simulation engine (`src/lib/circuit-simulation.ts`) implements a **bidirectional graph traversal algorithm** with these phases:

1. **Connected Components Detection**: Isolates independent circuits using DFS
2. **Graph Building**: Creates adjacency list where each connection point is a `nodeId:handleId` key
3. **Internal Edge Injection**: Each node defines internal current paths via `internalEdges()` function
4. **Battery Path Tracing**: BFS from battery+ to battery− to find complete circuits
5. **Pin Signal Propagation**: Arduino HIGH outputs can power components
6. **State Derivation**: Each node computes state via `deriveState()` function using traversal results

Key simulation behaviors:
- **LEDs**: Current flows anode → cathode only (unidirectional)
- **Buttons**: Bidirectional flow when closed, blocks current when open
- **Batteries**: Provide voltage from + terminal, complete circuit at - terminal
- **Arduino Uno**: Powers when VIN/5V and GND connected; digital pins can drive components

The simulation runs reactively via Zustand store whenever nodes or edges change, updating all node states.

### Component Architecture

**Catalog System:**
- `NODE_CATALOG` (`src/circuit/catalog/index.ts`) is single source of truth for all components
- Each catalog entry defines:
  - Visual component and label
  - Electrical definitions (`internalEdges()`, `deriveState()`)
  - Node type registration
  - Equipment item metadata
- Auto-generates `NODE_TYPES` for ReactFlow and `EQUIPMENT_ITEMS` for UI

**Node System:**
- `BlueprintNode` provides base visual structure for all components
- Node implementations (`battery-node.tsx`, `led-node.tsx`, `button-node.tsx`, `arduino-uno-node.tsx`) define visual representation
- Handle positions and IDs defined in `src/components/nodes/config.ts` (critical for circuit simulation)
- Data types: `BatteryData`, `LedData`, `ButtonData`, `ArduinoUnoData` (typed in catalog)

**Electrical Definitions:**
- `internalEdges(nodeId, data)`: Returns array of internal current paths for component
- `deriveState(context)`: Computes node state from `TraversalContext` (graph, completed paths, etc.)
- Defined per-component in `src/circuit/definitions/`

**Edge System:**
- `DataEdge` supports multiple path algorithms (bezier, smoothstep, step, straight)
- Provides inline toolbar on selection with color picker and delete
- Can display data from source node via `data.key` property

**Toolbars:**
- `NodeToolbarContent`: Orchestrates component-specific toolbars + generic duplicate/delete
- Component-specific toolbars:
  - `LedToolbar`: Color picker
  - `ArduinoUnoToolbar`: D13 pin mode (INPUT/OUTPUT) and value (HIGH/LOW) controls
- Toolbar composition based on node type

### State Management

Circuit state managed through Zustand store (`src/stores/circuit-store.ts`):
- Stores nodes and edges with automatic persistence
- Actions: `addNode`, `updateNode`, `deleteNode`, `addEdge`, `deleteEdge`, `toggleButton`
- Node data types: `BatteryData`, `LedData`, `ButtonData`, `ArduinoUnoData` (typed in catalog)
- Simulation triggered automatically on any state change
- State derivation updates node data via `deriveState()` functions

### Styling

- TailwindCSS v4 with `@tailwindcss/vite` plugin
- Path alias: `@/` maps to `src/`
- UI components use Radix UI primitives (Sheet, Dialog) with custom styling
- Node selection styling via ReactFlow's `.selected` class with Tailwind's `&` selector

## Key Patterns

**Adding New Circuit Components:**

1. Create visual component in `src/components/nodes/[name]-node.tsx` using `BlueprintNode`
2. Define handle IDs and positions in `src/components/nodes/config.ts`
3. Create electrical definition in `src/circuit/definitions/[name].ts` with:
   - Data interface (e.g., `XyzData`)
   - `internalEdges()` function defining internal current paths
   - `deriveState()` function computing state from circuit traversal
4. Register in `NODE_CATALOG` (`src/circuit/catalog/index.ts`)
5. (Optional) Create component-specific toolbar in `src/components/toolbars/[name]-toolbar.tsx`
6. (Optional) Add toolbar to `NodeToolbarContent` conditional rendering

**Circuit Simulation Logic:**

The graph key format `${nodeId}:${handleId}` is critical - all circuit tracing depends on this structure. When adding components, ensure:
- Handle IDs are consistent and meaningful (e.g., "anode"/"cathode", "vin"/"gnd")
- `internalEdges()` returns proper edge pairs respecting electrical properties
- `deriveState()` uses `TraversalContext` to compute powered state
- Bidirectional connections use shared handle IDs (e.g., Arduino digital pins)

**Available Components:**

1. **Battery**: 5V power source with positive/negative terminals
2. **LED**: Unidirectional light emitter (anode→cathode) with customizable color
3. **Button**: Toggle switch with bidirectional flow when closed
4. **Arduino Uno**: ATmega328P microcontroller with 20+ pins (power, digital I/O, analog inputs)

**Arduino Uno Details:**

The Arduino Uno node simulates a complete microcontroller with realistic power distribution and pin control:

- **Power Pins**: VIN, 5V, 3.3V, GND (×2), AREF, RESET
- **Digital I/O**: D0-D13 (configurable INPUT/OUTPUT, bidirectional)
- **Analog Inputs**: A0-A5 (bidirectional)
- **Power State**: Arduino powers when (VIN or 5V) AND (at least one GND) connected
- **Internal Power Distribution**: VIN → 5V/3.3V → GND (simulates voltage regulator)
- **Pin-Driven Components**: When D13 is OUTPUT/HIGH, it can power LEDs directly (requires cathode to battery GND)
- **Visual Indicators**:
  - Power LED (green): Glows when Arduino receives power
  - D13 LED (amber): Glows when D13 is OUTPUT/HIGH
- **Toolbar Controls**: D13 pin mode selector and HIGH/LOW toggle

## TypeScript Configuration

- Uses path alias `@/*` → `./src/*`
- Separate configs for app (`tsconfig.app.json`) and node scripts (`tsconfig.node.json`)
- React Compiler enabled via `babel-plugin-react-compiler`

## Git Conventions

- Single-line conventional commit messages
- No Claude attribution in commit messages
