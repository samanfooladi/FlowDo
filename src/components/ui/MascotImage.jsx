import { MASCOT_DIR, MASCOT_HEIGHT, MASCOTS } from '../../data/mascots.js'

// One mascot picture: WebP first, PNG as the fallback.
// Mascots are decoration, so the image is hidden from screen readers (alt="" + aria-hidden).
//
// Props:
//   name        a key of MASCOTS in src/data/mascots.js, e.g. "coffee"
//   className   size classes for the <img>, usually a height like "h-[330px]" (the width follows)
//   loading     "lazy" (default) or "eager" for pictures visible on first load
//   style       extra inline styles for the <img>
export default function MascotImage({ name, className = '', loading = 'lazy', style }) {
  const mascot = MASCOTS[name]
  const base = `${MASCOT_DIR}/${mascot.file}`

  return (
    <picture className="contents">
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img
        src={`${base}.png`}
        width={mascot.width}
        height={MASCOT_HEIGHT}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading={loading}
        decoding="async"
        className={`block w-auto max-w-none select-none ${className}`}
        style={style}
      />
    </picture>
  )
}
