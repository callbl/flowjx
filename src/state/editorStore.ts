import { create } from 'zustand'

type Tool = 'select' | 'box' | 'sphere' | 'cylinder' | 'pyramid' | 'move' | 'rotate' | 'scale'

interface EditorState {
  activeTool: Tool
  isToolsPanelOpen: boolean
  isPropertiesPanelOpen: boolean
  selectedObjectId: string | null

  setActiveTool: (tool: Tool) => void
  toggleToolsPanel: () => void
  togglePropertiesPanel: () => void
  setSelectedObject: (id: string | null) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTool: 'select',
  isToolsPanelOpen: true,
  isPropertiesPanelOpen: true,
  selectedObjectId: null,

  setActiveTool: (tool) => set({ activeTool: tool }),
  toggleToolsPanel: () => set((state) => ({ isToolsPanelOpen: !state.isToolsPanelOpen })),
  togglePropertiesPanel: () => set((state) => ({ isPropertiesPanelOpen: !state.isPropertiesPanelOpen })),
  setSelectedObject: (id) => set({ selectedObjectId: id }),
}))
