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

FlowJX is a circuit simulator built on React Flow that implements real-time circuit analysis through graph traversal.

### Core Circuit Simulation

The circuit simulation engine (`src/components/circuit-flow.tsx`) implements a **bidirectional graph traversal algorithm** that:

1. Builds an adjacency list from edges where each connection point is a `nodeId:handleId` key
2. For each battery, performs BFS from positive terminal to find paths to negative terminal
3. LEDs are powered only when:
   - Both anode and cathode are connected
   - A complete circuit path exists from battery + to battery -
   - The LED appears in a valid path

Key simulation behaviors:
- **LEDs**: Current flows anode → cathode only (unidirectional)
- **Buttons**: Bidirectional flow when closed, blocks current when open
- **Batteries**: Provide voltage from + terminal, complete circuit at - terminal

The simulation runs reactively via `useEffect` whenever nodes or edges change, updating LED `isPowered` states.

### Component Architecture

**Node System:**
- `BaseNode` + composition components (`BaseNodeHeader`, `BaseNodeContent`, `BaseNodeFooter`) provide consistent structure
- Node implementations (`battery-node.tsx`, `led-node.tsx`, `button-node.tsx`) define:
  - Visual representation
  - Handle positions and IDs (critical for circuit simulation)
  - Data types (exported from `circuit-flow.tsx`)
- Each node registers with `nodeTypes` object in `circuit-flow.tsx`

**Edge System:**
- `DataEdge` supports multiple path algorithms (bezier, smoothstep, step, straight)
- Provides inline toolbar on selection with color picker and delete
- Can display data from source node via `data.key` property

**Toolbars:**
- `NodeToolbarContent`: Duplicate and delete operations for nodes
- Edge toolbar: Inline within `DataEdge` component with color selection

### State Management

Circuit state managed through ReactFlow hooks:
- `useNodesState` / `useEdgesState`: Node and edge collections
- Node data types: `BatteryData`, `LedData`, `ButtonData` (typed in `circuit-flow.tsx`)
- Button state updates trigger `toggleButton` callback, re-running simulation

### Styling

- TailwindCSS v4 with `@tailwindcss/vite` plugin
- Path alias: `@/` maps to `src/`
- UI components use Radix UI primitives (Sheet, Dialog) with custom styling
- Node selection styling via ReactFlow's `.selected` class with Tailwind's `&` selector

## Key Patterns

**Adding New Circuit Components:**

1. Create node type in `src/components/nodes/[name]-node.tsx`
2. Define data interface in `circuit-flow.tsx` (e.g., `XyzData`)
3. Register in `nodeTypes` object
4. Add to `equipmentItems` array for UI
5. Update `simulateCircuit` logic to handle component's electrical behavior
6. Define handle IDs and positions (these are the connection points used in graph traversal)

**Circuit Simulation Logic:**

The graph key format `${nodeId}:${handleId}` is critical - all circuit tracing depends on this structure. When adding components, ensure:
- Handle IDs are consistent and meaningful (e.g., "anode"/"cathode", "in"/"out")
- Component behavior in `simulateCircuit` respects electrical properties
- Internal component connections (like LED anode→cathode) are explicitly handled in traversal

## TypeScript Configuration

- Uses path alias `@/*` → `./src/*`
- Separate configs for app (`tsconfig.app.json`) and node scripts (`tsconfig.node.json`)
- React Compiler enabled via `babel-plugin-react-compiler`

## Git Conventions

- Single-line conventional commit messages
- No Claude attribution in commit messages
