export function ViewportPlaceholder() {
  return (
    <div className="flex-1 bg-muted flex items-center justify-center">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-muted-foreground">3D Viewport</h2>
        <p className="text-sm text-muted-foreground">Three.js canvas will be rendered here</p>
      </div>
    </div>
  )
}
