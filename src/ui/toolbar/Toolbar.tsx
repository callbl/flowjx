import { Menu, Undo, Redo, Upload, Download, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/state/editorStore'

export function Toolbar() {
  const { toggleToolsPanel, togglePropertiesPanel } = useEditorStore()

  return (
    <div className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleToolsPanel}>
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Undo className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Redo className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Upload className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Download className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={togglePropertiesPanel}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
