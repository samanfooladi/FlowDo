// About six tiny glowing dots that fade in and rise, each on its own delay (decorative).
// The parent needs `relative`. Positions are percentages of the parent.
//
// Props:
//   dots       [{ top, left, delay }] (delay in seconds). Defaults to a spread-out set.
//   className  extra classes for the layer

const DEFAULT_DOTS = [
  { top: '14%', left: '47%', delay: 0 },
  { top: '24%', left: '8%', delay: 1.6 },
  { top: '30%', left: '78%', delay: 3.1 },
  { top: '58%', left: '91%', delay: 0.8 },
  { top: '72%', left: '22%', delay: 2.4 },
  { top: '86%', left: '63%', delay: 4.2 },
]

export default function Twinkles({ dots = DEFAULT_DOTS, className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      {dots.map((dot, index) => (
        <span
          key={index}
          className="twinkle-dot absolute"
          // Negative delay = already part-way through its loop on the first frame.
          style={{ top: dot.top, left: dot.left, '--delay': `${-dot.delay}s` }}
        />
      ))}
    </div>
  )
}
