import { useEffect, useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import { Box3, MathUtils, Vector3 } from 'three'

const MODEL_URL = '/models/flowdo-logo.glb'

// Start downloading the model as soon as this file loads.
useGLTF.preload(MODEL_URL)

const deg = (degrees) => MathUtils.degToRad(degrees)

// How much of the canvas the logo should fill (0.75 = 75%).
const FILL = 0.75

// Animation settings. Distances are in screen pixels and converted to 3D units each frame.
const ENTRANCE_SECONDS = 1
const ENTRANCE_PX = 115 // starts this far below (about -0.8 units at camera distance 6)
const FLOAT_SECONDS = 6 // one full up-and-down cycle
const FLOAT_PX = 7 // 7px up and 7px down = 14px of travel
const DRIFT_PX = 16 // max shift toward the mouse
const DRIFT_SPEED = 4 // higher = follows the mouse more tightly

// Ease-out curve, close to cubic-bezier(0.22, 1, 0.36, 1): fast start, soft landing.
const easeOut = (t) => 1 - Math.pow(1 - t, 4)

/**
 * The Flowdo logo.
 * - pointer: ref holding { x, y } from -1 to 1 (mouse position over the section, 0 = centre)
 * - reducedMotion: skip movement, only the CSS fade remains
 * - onLoaded: called once the model is on screen
 */
export default function Logo3D({ pointer, reducedMotion, onLoaded }) {
  const { scene } = useGLTF(MODEL_URL)
  // `get()` reads R3F's live state. three.js objects are meant to be changed directly.
  const get = useThree((state) => state.get)

  const motionGroup = useRef() // animated: entrance, float, mouse drift (position only)
  const angleGroup = useRef() // the fixed viewing angle, never animated
  const time = useRef(0)
  const drift = useRef({ x: 0, y: 0 })

  // Move the camera closer/further so the logo fills ~75% of the canvas,
  // whatever units the model was exported in. Only the distance changes.
  useLayoutEffect(() => {
    const { camera } = get()
    angleGroup.current.updateWorldMatrix(true, true)
    const size = new Box3().setFromObject(angleGroup.current, true).getSize(new Vector3())
    const halfSize = Math.max(size.x, size.y) / 2
    camera.position.z = halfSize / (FILL * Math.tan(deg(camera.fov / 2))) + size.z / 2
    camera.updateProjectionMatrix()
  }, [get, scene])

  useEffect(() => {
    onLoaded?.()
  }, [onLoaded])

  useFrame((state, delta) => {
    // Cap delta so a paused or background tab doesn't make things jump.
    const dt = Math.min(delta, 0.1)
    time.current += dt
    const t = time.current
    const { camera } = state

    // How many 3D units one screen pixel is, at the logo's depth.
    const unitsPerPx =
      (2 * camera.position.z * Math.tan(deg(camera.fov / 2))) / state.size.height

    let y = 0
    let targetX = 0
    let targetY = 0

    if (!reducedMotion) {
      // 1. Entrance: rise from below.
      const progress = Math.min(t / ENTRANCE_SECONDS, 1)
      y = -ENTRANCE_PX * unitsPerPx * (1 - easeOut(progress))

      // 2. Float: starts when the entrance ends (sin(0) = 0, so there's no jump).
      const floatTime = Math.max(0, t - ENTRANCE_SECONDS)
      y += Math.sin((floatTime / FLOAT_SECONDS) * Math.PI * 2) * FLOAT_PX * unitsPerPx

      // 3. Mouse drift target (screen y points down, 3D y points up, hence the minus).
      targetX = pointer.current.x * DRIFT_PX * unitsPerPx
      targetY = -pointer.current.y * DRIFT_PX * unitsPerPx
    }

    // Ease toward the target a bit each frame (a smooth "lerp").
    const ease = 1 - Math.exp(-DRIFT_SPEED * dt)
    drift.current.x += (targetX - drift.current.x) * ease
    drift.current.y += (targetY - drift.current.y) * ease

    motionGroup.current.position.set(drift.current.x, y + drift.current.y, 0)
  })

  return (
    // Animations only touch this outer group, so the angle below never changes.
    <group ref={motionGroup}>
      {/* Exact viewing angle (verified, do not change). Applied innermost first. */}
      <group ref={angleGroup} rotation-z={deg(43)}>
        <group rotation-y={deg(52)}>
          {/* Turns the tile to face the camera */}
          <group rotation-x={deg(90)}>
            <Center>
              {/* Materials come straight from the .glb, untouched */}
              <primitive object={scene} />
            </Center>
          </group>
        </group>
      </group>
    </group>
  )
}
