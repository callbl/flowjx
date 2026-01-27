// Arduino Editor with Monaco Editor, Serial Monitor, and Controls

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme-provider";
import { useArduinoStore } from "@/arduino/store";
import { useArduinoIntegration } from "@/hooks/use-arduino-integration";
import { getExamplesByCategory } from "@/arduino/examples";
import type { BoardType } from "@/arduino/types";
import {
  Play,
  Square,
  RotateCcw,
  Download,
  CheckCircle2,
  XCircle,
  Trash2,
  ChevronDown,
  X,
} from "lucide-react";
import * as Select from "@radix-ui/react-select";

interface ArduinoEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArduinoEditor({ isOpen, onClose }: ArduinoEditorProps) {
  const { theme } = useTheme();
  const serialEndRef = useRef<HTMLDivElement>(null);

  // Arduino store state
  const code = useArduinoStore((state) => state.code);
  const boardType = useArduinoStore((state) => state.boardType);
  const isRunning = useArduinoStore((state) => state.isRunning);
  const serialOutput = useArduinoStore((state) => state.serialOutput);
  const compileResult = useArduinoStore((state) => state.compileResult);

  // Arduino store actions
  const { setCode, setBoardType, compile, start, stop, reset, clearSerialOutput } =
    useArduinoStore((state) => ({
      setCode: state.setCode,
      setBoardType: state.setBoardType,
      compile: state.compile,
      start: state.start,
      stop: state.stop,
      reset: state.reset,
      clearSerialOutput: state.clearSerialOutput,
    }));

  // Enable Arduino-Circuit integration
  useArduinoIntegration();

  // Auto-scroll serial monitor
  useEffect(() => {
    serialEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [serialOutput]);

  if (!isOpen) return null;

  const handleRunStop = async () => {
    if (isRunning) {
      stop();
    } else {
      try {
        await start();
      } catch (error) {
        console.error("Failed to start Arduino:", error);
      }
    }
  };

  const handleCompile = () => {
    compile();
  };

  const handleReset = () => {
    reset();
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sketch.ino";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBoardChange = (value: string) => {
    setBoardType(value as BoardType);
  };

  const handleExampleSelect = (exampleId: string) => {
    const examples = getExamplesByCategory();
    const allExamples = Object.values(examples).flat();
    const example = allExamples.find((ex) => ex.id === exampleId);
    if (example) {
      setCode(example.code);
    }
  };

  const examplesByCategory = getExamplesByCategory();

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[600px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            Arduino IDE
          </div>

          {/* Board Selector */}
          <Select.Root value={boardType} onValueChange={handleBoardChange}>
            <Select.Trigger className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Select.Value />
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                <Select.Viewport>
                  <Select.Item
                    value="arduino-uno"
                    className="px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer outline-none"
                  >
                    <Select.ItemText>Arduino Uno</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="esp32"
                    className="px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer outline-none"
                  >
                    <Select.ItemText>ESP32 DevKit</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* Examples Selector */}
          <Select.Root onValueChange={handleExampleSelect}>
            <Select.Trigger className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <span>Examples</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 max-h-96 overflow-y-auto">
                <Select.Viewport>
                  {Object.entries(examplesByCategory).map(([category, examples]) => (
                    <Select.Group key={category}>
                      <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        {category}
                      </Select.Label>
                      {examples.map((example) => (
                        <Select.Item
                          key={example.id}
                          value={example.id}
                          className="px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer outline-none"
                        >
                          <Select.ItemText>{example.name}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={handleRunStop}
          className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isRunning
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run
            </>
          )}
        </button>

        <button
          onClick={handleCompile}
          disabled={isRunning}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Compile
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        {/* Compile Status */}
        {compileResult && (
          <div className="ml-auto flex items-center gap-2 text-sm">
            {compileResult.success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400">Compiled</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-600 dark:text-red-400">Error</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language="cpp"
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 2,
            insertSpaces: true,
            bracketPairColorization: {
              enabled: true,
            },
            folding: true,
          }}
        />
      </div>

      {/* Compile Error */}
      {compileResult && !compileResult.success && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
            <div className="text-sm text-red-700 dark:text-red-300">
              <div className="font-semibold">Compilation Error:</div>
              <div className="font-mono text-xs mt-1">{compileResult.error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Serial Monitor */}
      <div className="h-48 border-t border-gray-200 dark:border-gray-800 flex flex-col bg-black">
        {/* Serial Monitor Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="text-sm font-semibold text-gray-300">Serial Monitor</div>
          <button
            onClick={clearSerialOutput}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        </div>

        {/* Serial Output */}
        <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs text-green-400">
          {serialOutput.length === 0 ? (
            <div className="text-gray-500">Waiting for output...</div>
          ) : (
            serialOutput.map((line, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {line}
              </div>
            ))
          )}
          <div ref={serialEndRef} />
        </div>
      </div>
    </div>
  );
}
