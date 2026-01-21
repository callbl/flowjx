import { Toolbar } from '@/ui/toolbar/Toolbar'
import { ToolsPanel } from '@/ui/panels/ToolsPanel'
import { PropertiesPanel } from '@/ui/panels/PropertiesPanel'
import { ViewportPlaceholder } from '@/editor/canvas/ViewportPlaceholder'

export function EditorLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Toolbar />
      <div className="flex-1 relative">
        <ToolsPanel />
        <ViewportPlaceholder />
        <PropertiesPanel />
      </div>
    </div>
  )
}
