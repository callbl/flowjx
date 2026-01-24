import type { ColorOption } from "@/components/color-selector";
import type { PathOption } from "@/components/path-selector";
import { BezierIcon, StepIcon, StraightLineIcon } from "@/components/ui/icons";

// Define path type options with descriptive icons
export const PATH_OPTIONS: PathOption[] = [
  {
    name: "bezier",
    value: "bezier",
    label: "Curved",
    icon: BezierIcon,
  },
  {
    name: "smoothstep",
    value: "smoothstep",
    label: "Step",
    icon: StepIcon,
  },
  {
    name: "straight",
    value: "straight",
    label: "Straight",
    icon: StraightLineIcon,
  },
];

// Default edge/wire color for circuits
export const DEFAULT_EDGE_COLOR = "#94a3b8"; // slate-500

// Define color options that work well in both light and dark modes
export const COLOR_OPTIONS: ColorOption[] = [
  { name: "gray", value: DEFAULT_EDGE_COLOR, label: "Gray" },
  { name: "red", value: "#ef4444", label: "Red" },
  { name: "black", value: "#334155", label: "Black" },
  { name: "green", value: "#22c55e", label: "Green" },
  { name: "yellow", value: "#eab308", label: "Yellow" },
];
