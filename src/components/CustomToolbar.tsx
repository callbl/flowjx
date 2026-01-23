import {
  DefaultToolbar,
  TldrawUiMenuItem,
  useTools,
  useIsToolSelected,
} from "tldraw";

export function CustomToolbar() {
  const tools = useTools();
  const isSelectToolActive = useIsToolSelected(tools["select"]);
  const isHandToolActive = useIsToolSelected(tools["hand"]);
  const isArduinoToolActive = useIsToolSelected(tools["arduino"]);
  const isArrowToolActive = useIsToolSelected(tools["arrow"]);
  const isLedToolActive = useIsToolSelected(tools["led"]);
  const isBatteryToolActive = useIsToolSelected(tools["battery"]);
  const isServoToolActive = useIsToolSelected(tools["servo-motor"]);

  return (
    <DefaultToolbar>
      <TldrawUiMenuItem {...tools["select"]} isSelected={isSelectToolActive} />
      <TldrawUiMenuItem {...tools["hand"]} isSelected={isHandToolActive} />
      <TldrawUiMenuItem
        {...tools["arduino"]}
        isSelected={isArduinoToolActive}
      />
      <TldrawUiMenuItem {...tools["wire"]} />
      <TldrawUiMenuItem {...tools["arrow"]} isSelected={isArrowToolActive} />
      <TldrawUiMenuItem {...tools["led"]} isSelected={isLedToolActive} />
      <TldrawUiMenuItem
        {...tools["battery"]}
        isSelected={isBatteryToolActive}
      />
      <TldrawUiMenuItem
        {...tools["servo-motor"]}
        isSelected={isServoToolActive}
      />
    </DefaultToolbar>
  );
}
