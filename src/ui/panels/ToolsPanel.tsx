import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Box, Circle, Cylinder, Triangle, Move, RotateCw, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/state/editorStore'
import { cn } from '@/lib/utils'

const tools = [
  { id: 'box', name: 'Box', icon: Box },
  { id: 'sphere', name: 'Sphere', icon: Circle },
  { id: 'cylinder', name: 'Cylinder', icon: Cylinder },
  { id: 'pyramid', name: 'Pyramid', icon: Triangle },
  { id: 'move', name: 'Move', icon: Move },
  { id: 'rotate', name: 'Rotate', icon: RotateCw },
  { id: 'scale', name: 'Scale', icon: Maximize },
] as const

export function ToolsPanel() {
  const { activeTool, setActiveTool, isToolsPanelOpen } = useEditorStore()
  const panelRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!panelRef.current) return

    gsap.to(panelRef.current, {
      x: isToolsPanelOpen ? 0 : -280,
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [isToolsPanelOpen])

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-14 bottom-0 w-64 bg-background border-r border-border overflow-y-auto"
      style={{ transform: 'translateX(-280px)' }}
    >
      <div className="p-4 space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4">Tools</h2>
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? 'default' : 'ghost'}
              className={cn('w-full justify-start', activeTool === tool.id && 'bg-accent')}
              onClick={() => setActiveTool(tool.id as any)}
            >
              <Icon className="h-5 w-5 mr-2" />
              {tool.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
