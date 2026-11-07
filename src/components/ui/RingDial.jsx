// A round timer dial made of coloured segments, with content in the middle.
//
// How it's drawn (no SVG needed):
//   1. A conic-gradient paints the coloured slices around the circle. Each slice's angle is
//      proportional to its minutes, and a small transparent gap separates neighbours.
//   2. A radial-gradient mask hides the middle, so only an outer ring of `thickness` px is left.
//
// Props:
//   segments   [{ minutes, color }], drawn clockwise from the top
//   size       diameter in px (default 132)
//   thickness  ring width in px (default 10)
//   label      what the dial shows, read out by screen readers (the drawing itself is invisible to them)
//   children   content shown in the centre, e.g. the time
//
// Example:
//   <RingDial label="50 minutes focus, 10 minutes break"
//     segments={[{ minutes: 50, color: '#6366F1' }, { minutes: 10, color: '#34D399' }]}>
//     50:00
//   </RingDial>

const GAP = 3 // degrees of empty space between two segments

// Turns the segments into the stops of a conic-gradient, e.g.
// "#6366F1 0deg 147deg, transparent 147deg 150deg, #34D399 150deg ..."
function buildGradient(segments) {
  const total = segments.reduce((sum, segment) => sum + segment.minutes, 0)
  let angle = 0
  const stops = []

  for (const segment of segments) {
    const span = (segment.minutes / total) * 360
    const end = angle + span - GAP // the coloured part stops GAP degrees early...
    stops.push(`${segment.color} ${angle}deg ${end}deg`)
    stops.push(`transparent ${end}deg ${angle + span}deg`) // ...and the gap fills the rest
    angle += span
  }

  // "from" turns the whole ring by half a gap, so the gap at the top is centred on 12 o'clock.
  return `conic-gradient(from ${GAP / 2}deg, ${stops.join(', ')})`
}

export default function RingDial({ segments, size = 132, thickness = 10, label, children }) {
  // Keep the outer `thickness` px of the circle, hide everything inside it.
  // (The extra 0.5px blurs the edge by half a pixel so it isn't jagged.)
  const mask = `radial-gradient(closest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness - 0.5}px))`

  return (
    <div
      role="img"
      aria-label={label}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      {/* The ring itself */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: buildGradient(segments), WebkitMask: mask, mask }}
      />

      {/* Centre content. aria-hidden: the label above already describes the dial. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        {children}
      </div>
    </div>
  )
}
