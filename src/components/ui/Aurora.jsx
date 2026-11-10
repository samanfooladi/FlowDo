// Three big blurred indigo circles drifting slowly behind a section (decorative).
// The parent section needs `relative isolate` (the layer sits at -z-10).
//
// Props:
//   blobs      [{ top, left, size, color }] (CSS values). Defaults to a balanced set.
//   className  extra classes for the layer, e.g. "opacity-60"
//
// Each blob drifts on its own loop (18s, 22s, 26s), defined in index.css (.aurora-blob).

const DRIFT_SECONDS = [18, 22, 26]

const DEFAULT_BLOBS = [
  { top: '-12%', left: '-8%', size: '520px', color: 'rgba(99,102,241,0.38)' },
  { top: '25%', left: '62%', size: '600px', color: 'rgba(79,70,229,0.32)' },
  { top: '68%', left: '18%', size: '460px', color: 'rgba(129,140,248,0.30)' },
]

export default function Aurora({ blobs = DEFAULT_BLOBS, className = '' }) {
  return (
    <div
      aria-hidden="true"
      // The mask fades the blobs out at the top and bottom, so sections join without a seam.
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(transparent,#000_14%,#000_86%,transparent)] ${className}`}
    >
      {blobs.map((blob, index) => (
        <div
          key={index}
          className="aurora-blob absolute"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            background: blob.color,
            '--dur': `${DRIFT_SECONDS[index % DRIFT_SECONDS.length]}s`,
            '--delay': `${-index * 6}s`, // start part-way through, so they're never in sync
          }}
        />
      ))}
    </div>
  )
}
