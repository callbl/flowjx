import { COLOR_OPTIONS } from "@/lib/constants";

export type ColorOption = {
  name: string;
  value: string;
  label: string;
};

type ColorSelectorProps = {
  selectedColor?: string;
  onColorChange: (color: string) => void;
};

export function ColorSelector({
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorChange(color.value)}
          title={color.label}
          className="size-4 rounded border border-border hover:scale-110 transition-transform cursor-pointer"
          style={{
            backgroundColor: color.value,
            outline:
              selectedColor === color.value
                ? `1px solid ${color.value}`
                : "none",
            outlineOffset: "1px",
          }}
        />
      ))}
    </div>
  );
}
