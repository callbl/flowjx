import { useEditorStore } from '@/state/editorStore'

export function PropertiesPanel() {
  const { isPropertiesPanelOpen, selectedObjectId } = useEditorStore()

  if (!isPropertiesPanelOpen) return null

  return (
    <div className="absolute right-0 top-14 bottom-0 w-64 bg-background border-l border-border overflow-y-auto">
      <div className="p-4 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4">Properties</h2>

        {selectedObjectId ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Position</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">X</span>
                  <input
                    type="number"
                    defaultValue={0}
                    className="flex-1 h-8 px-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">Y</span>
                  <input
                    type="number"
                    defaultValue={0}
                    className="flex-1 h-8 px-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">Z</span>
                  <input
                    type="number"
                    defaultValue={0}
                    className="flex-1 h-8 px-2 rounded-md border border-input bg-background text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No object selected</p>
        )}
      </div>
    </div>
  )
}
