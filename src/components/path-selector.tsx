import type { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { type Icon } from "./ui/icons";
import { PATH_OPTIONS } from "@/lib/constants";

type PathType = "bezier" | "smoothstep" | "step" | "straight";

export type PathOption = {
  name: string;
  value: PathType;
  label: string;
  icon: LucideIcon | Icon;
};

type PathSelectorProps = {
  selectedPath?: PathType;
  onPathChange: (path: PathType) => void;
};

export function PathSelector({
  selectedPath = "bezier",
  onPathChange,
}: PathSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {PATH_OPTIONS.map((pathOption) => {
        const Icon = pathOption.icon;
        const isSelected = selectedPath === pathOption.value;

        return (
          <Button
            key={pathOption.name}
            onClick={() => onPathChange(pathOption.value)}
            title={pathOption.label}
            className="size-6 rounded cursor-pointer flex items-center justify-center"
            variant={isSelected ? "secondary" : "ghost"}
          >
            <Icon className="size-3.5" />
          </Button>
        );
      })}
    </div>
  );
}
