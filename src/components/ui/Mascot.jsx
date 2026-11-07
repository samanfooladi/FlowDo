import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

// One floating mascot picture (purely decorative).
//
// It's built from two elements on purpose:
//   - the outer <div> ("mascot-entrance") is what the parent section animates in,
//   - the <img> inside does the endless floating.
// Each GSAP animation moves its own element, so they never overwrite each other's transforms.
//
// Props:
//   src        image path, e.g. '/assets/mascot/flowdo-mascot-1-point.webp'
//   width      the image's real width in pixels  (lets the browser reserve space while it loads)
//   height     the image's real height in pixels
//   className  position + size classes for the outer div, e.g. 'left-[3%] top-[11%] h-[300px]'
//   float      { duration, delay, tilt }: seconds for one up-or-down move, start offset, max tilt in degrees
export default function Mascot({ src, width, height, className = '', float = {} }) {
  const imgRef = useRef(null)
  const { duration = 6, delay = 0, tilt = 1.5 } = float

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Only float when the visitor hasn't asked for less motion.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Start slightly tilted one way, then float up and tilt the other way, forever.
        gsap.set(imgRef.current, { rotation: -tilt })
        gsap.to(imgRef.current, {
          y: -18,
          rotation: tilt,
          duration,
          delay,
          ease: 'sine.inOut',
          yoyo: true, // go back down the same way
          repeat: -1, // forever
        })
      })
    },
    { dependencies: [duration, delay, tilt] },
  )

  return (
    // opacity-0: hidden until the parent fades it in (GSAP's inline style then wins over this class).
    <div className={`mascot-entrance absolute opacity-0 ${className}`}>
      <img
        ref={imgRef}
        src={src}
        width={width}
        height={height}
        alt=""
        draggable={false}
        decoding="async"
        // h-full + w-auto: the height comes from className above, the width follows the image's shape.
        className="h-full w-auto max-w-none drop-shadow-[0_18px_30px_rgba(67,56,202,0.35)] select-none"
      />
    </div>
  )
}
