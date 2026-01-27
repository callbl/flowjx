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

FlowJX is a browser-based Arduino/ESP32 circuit simulator that provides a complete visual programming environment with real-time circuit analysis and code execution.

---

## Arduino System

### Arduino Compiler/Transpiler (`src/arduino/interpreter.ts`)

Multi-pass transpilation pipeline that converts Arduino C/C++ to JavaScript:

**Pipeline Stages:**
1. **Comment Removal**: Strip `//` and `/* */` comments
2. **Preprocessor**: `#define` → `const`, ignore `#include`
3. **Type Conversion**: `int/byte/boolean` → `let/const`
4. **Function Conversion**: `void func()` → `function func()`
5. **Control Structures**: `for (int i` → `for (let i`
6. **Arduino Syntax**: `delay()` → `await delay()`, bit operations
7. **Program Parsing**: Extract `setup()`, `loop()`, globals with brace-matching
8. **JavaScript Generation**: Wrap in executable structure

**Key Conversions:**
```cpp
// Arduino C/C++           // JavaScript
int x = 5;             →   let x = 5;
delay(1000);           →   await delay(1000);
digitalWrite(13, HIGH); →  digitalWrite(13, HIGH);
#define LED_PIN 13     →   const LED_PIN = 13;
```

**Brace Matching:**
- Uses proper brace-counting algorithm
- Handles nested braces in control structures
- Ignores braces inside string literals
- Prevents false matches from `Serial.println("{")`

### Arduino Runtime Engine (`src/arduino/runtime.ts`)

Complete Arduino API implementation running in the browser:

**Pin Control:**
- `pinMode(pin, mode)` - INPUT, OUTPUT, INPUT_PULLUP
- `digitalWrite(pin, value)` - HIGH/LOW
- `digitalRead(pin)` - Read digital state
- `analogWrite(pin, value)` - PWM 0-255
- `analogRead(pin)` - Read analog 0-1023 (Uno) or 0-4095 (ESP32)

**Timing:**
- `delay(ms)` - Async pause (returns Promise)
- `delayMicroseconds(us)` - Min 1ms in browser
- `millis()` - Milliseconds since start
- `micros()` - Microseconds since start

**Math:**
- `map(val, inMin, inMax, outMin, outMax)` - Range mapping
- `constrain(val, min, max)` - Clamp value
- `random(min, max)` - Random integer
- Standard: `min, max, abs, pow, sqrt`

**Serial Communication:**
- `Serial.begin(baudRate)` - Initialize
- `Serial.print(val)` - Print without newline
- `Serial.println(val)` - Print with newline
- `Serial.read()` - Read byte from buffer
- `Serial.available()` - Check buffer status

**Execution Model:**
- `setup()` runs once at start
- `loop()` repeats with min 10ms delay between iterations
- Pin state tracking with change callbacks
- AsyncFunction for code execution

### Board Configurations (`src/arduino/types.ts`)

**Arduino Uno:**
- 10-bit ADC (0-1023)
- 8-bit PWM (0-255)
- 16 MHz clock
- 14 digital pins (D0-D13)
- 6 analog pins (A0-A5)
- PWM on D3, D5, D6, D9, D10, D11
- LED_BUILTIN = 13

**ESP32 DevKit:**
- 12-bit ADC (0-4095)
- 8-bit PWM (0-255, supports up to 16-bit)
- 240 MHz dual-core
- 26 GPIO pins
- 8 analog pins (GPIO32-39)
- Most pins support PWM
- LED_BUILTIN = 2
- WiFi + Bluetooth (simulated)

### Arduino-Circuit Integration (`src/hooks/use-arduino-integration.ts`)

Bidirectional data flow between Arduino code and circuit components:

**Output Flow (Arduino → Components):**
- `digitalWrite(pin, HIGH)` → LED turns on
- `analogWrite(pin, 128)` → LED at 50% brightness
- PWM values control motor speed, servo angle
- Pin states update component visuals in real-time

**Input Flow (Components → Arduino):**
- Button pressed → `digitalRead(pin)` returns LOW
- Sensor slider → `analogRead(pin)` returns value
- Component states feed into runtime pin states
- 50ms polling for smooth updates

**Key Features:**
- Finds MCU node in circuit automatically
- Traces wire connections to/from pins
- Maps pin IDs to component handles
- Supports PWM brightness control (0-255 → 0-1)

### Code Examples Library (`src/arduino/examples.ts`)

**34 Pre-built Examples across 11 Categories:**

1. **Basics** (3): Blink, Fade, Button
2. **RGB LED** (2): Colors, Rainbow
3. **Motors** (3): DC control, Servo sweep, Button servo
4. **Sound** (2): Tone, Melody
5. **Sensors** (6): Light, Temp, Ultrasonic, PIR, Potentiometer, Dashboard
6. **Input** (3): Multiple buttons, Counter, Debounce
7. **Switching** (2): Relay, Timed relay
8. **Display** (4): 7-segment, LCD Hello World, LCD with sensor
9. **Electronics** (4): Transistor, Resistor, Capacitor, Diode
10. **ICs** (3): 555 timer, Logic gates, Counter
11. **Projects** (2): Traffic light, Reaction game

Each example includes:
- Complete working Arduino code
- Required components list
- Description and category
- Unique ID for selection

### Arduino Editor UI (`src/components/arduino-editor.tsx`)

**Monaco Editor Features:**
- Arduino C/C++ syntax highlighting
- Custom keywords: pinMode, digitalWrite, Serial, etc.
- Auto-completion for Arduino functions
- Bracket pair colorization
- Theme support (light/dark sync)

**Toolbar Row 1:**
- Board selector (Arduino Uno / ESP32)
- Examples dropdown (34 examples, categorized)
- Close button

**Toolbar Row 2:**
- Run/Stop toggle button
- Compile button
- Reset button
- Download button (.ino file)
- Compile status indicator (success/error)

**Serial Monitor:**
- Real-time output display
- Auto-scroll to bottom
- Clear button
- Max 500 messages retained
- Error messages in red

**Panel:**
- 600px fixed-width right panel
- Resizable (future enhancement)
- z-index 50, dropdowns z-index 60

---

## Circuit Simulation Engine

### Core Algorithm (`src/lib/circuit-simulation.ts`)

Graph-based electrical simulation:

**1. Connected Components Detection:**
- Groups nodes into isolated circuits using DFS
- Each component simulated independently

**2. Graph Building:**
- External edges: User-drawn wires
- Internal edges: Component-defined connections
- Adjacency list with `nodeId:handleId` keys

**3. BFS Circuit Tracing:**
- Start from battery positive terminals
- Trace all paths to battery negative
- Mark nodes in complete circuits

**4. State Derivation:**
- Each component's `deriveState()` calculates powered state
- LEDs check if in complete path
- Buttons determine if closed

**Graph Key Format:**
```
"nodeId:handleId" → ["targetNodeId:targetHandleId", ...]
Example: "node-1:plus" → ["node-2:anode"]
```

### Component Catalog System (`src/circuit/catalog/`)

**Catalog-Based Architecture:**
- Single source of truth: `catalog/index.ts`
- Separation of concerns: UI, config, electrical behavior
- Type-safe with generics

**NodeCatalogEntry Structure:**
```typescript
{
  type: string;                    // "led", "button", etc.
  label: string;                   // Display name
  icon: LucideIcon;                // UI icon
  uiComponent: React.Component;    // Visual node
  config: NodeConfig;              // Handle definitions
  defaults: (label) => Data;       // Initial data factory
  electrical: ElectricalDefinition;// Simulation behavior
}
```

**Electrical Definition:**
```typescript
{
  internalEdges: (nodeId, data) => InternalEdge[];
  deriveState: (context) => Partial<Data>;
}
```

### Component Library (13 Components)

**Power:**
- Battery - Adjustable voltage (1-12V)

**Microcontrollers:**
- Arduino Uno - 26 pins (14 digital, 6 analog, power)
- ESP32 DevKit - 31 pins (26 GPIO, 8 analog, power)

**Output:**
- LED - Simple on/off with brightness
- RGB LED - 3-channel color (R/G/B 0-255)
- Buzzer - Frequency-based sound
- DC Motor - Speed (0-100%), direction (CW/CCW)
- Servo Motor - Angle (0-180°)

**Display:**
- LCD 16x2 - 2 lines, 16 chars, backlight
- 7-Segment - Digits 0-9, individual segments

**Input:**
- Button - Momentary toggle switch

**Visual Indicators on Arduino:**
- Power LED (green) - Glows when powered or running
- Pin 13 LED (orange) - Reflects actual pin state
- TX LED (yellow) - Blinks during serial transmit
- RX LED (yellow) - Blinks during serial receive

---

## Component Architecture

### Node System

**BlueprintNode Base:**
- Consistent header with icon and title
- Handle rendering with labels
- Selection highlighting
- Scale and rotation transforms (future)

**Handle Configuration:**
```typescript
{
  id: string;                    // "anode", "cathode", "d13", etc.
  type: "source" | "target";     // Connection direction
  position: Position;            // Left, Right, Top, Bottom
  label: string;                 // Display text
  dataType: string;              // "execution", "object", "value", etc.
  offsetPercentage: number;      // Position along edge (0-100)
  description?: string;          // Tooltip
}
```

**Bidirectional Handles:**
- Most pins are both source AND target
- Allows connections from either direction
- Uses same ID for both types
- Example: LED has `anode` source and target

**Handle Colors by Type:**
- execution: white
- object: blue-500
- value: amber-500
- boolean: emerald-500
- vector: violet-500

### Edge System

**DataEdge** (`src/components/data-edge.tsx`):
- Path algorithms: bezier, smoothstep, step, straight
- Inline toolbar on selection
- Color picker for edge styling
- Delete button
- Optional data display from source node

### State Management

**Circuit Store** (`src/stores/circuit-store.ts`):
- Zustand with persist (localStorage) and devtools middleware
- Node and edge collections
- Simulation state (poweredLeds set)
- Actions: addNode, deleteNode, duplicateNode, updateNodeData
- ReactFlow integration hooks

**Arduino Store** (`src/arduino/store.ts`):
- Code state (current code, active node, board type)
- Runtime state (isRunning, serialOutput, pinStates, compileResult)
- Runtime and interpreter instances
- Actions: setCode, compile, start, stop, reset

**Hook Integration** (`src/hooks/use-circuit.ts`):
- Granular selectors: useNodes, useNode(id), useNodeData(id)
- Type-safe node data access
- Reactive updates via shallow equality checks

---

## Adding New Components

### Step-by-Step Process

**1. Create Electrical Definition** (`src/circuit/definitions/[name].ts`):
```typescript
export interface XyzData {
  label: string;
  isPowered: boolean;
  // ... component-specific fields
}

export const xyzElectrical: ElectricalDefinition<XyzData> = {
  internalEdges: (nodeId, data) => {
    // Define how current flows internally
    return [{ from: {...}, to: {...} }];
  },
  deriveState: (context) => {
    // Calculate state from circuit context
    const isPowered = context.nodesInCompletePaths.has(context.nodeId);
    return { isPowered };
  },
};
```

**2. Create Visual Node** (`src/components/nodes/[name]-node.tsx`):
```typescript
export function XyzNode(props: NodeProps) {
  const data = props.data as unknown as XyzData;

  return (
    <BlueprintNode {...props} config={xyzNodeConfig}>
      {/* Component visual representation */}
    </BlueprintNode>
  );
}
```

**3. Add Node Configuration** (`src/components/nodes/config.ts`):
```typescript
export const xyzNodeConfig: NodeConfig = {
  type: "xyz",
  title: "Component Name",
  subtitle: "Category",
  icon: IconComponent,
  handles: [
    // Define all connection points
    { id: "pin1", type: "source", position: Position.Left, ... },
    { id: "pin1", type: "target", position: Position.Left, ... },
  ],
  width: 200,
  height: 150,
};
```

**4. Register in Catalog** (`src/circuit/catalog/index.ts`):
```typescript
import { XyzNode } from "@/components/nodes/xyz-node";
import { xyzElectrical, type XyzData } from "@/circuit/definitions/xyz";

export const NODE_CATALOG = {
  // ... existing entries
  xyz: {
    type: "xyz",
    label: "Component Name",
    icon: IconComponent,
    uiComponent: XyzNode,
    config: getNodeConfig("xyz")!,
    defaults: (label: string): XyzData => ({
      label,
      isPowered: false,
      // ... defaults
    }),
    electrical: xyzElectrical,
  } satisfies NodeCatalogEntry<XyzData>,
};

// Add to type exports
export type { XyzData };
```

**5. Handle Arduino Integration** (if applicable):

In `use-arduino-integration.ts`, add case to `updateComponentFromPin`:
```typescript
case "xyz":
  currentUpdateNodeData(id, {
    // Update component from Arduino pin state
  });
  break;
```

---

## Key Patterns

### Circuit Simulation Logic

The graph key format `${nodeId}:${handleId}` is critical:
- All circuit tracing depends on this structure
- Handle IDs must be consistent (e.g., "anode"/"cathode", "in"/"out")
- Component behavior respects electrical properties
- Internal edges define component-internal current flow

### Zustand Selectors

**❌ Bad - Creates new object every render:**
```typescript
const { foo, bar } = useStore((state) => ({ foo: state.foo, bar: state.bar }));
```

**✅ Good - Stable references:**
```typescript
const foo = useStore((state) => state.foo);
const bar = useStore((state) => state.bar);
```

### React Effects with Store

**❌ Bad - Causes infinite loops:**
```typescript
useEffect(() => {
  updateNodeData(id, newData);
}, [nodes, updateNodeData]); // nodes changes → effect runs → nodes change → repeat
```

**✅ Good - Get fresh state inside effect:**
```typescript
useEffect(() => {
  const currentNodes = useStore.getState().nodes;
  const currentUpdate = useStore.getState().updateNodeData;
  // Use currentNodes and currentUpdate
}, [runtime, isRunning]); // Only depend on external triggers
```

### Arduino Code Execution

**AsyncFunction returns Promise:**
```typescript
const executor = new AsyncFunction(...keys, code);
const context = await executor(...values);  // MUST await!
```

---

## TypeScript Configuration

- Path alias `@/*` → `./src/*`
- Separate configs: `tsconfig.app.json`, `tsconfig.node.json`
- React Compiler enabled via `babel-plugin-react-compiler`
- Full type safety with generics throughout

---

## Styling

- TailwindCSS v4 with `@tailwindcss/vite` plugin
- Custom utility classes
- Dark mode support via class strategy
- Component styling via Tailwind utilities
- Glow effects: `shadow-[0_0_8px_#color]`

---

## Accessibility

- Radix UI primitives (Sheet, Dialog, Select)
- aria-labels on interactive elements
- Portal positioning to avoid aria-hidden conflicts
- Keyboard navigation support
- Focus management in modals

---

## Git Conventions

- Conventional commit messages
- No Claude attribution in commit messages (handled automatically)
- Feature branches: `feat/feature-name`
- Bug fixes: `fix/issue-description`

---

## Debugging Arduino Issues

**Enable Debug Logging:**
- Check browser console for `[Interpreter]` messages
- Check for `[Arduino]` runtime messages
- Inspect `[Runtime]` execution logs

**Common Issues:**
1. **"setup() not found"** - Check brace matching in parser
2. **"Maximum update depth"** - Check useEffect dependencies
3. **Pin not working** - Verify handle IDs match in config and integration
4. **Component not updating** - Check deriveState logic in electrical definition

---

## Performance Considerations

- Circuit simulation runs on every node/edge change
- Use shallow equality in selectors to prevent re-renders
- Arduino loop has min 10ms delay between iterations
- Serial output buffer limited to 500 messages
- Pin state polling at 50ms intervals

---

## Future Enhancements

**Planned Features:**
- Transform system (scale, rotation) for nodes
- Component transform toolbar
- More sensors (5 planned: Light, Temp, Ultrasonic, PIR, Potentiometer)
- Basic electronics (Resistor, Capacitor, Diode, Transistor)
- ICs and logic gates (555 Timer, AND, OR, NOT, Relay)
- Resizable Arduino Editor panel
- LCD library functions (lcd.print, lcd.clear, etc.)
- Better 7-segment control (individual segments)
- ESP32 WiFi simulation
- Component categorization in equipment panel

---

## Testing

```bash
npm run dev        # Manual testing in browser
npm run build      # Check for TypeScript errors
npm run lint       # Check for linting issues
```

**Manual Test Checklist:**
1. Add Arduino Uno to canvas
2. Add LED and connect to pin 13 and GND
3. Open Arduino IDE (top center button)
4. Click Run - LED should blink
5. Check Serial Monitor for output
6. Try different examples from dropdown
7. Switch board to ESP32
8. Verify power LED, pin 13 LED, TX/RX indicators
9. Test circuit simulation with battery + LED
10. Check component state updates in real-time
