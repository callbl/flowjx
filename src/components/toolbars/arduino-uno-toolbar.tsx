import type { ArduinoUnoData } from "@/circuit/catalog";
import { useCircuitActions } from "@/hooks/use-circuit";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ArduinoUnoToolbarProps {
  nodeId: string;
  data: ArduinoUnoData;
}

const ArduinoUnoToolbar = ({ nodeId, data }: ArduinoUnoToolbarProps) => {
  const { updateNodeData } = useCircuitActions();

  const pinState = data.digitalPins?.d13 ?? {
    mode: "INPUT" as const,
    value: 0 as const,
  };

  const handleModeChange = (newMode: "INPUT" | "OUTPUT") => {
    const nextPins = {
      ...(data.digitalPins ?? {}),
      d13: { ...pinState, mode: newMode },
    };
    updateNodeData<ArduinoUnoData>(nodeId, { digitalPins: nextPins });
  };

  const handleValueToggle = () => {
    if (pinState.mode !== "OUTPUT") return;
    const nextValue = pinState.value === 1 ? 0 : 1;
    const nextPins = {
      ...(data.digitalPins ?? {}),
      d13: { ...pinState, value: nextValue as 0 | 1 },
    };
    updateNodeData<ArduinoUnoData>(nodeId, { digitalPins: nextPins });
  };

  return (
    <>
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          D13:
        </span>
        <Select
          value={pinState.mode}
          onValueChange={(value) => handleModeChange(value as "INPUT" | "OUTPUT")}
        >
          <SelectTrigger className="h-7 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INPUT">INPUT</SelectItem>
            <SelectItem value="OUTPUT">OUTPUT</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={pinState.value === 1 ? "default" : "outline"}
          size="sm"
          className="h-7 w-16 px-2 text-xs"
          disabled={pinState.mode !== "OUTPUT"}
          onClick={handleValueToggle}
        >
          {pinState.value === 1 ? "HIGH" : "LOW"}
        </Button>
      </div>
      <div className="h-4 w-px bg-border mx-0.5" />
    </>
  );
};

ArduinoUnoToolbar.displayName = "ArduinoUnoToolbar";
export default ArduinoUnoToolbar;
