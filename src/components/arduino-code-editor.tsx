import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { ArduinoVMState } from '@/arduino/arduino-vm';
import { DEFAULT_SKETCHES } from '@/arduino/compiler';
import { useArduinoVMStore } from '@/stores/arduino-vm-store';
import { useCircuitActions } from '@/hooks/use-circuit';
import type { ArduinoUnoData } from '@/circuit/catalog';
import { Button } from './ui/button';
import { Play, Square, RotateCcw, Download } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ArduinoCodeEditorProps {
  nodeId: string;
  initialCode?: string;
}

export function ArduinoCodeEditor({ nodeId, initialCode }: ArduinoCodeEditorProps) {
  const [code, setCode] = useState(initialCode || DEFAULT_SKETCHES.blink);
  const { updateNodeData } = useCircuitActions();
  const { getVM } = useArduinoVMStore();
  
  // Get VM instance with pin update callback
  const vm = getVM(nodeId, (handleId, mode, value) => {
    // Update circuit when VM changes pin states
    updateNodeData<ArduinoUnoData>(nodeId, {
      digitalPins: {
        [handleId]: { mode, value },
      },
    });
  });
  
  const [vmState, setVmState] = useState<ArduinoVMState>(vm.getState());

  // Subscribe to VM state changes
  useEffect(() => {
    const interval = setInterval(() => {
      setVmState(vm.getState());
    }, 100);
    
    return () => clearInterval(interval);
  }, [vm]);

  const handleCompileAndRun = async () => {
    const success = await vm.loadCode(code);
    if (success) {
      vm.start();
      
      // Update node data to indicate code is running
      updateNodeData<ArduinoUnoData>(nodeId, {
        hasCode: true,
        codeContent: code,
        isRunningCode: true,
      });
    }
  };

  const handleStop = () => {
    vm.stop();
    updateNodeData<ArduinoUnoData>(nodeId, {
      isRunningCode: false,
    });
  };

  const handleReset = () => {
    vm.reset();
    updateNodeData<ArduinoUnoData>(nodeId, {
      isRunningCode: false,
      digitalPins: {},
    });
  };

  const handleLoadExample = (example: keyof typeof DEFAULT_SKETCHES) => {
    setCode(DEFAULT_SKETCHES[example]);
  };

  const handleSaveCode = () => {
    updateNodeData<ArduinoUnoData>(nodeId, {
      codeContent: code,
      hasCode: true,
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
        <Select onValueChange={(value) => handleLoadExample(value as keyof typeof DEFAULT_SKETCHES)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Load example" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blink">Blink</SelectItem>
            <SelectItem value="multiLED">Multi LED</SelectItem>
            <SelectItem value="pwmFade">PWM Fade</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSaveCode} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1" />
          Save
        </Button>

        <div className="flex-1" />

        <Button
          onClick={handleCompileAndRun}
          disabled={vmState.isCompiling || vmState.isRunning}
          size="sm"
          variant="default"
        >
          <Play className="h-4 w-4 mr-1" />
          {vmState.isCompiling ? 'Compiling...' : 'Run'}
        </Button>

        <Button
          onClick={handleStop}
          disabled={!vmState.isRunning}
          size="sm"
          variant="secondary"
        >
          <Square className="h-4 w-4 mr-1" />
          Stop
        </Button>

        <Button onClick={handleReset} size="sm" variant="outline">
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Editor and Output */}
      <Tabs defaultValue="code" className="flex-1 flex flex-col">
        <TabsList className="mx-3 mt-2">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="serial">Serial Monitor</TabsTrigger>
          <TabsTrigger value="pins">Pin States</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 mt-0">
          <Editor
            height="100%"
            defaultLanguage="cpp"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </TabsContent>

        <TabsContent value="serial" className="flex-1 mt-2 mx-3">
          <div className="h-full p-3 bg-black text-green-400 font-mono text-sm rounded overflow-auto">
            <pre className="whitespace-pre-wrap">{vmState.serialOutput || 'No output yet...'}</pre>
          </div>
        </TabsContent>

        <TabsContent value="pins" className="flex-1 mt-2 mx-3 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(vmState.pinStates).map(([handleId, state]) => (
              <div
                key={handleId}
                className="p-3 border rounded bg-muted/30 flex items-center justify-between"
              >
                <span className="font-mono text-sm font-medium">{handleId.toUpperCase()}</span>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs font-medium ${
                    state.mode === 'OUTPUT' ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {state.mode}
                  </span>
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      state.value === 1 
                        ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' 
                        : 'bg-gray-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Error Display */}
      {vmState.compilationError && (
        <div className="p-3 bg-red-500/10 border-t border-red-500/20 text-red-500 text-sm">
          <strong>Compilation Error:</strong>
          <pre className="mt-1 text-xs whitespace-pre-wrap font-mono">{vmState.compilationError}</pre>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center gap-3 p-2 border-t bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${vmState.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span>{vmState.isRunning ? 'Running' : 'Stopped'}</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <span>ATmega328P @ 16MHz</span>
      </div>
    </div>
  );
}
