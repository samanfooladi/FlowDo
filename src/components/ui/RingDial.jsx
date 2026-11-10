import { useState } from 'react'

// A round timer dial made of coloured segments, with content in the middle.
//
// How it's drawn (no SVG needed):
//   1. A conic-gradient paints the coloured slices around the circle. Each slice's angle is
//      proportional to its minutes, and a small transparent gap separates neighbours.
//   2. A radial-gradient mask hides the middle, so only an outer ring of `thickness` px is left.
//   3. Optional: a fine tick ring just inside it.
//
// When `segments` change, the new ring "draws" itself clockwise over 0.4s while the old one
// fades out (no animation with reduced motion).
//
// Props:
//   segments   [{ minutes, color }], drawn clockwise from the top
//   size       diameter in px (default 200)
//   thickness  ring width in px (default 18)
//   gap        degrees of empty space between two segments (default 2.5)
//   ticks      true = draw the fine tick ring inside
//   label      what the dial shows, read out by screen readers
//   children   content shown in the centre, e.g. the time

function buildGradient(segments, gap) {
  const total = segments.reduce((sum, segment) => sum + segment.minutes, 0)
  let angle = 0
  const stops = []

  for (const segment of segments) {
    const span = (segment.minutes / total) * 360
    const end = angle + span - gap // the coloured part stops `gap` degrees early...
    stops.push(`${segment.color} ${angle}deg ${end}deg`)
    stops.push(`transparent ${end}deg ${angle + span}deg`) // ...and the gap fills the rest
    angle += span
  }

  // "from" turns the whole ring by half a gap, so the gap at the top is centred on 12 o'clock.
  return `conic-gradient(from ${gap / 2}deg, ${stops.join(', ')})`
}

// The sweep mask hides everything past the --sweep angle (animated by .ring-draw).
const SWEEP_MASK = 'conic-gradient(#000 var(--sweep), transparent var(--sweep))'

export default function RingDial({
  segments,
  size = 200,
  thickness = 18,
  gap = 2.5,
  ticks = false,
  label,
  children,
}) {
  const gradient = buildGradient(segments, gap)

  // Remember the previous ring so it can fade out under the new one.
  // (Updating state during render is React's documented way to react to a prop change.)
  const [rings, setRings] = useState({ current: gradient, previous: null })
  if (rings.current !== gradient) {
    setRings({ current: gradient, previous: rings.current })
  }

  const ringMask = `radial-gradient(closest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness - 0.5}px))`

  return (
    <div role="img" aria-label={label} className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Old ring, fading out */}
      {rings.previous && (
        <div
          key={`old-${rings.previous}`}
          className="ring-fade absolute inset-0 rounded-full"
          style={{ background: rings.previous, WebkitMask: ringMask, mask: ringMask }}
        />
      )}

      {/* Current ring. The outer div cuts the ring shape, the inner one draws it clockwise. */}
      <div className="absolute inset-0" style={{ WebkitMask: ringMask, mask: ringMask }}>
        <div
          key={rings.current}
          className={`absolute inset-0 rounded-full ${rings.previous ? 'ring-draw' : ''}`}
          style={{ background: rings.current, WebkitMask: SWEEP_MASK, mask: SWEEP_MASK }}
        />
      </div>

      {/* Fine tick ring just inside the coloured one */}
      {ticks && (
        <div
          aria-hidden="true"
          className="tick-ring absolute"
          style={{ inset: thickness + 8, '--tick-length': '7px' }}
        />
      )}

      {/* Centre content. aria-hidden: the label above already describes the dial. */}
      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}
