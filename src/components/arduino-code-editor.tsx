import { useState } from "react";
import { PlayIcon, StopCircleIcon, CodeIcon, TerminalIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCircuitActions, useNodeData } from "@/hooks/use-circuit";
import type { ArduinoUnoData } from "./circuit-flow";

const DEFAULT_CODE = `void setup() {
  // Initialize digital pin 13 as an output
  pinMode(13, OUTPUT);
  Serial.println("Arduino started!");
}

void loop() {
  // Blink LED on pin 13
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`;

interface ArduinoCodeEditorProps {
  nodeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArduinoCodeEditor({
  nodeId,
  open,
  onOpenChange,
}: ArduinoCodeEditorProps) {
  const { updateNodeData } = useCircuitActions();
  const nodeData = useNodeData<ArduinoUnoData>(nodeId);

  const [localCode, setLocalCode] = useState(
    nodeData?.code || DEFAULT_CODE
  );
  const [activeTab, setActiveTab] = useState<"code" | "serial">("code");

  const isRunning = nodeData?.isRunning || false;
  const serialOutput = nodeData?.serialOutput || [];

  const handleSave = () => {
    updateNodeData<ArduinoUnoData>(nodeId, { code: localCode });
  };

  const handleRun = () => {
    handleSave();
    updateNodeData<ArduinoUnoData>(nodeId, { isRunning: true });
  };

  const handleStop = () => {
    updateNodeData<ArduinoUnoData>(nodeId, { isRunning: false });
  };

  const handleClearSerial = () => {
    updateNodeData<ArduinoUnoData>(nodeId, { serialOutput: [] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Arduino Code Editor</DialogTitle>
          <DialogDescription>
            Write Arduino code to control your circuit
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === "code"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CodeIcon className="size-4" />
            Code
          </button>
          <button
            onClick={() => setActiveTab("serial")}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === "serial"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TerminalIcon className="size-4" />
            Serial Monitor
            {serialOutput.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {serialOutput.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "code" ? (
            <textarea
              value={localCode}
              onChange={(e) => setLocalCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-muted/50 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
              placeholder="Write your Arduino code here..."
            />
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 p-4 font-mono text-sm bg-black text-green-400 rounded-md overflow-auto">
                {serialOutput.length === 0 ? (
                  <div className="text-muted-foreground">
                    No serial output yet. Use Serial.println() in your code.
                  </div>
                ) : (
                  serialOutput.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearSerial}
                className="mt-2"
              >
                Clear Serial Monitor
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-between pt-4 border-t">
          <div className="flex gap-2">
            {isRunning ? (
              <Button onClick={handleStop} variant="destructive" size="sm">
                <StopCircleIcon className="size-4" />
                Stop
              </Button>
            ) : (
              <Button onClick={handleRun} variant="default" size="sm">
                <PlayIcon className="size-4" />
                Run
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="outline" size="sm">
              Save
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="secondary" size="sm">
              Close
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        {isRunning && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="size-2 bg-green-500 rounded-full animate-pulse" />
            Running...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
