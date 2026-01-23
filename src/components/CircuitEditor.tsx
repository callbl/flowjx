import {
  Tldraw,
  type TLUiOverrides,
  type TLUiAssetUrlOverrides,
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  TldrawUiMenuItem,
  useTools,
  type Editor,
} from "tldraw";
import "tldraw/tldraw.css";

// Shape utilities
import { ArduinoShapeUtil } from "../lib/shapes/ArduinoShapeUtil";
import { LedShapeUtil } from "../lib/shapes/LedShapeUtil";
import { BatteryShapeUtil } from "../lib/shapes/BatteryShapeUtil";
import { ServoMotorShapeUtil } from "../lib/shapes/ServoMotorShapeUtil";

// Tools
import { ArduinoShapeTool } from "../lib/tools/ArduinoShapeTool";
import { LedShapeTool } from "../lib/tools/LedShapeTool";
import { BatteryShapeTool } from "../lib/tools/BatteryShapeTool";
import { ServoMotorShapeTool } from "../lib/tools/ServoMotorShapeTool";

// Custom toolbar
import { CustomToolbar } from "./CustomToolbar";

// Custom asset URLs for icons
const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    arduino: "/icons/arduino.svg",
    led: "/icons/led.svg",
    battery: "/icons/battery.svg",
    "servo-motor": "/icons/servo.svg",
    wire: "/icons/wire.svg",
  },
};

// Custom keyboard shortcuts dialog
function CustomKeyboardShortcutsDialog() {
  const tools = useTools();

  return (
    <DefaultKeyboardShortcutsDialog onClose={() => {}}>
      <DefaultKeyboardShortcutsDialogContent />
      <div style={{ padding: "8px 16px" }}>
        <h4 style={{ marginBottom: "8px" }}>Circuit Tools</h4>
        <TldrawUiMenuItem {...tools["arduino"]} />
        <TldrawUiMenuItem {...tools["wire"]} />
        <TldrawUiMenuItem {...tools["arrow"]} />
        <TldrawUiMenuItem {...tools["led"]} />
        <TldrawUiMenuItem {...tools["battery"]} />
        <TldrawUiMenuItem {...tools["servo-motor"]} />
      </div>
    </DefaultKeyboardShortcutsDialog>
  );
}

// UI overrides
const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    // Add custom circuit component tools
    tools["arduino"] = {
      id: "arduino",
      icon: "arduino",
      label: "Arduino",
      kbd: "a",
      onSelect: () => {
        editor.setCurrentTool("arduino");
      },
    };

    tools["led"] = {
      id: "led",
      icon: "led",
      label: "LED",
      kbd: "l",
      onSelect: () => {
        editor.setCurrentTool("led");
      },
    };

    tools["battery"] = {
      id: "battery",
      icon: "battery",
      label: "Battery",
      kbd: "b",
      onSelect: () => {
        editor.setCurrentTool("battery");
      },
    };

    tools["servo-motor"] = {
      id: "servo-motor",
      icon: "servo-motor",
      label: "Servo Motor",
      kbd: "s",
      onSelect: () => {
        editor.setCurrentTool("servo-motor");
      },
    };

    // Keep the original arrow tool
    tools["arrow"] = {
      ...tools["arrow"],
      label: "Arrow",
      kbd: "r",
    };

    // Add wire tool as a variant that uses arrow tool with no arrowheads
    tools["wire"] = {
      id: "wire",
      icon: "wire",
      label: "Wire",
      kbd: "w",
      onSelect: () => {
        editor.setCurrentTool("arrow");
        // Set wire styling (no arrowheads)
        editor.updateInstanceState({
          stylesForNextShape: {
            ...editor.getInstanceState().stylesForNextShape,
            "tldraw:arrowheadStart": "none",
            "tldraw:arrowheadEnd": "none",
          },
        });
      },
    };

    // Remove unwanted tools
    const toolsToRemove = [
      "draw",
      "eraser",
      "line",
      "geo",
      "text",
      "note",
      "highlight",
      "frame",
      "laser",
      "zoom",
    ];

    toolsToRemove.forEach((toolId) => {
      delete tools[toolId];
    });

    return tools;
  },
};

// Component overrides for custom UI
const components = {
  Toolbar: CustomToolbar,
  KeyboardShortcutsDialog: CustomKeyboardShortcutsDialog,
};

// Helper function when editor mounts
function handleEditorMount(_editor: Editor) {
  // Editor is ready - can set up additional configurations here if needed
}

export function CircuitEditor() {
  return (
    <div className="fixed inset-0">
      <Tldraw
        persistenceKey="circuit-canvas"
        shapeUtils={[
          ArduinoShapeUtil,
          LedShapeUtil,
          BatteryShapeUtil,
          ServoMotorShapeUtil,
        ]}
        tools={[
          ArduinoShapeTool,
          LedShapeTool,
          BatteryShapeTool,
          ServoMotorShapeTool,
        ]}
        overrides={uiOverrides}
        components={components}
        assetUrls={customAssetUrls}
        onMount={handleEditorMount}
      />
    </div>
  );
}
