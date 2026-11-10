import MascotImage from './MascotImage.jsx'

// One floating Hero mascot (purely decorative).
//
// Two elements on purpose:
//   - the outer <div> ("mascot-entrance") is what the Hero fades in with GSAP,
//   - the inner <div> does the endless CSS bob (18px up and down with a slight tilt).
// Each one moves its own element, so the transforms never overwrite each other.
//
// Props:
//   name       mascot key from src/data/mascots.js
//   className  position + height classes for the outer div
//   float      { loop, delay, tilt }: seconds for a full up-and-down, start offset, max tilt in degrees
export default function Mascot({ name, className = '', float = {} }) {
  const { loop = 6, delay = 0, tilt = 1.5 } = float

  return (
    // opacity-0: hidden until the Hero fades it in (GSAP's inline style then wins over this class).
    <div className={`mascot-entrance absolute opacity-0 ${className}`}>
      <div
        className="loop-bob h-full"
        style={{ '--dur': `${loop}s`, '--delay': `${delay}s`, '--tilt': `${tilt}deg`, '--bob': '18px' }}
      >
        <MascotImage
          name={name}
          loading="eager"
          className="h-full drop-shadow-[0_18px_30px_rgba(67,56,202,0.35)]"
        />
      </div>
    </div>
  )
}
