type ColorOption = {
  name: string;
  value: string;
  label: string;
};

// Define color options that work well in both light and dark modes
export const COLOR_OPTIONS: ColorOption[] = [
  { name: "red", value: "#ef4444", label: "Red" },
  { name: "black", value: "#334155", label: "Black" },
  { name: "green", value: "#22c55e", label: "Green" },
  { name: "yellow", value: "#eab308", label: "Yellow" },
  { name: "gray", value: "#94a3b8", label: "Gray" },
];

type ColorSelectorProps = {
  selectedColor?: string;
  onColorChange: (color: string) => void;
};

export function ColorSelector({
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <>
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
    </>
  );
}
