import { Toolbar } from '@/ui/toolbar/Toolbar'
import { ToolsPanel } from '@/ui/panels/ToolsPanel'
import { PropertiesPanel } from '@/ui/panels/PropertiesPanel'
import { Viewport } from '@/editor/canvas/Viewport'

export function EditorLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar />
      <div className="flex-1 relative">
        <ToolsPanel />
        <Viewport />
        <PropertiesPanel />
      </div>
    </div>
  )
}
