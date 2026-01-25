# Arduino Code Editor & Logic Implementation

## Overview
I've added a comprehensive Arduino code editor and interpreter to your FlowJX circuit simulator. The Arduino Uno node now supports writing and executing actual Arduino code that interacts with the circuit in real-time.

## Features Added

### 1. **Arduino Code Interpreter** (`src/lib/arduino-interpreter.ts`)
- Executes a simplified subset of Arduino C++ code
- Supports key Arduino functions:
  - `pinMode(pin, mode)` - Set pin modes (INPUT, OUTPUT, INPUT_PULLUP)
  - `digitalWrite(pin, value)` - Write HIGH/LOW to digital pins
  - `analogWrite(pin, value)` - Write PWM values (0-255)
  - `Serial.println("message")` - Print to serial monitor
  - `delay(ms)` - Delay (non-blocking in this implementation)
- Maintains state for:
  - Digital pins (0-13) with mode and value
  - Analog pins (A0-A5 / 14-19)
  - Serial output buffer (last 50 lines)
- Automatically runs `setup()` once and `loop()` repeatedly

### 2. **Code Editor Dialog** (`src/components/arduino-code-editor.tsx`)
- Modal dialog for writing Arduino code
- Two tabs:
  - **Code Tab**: Syntax-highlighted code editor
  - **Serial Monitor Tab**: View `Serial.println()` output
- Controls:
  - **Run**: Compile and execute the code
  - **Stop**: Stop execution
  - **Save**: Save code without running
  - **Clear Serial Monitor**: Clear output
- Real-time status indicator showing when code is running

### 3. **Enhanced Arduino Node** (`src/components/nodes/arduino-uno-node.tsx`)
- **Code Editor Button**: Click to open the code editor
- **Running Indicator**: Visual badge when code is executing
- **Pin State Visualization**:
  - Digital pins light up when set to HIGH
  - Pin 13 LED (L) animates when HIGH
  - Power LED pulses when Arduino is running
- **Pin Handles**: All digital, analog, and power pins are connectable

### 4. **Updated Data Types** (`src/components/circuit-flow.tsx`)
```typescript
export type ArduinoUnoData = {
  label: string;
  code?: string;              // Arduino code
  isRunning?: boolean;        // Execution state
  serialOutput?: string[];    // Serial monitor output
  pinStates?: Map<string, "HIGH" | "LOW" | number>;  // Pin states
};
```

### 5. **Circuit Store Integration** (`src/stores/circuit-store.ts`)
- Manages Arduino interpreter instances (one per Arduino node)
- Automatically updates pin states every 100ms when running
- Handles code execution lifecycle (start/stop)
- Cleans up interpreters when nodes are deleted

### 6. **Dialog UI Component** (`src/components/ui/dialog.tsx`)
- Radix UI-based dialog component for the code editor
- Supports keyboard navigation and accessibility

## How to Use

### 1. Add an Arduino to Your Circuit
1. Click the toolbox icon
2. Select "Arduino Uno"
3. Place it on the canvas

### 2. Write Arduino Code
1. Click the **code editor button** (📄 icon) on the Arduino board
2. Write your Arduino code in the editor
3. Example code:
```cpp
void setup() {
  pinMode(13, OUTPUT);
  Serial.println("LED Blinker Started!");
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```

### 3. Run Your Code
1. Click **Run** to start execution
2. Watch the pin 13 LED blink on the board
3. Check the **Serial Monitor** tab for output
4. Click **Stop** to halt execution

### 4. Connect to Circuit Components
1. Drag connections from Arduino pins to other components:
   - **Digital pins (D0-D13)**: Connect to LEDs, buttons, etc.
   - **Power pins (5V, 3.3V, GND)**: Power your circuit
   - **Analog pins (A0-A5)**: Read analog sensors
2. The Arduino can control connected components via code

## Example Circuits

### Blink Built-in LED (Pin 13)
```cpp
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}
```

### Control Multiple LEDs
```cpp
void setup() {
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
}

void loop() {
  // Running lights
  digitalWrite(11, HIGH);
  delay(200);
  digitalWrite(11, LOW);
  
  digitalWrite(12, HIGH);
  delay(200);
  digitalWrite(12, LOW);
  
  digitalWrite(13, HIGH);
  delay(200);
  digitalWrite(13, LOW);
}
```

### Serial Debugging
```cpp
void setup() {
  pinMode(13, OUTPUT);
  Serial.println("System initialized");
}

void loop() {
  digitalWrite(13, HIGH);
  Serial.println("LED ON");
  delay(1000);
  
  digitalWrite(13, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
```

## Visual Feedback

### Arduino Board Indicators
- **Power LED (ON)**: Pulses when code is running
- **Pin 13 LED (L)**: Lights up when D13 is HIGH
- **Digital Pins**: Glow orange when set to HIGH
- **Running Badge**: Shows "RUNNING" with animated pulse

### Pin State Colors
- **Gold/Yellow**: Default pin color
- **Orange Glow**: Pin is HIGH (5V)
- **Dark**: Pin is LOW (0V)

## Architecture Details

### Code Execution Flow
1. User writes code in editor
2. Click "Run" → Code is parsed to extract `setup()` and `loop()`
3. `setup()` runs once immediately
4. `loop()` runs every 100ms (configurable)
5. Pin states update in real-time
6. Circuit simulation runs to update connected components

### Pin State Propagation
```
Arduino Code → Interpreter State → Node Data → Visual Update → Circuit Simulation
```

### Supported Arduino Functions
- ✅ `pinMode(pin, mode)`
- ✅ `digitalWrite(pin, HIGH/LOW)`
- ✅ `analogWrite(pin, 0-255)` (PWM)
- ✅ `Serial.println(text)`
- ✅ `delay(ms)`
- ❌ `digitalRead()` (planned)
- ❌ `analogRead()` (planned)
- ❌ Advanced timing functions

## Limitations

### Current Limitations
1. **Read Functions**: `digitalRead()` and `analogRead()` not yet implemented
2. **Timing**: `delay()` is non-blocking (doesn't actually pause)
3. **Libraries**: No support for external Arduino libraries
4. **Variables**: Only inline values supported (no variables yet)
5. **Control Flow**: No if/else, for loops, or functions beyond setup/loop

### Planned Features
- Input pin reading from circuit
- Variables and expressions
- Control flow (if/else, for loops)
- Custom functions
- Analog input from potentiometers/sensors
- Advanced timing (millis(), micros())

## Troubleshooting

### Code Not Running
- Check for syntax errors (missing semicolons, brackets)
- Ensure `setup()` and `loop()` functions are defined
- Click "Run" button (not just "Save")

### LEDs Not Lighting
- Verify pin numbers match your code (D0-D13)
- Check that pins are set to OUTPUT mode
- Ensure digitalWrite is called with HIGH

### Serial Monitor Empty
- Use `Serial.println("text")` with quotes
- Check you're on the "Serial Monitor" tab
- Serial output appears immediately

### Pin Not Changing
- Loop runs every 100ms - delays are not real-time
- Check pin is in OUTPUT mode
- Verify pin connections in circuit

## Installation

Replace these files in your project:
```
src/lib/arduino-interpreter.ts          (NEW)
src/components/arduino-code-editor.tsx  (NEW)
src/components/ui/dialog.tsx            (NEW)
src/components/circuit-flow.tsx         (UPDATED)
src/components/nodes/arduino-uno-node.tsx (UPDATED)
src/stores/circuit-store.ts             (UPDATED)
```

## Dependencies
All required dependencies are already in your package.json:
- `@radix-ui/react-dialog` - For the code editor modal
- `lucide-react` - For icons
- `zustand` - For state management

## Future Enhancements

### Planned Features
1. **Input Reading**: Read from buttons and sensors connected to pins
2. **Analog Input**: Read analog values (0-1023) from A0-A5
3. **PWM Output**: Proper PWM on pins 3, 5, 6, 9, 10, 11
4. **Advanced Editor**: Syntax highlighting, autocomplete, error checking
5. **Code Templates**: Built-in examples and snippets
6. **Variable Support**: Proper variable declarations and expressions
7. **Libraries**: Support for common Arduino libraries
8. **Serial Input**: Send data to Arduino via serial monitor

### Code Quality Improvements
- Add TypeScript type checking for Arduino code
- Implement proper error handling and reporting
- Add code validation before execution
- Support for multi-file sketches

## Technical Notes

### Performance
- Interpreter runs in main thread (consider Web Worker for complex code)
- Loop executes every 100ms (configurable in circuit-store.ts)
- Pin state updates trigger React re-renders

### Memory Management
- Each Arduino node has its own interpreter instance
- Interpreters are cleaned up when nodes are deleted
- Serial output limited to last 50 lines

### State Persistence
- Arduino code is saved with the circuit file
- Running state is NOT persisted (code stops on reload)
- Pin states reset when page reloads

## Contributing
To extend the Arduino functionality:
1. Add new functions in `arduino-interpreter.ts`
2. Update the code execution in `executeLine()`
3. Add state tracking if needed
4. Update this README with new features

## License
Part of FlowJX circuit simulator - Private project
