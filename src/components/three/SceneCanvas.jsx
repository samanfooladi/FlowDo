import { Component, Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { NeutralToneMapping, PMREMGenerator } from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// These live outside the component on purpose: R3F re-applies camera/gl settings
// when it sees a *new* object, so a fresh {...} on every render would reset the camera.
const DEFAULT_CAMERA = { position: [0, 0, 6], fov: 26 }
const GL_SETTINGS = {
  alpha: true, // transparent background, the page shows through
  antialias: true,
  toneMapping: NeutralToneMapping,
  toneMappingExposure: 0.95,
}

// Reflections/lighting built from three's RoomEnvironment, entirely in the browser.
// (drei's <Environment preset="..."> would download an HDR file from a CDN.)
function LocalEnvironment() {
  // `get()` reads R3F's live state. three.js objects are meant to be changed directly.
  const get = useThree((state) => state.get)

  useEffect(() => {
    const { gl, scene } = get()
    const pmrem = new PMREMGenerator(gl)
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envMap
    return () => {
      scene.environment = null
      envMap.dispose()
      pmrem.dispose()
    }
  }, [get])

  return null
}

// If something inside the 3D scene fails (for example the .glb file is missing),
// show nothing instead of crashing the whole page.
class SceneErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('3D scene failed to load:', error)
    this.props.onError?.()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * Shared <Canvas> for every 3D section.
 * - active: false pauses rendering (use with useInView so offscreen scenes cost nothing)
 * - onError: called if the scene fails to load
 */
export default function SceneCanvas({ children, active = true, camera = DEFAULT_CAMERA, onError }) {
  return (
    <Canvas
      camera={camera}
      gl={GL_SETTINGS}
      dpr={[1, 2]} // sharp on retina screens, capped at 2x for speed
      frameloop={active ? 'always' : 'never'}
    >
      <LocalEnvironment />
      <SceneErrorBoundary onError={onError}>
        {/* The canvas shows right away; models pop in when they've downloaded. */}
        <Suspense fallback={null}>{children}</Suspense>
      </SceneErrorBoundary>
    </Canvas>
  )
}
