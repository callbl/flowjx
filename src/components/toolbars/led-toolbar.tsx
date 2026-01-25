import type { LedData } from "@/circuit/catalog";
import { useCircuitActions } from "@/hooks/use-circuit";
import { ColorSelector } from "../color-selector";

interface LedToolbarProps {
  nodeId: string;
  data: LedData;
}

const LedToolbar = ({ nodeId, data }: LedToolbarProps) => {
  const { updateNodeData } = useCircuitActions();

  const handleColorChange = (color: string) => {
    updateNodeData<LedData>(nodeId, { color });
  };

  return (
    <ColorSelector
      selectedColor={data.color}
      onColorChange={handleColorChange}
    />
  );
};

LedToolbar.displayName = "LedToolbar";
export default LedToolbar;
