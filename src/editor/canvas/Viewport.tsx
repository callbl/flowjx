import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Scene } from './Scene'

export function Viewport() {
  return (
    <div className="flex-1 relative">
      <Canvas
        camera={{
          position: [15, 15, 15],
          fov: 75,
        }}
        shadows
      >
        {/* Background color */}
        <color attach="background" args={['#1a1a1a']} />

        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
        />

        {/* Ground grid */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6e6e6e"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />

        {/* Scene objects will be rendered here */}
        <Scene />
      </Canvas>
    </div>
  )
}
