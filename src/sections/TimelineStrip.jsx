import MascotImage from '../components/ui/MascotImage.jsx'
import { MINUTE_PX, TIMELINE_BLOCKS, TIMELINE_LOOP_SECONDS } from '../data/timeline.js'
import useInView from '../hooks/useInView.js'

// Colours for each kind of block: tick marks, bar and label.
const KINDS = {
  focus: { ticks: 'rgba(129,140,248,0.6)', bar: '#6366F1', label: '#C7D2FE' },
  break: { ticks: 'rgba(52,211,153,0.6)', bar: '#34D399', label: '#6EE7B7' },
  flow: {
    ticks: 'rgba(165,180,252,0.6)',
    bar: 'linear-gradient(90deg, #4338CA, #818CF8, #C7D2FE)',
    label: '#E0E7FF',
  },
}

// One block of the belt: tick band, bar, label (and an optional mascot riding on top).
function Block({ block }) {
  const kind = KINDS[block.kind]

  return (
    <div className="relative shrink-0" style={{ width: block.minutes * MINUTE_PX }}>
      {block.mascot && (
        <div className="absolute bottom-full left-[18%] mb-[-6px]">
          <MascotImage
            name={block.mascot}
            className="h-[92px] drop-shadow-[0_0_18px_rgba(52,211,153,0.25)] max-[960px]:h-[70px]"
          />
        </div>
      )}

      {/* 44px band of tick marks: a 2px line every minute, fading downward */}
      <div
        className="h-11 max-[960px]:h-8"
        style={{
          background: `repeating-linear-gradient(90deg, ${kind.ticks} 0 2px, transparent 2px ${MINUTE_PX}px)`,
          WebkitMask: 'linear-gradient(#000, rgba(0,0,0,0.25))',
          mask: 'linear-gradient(#000, rgba(0,0,0,0.25))',
        }}
      />

      {/* The bar (6px shorter than the block, which leaves a gap before the next one) */}
      <div className="mt-2.5 h-2.5 rounded-full" style={{ width: 'calc(100% - 6px)', background: kind.bar }} />

      <p
        className="mt-3.5 truncate pr-3 text-[13px] font-bold tracking-[0.08em] whitespace-nowrap uppercase"
        style={{ color: kind.label }}
      >
        {block.label}
      </p>
    </div>
  )
}

// A focus timeline that scrolls left forever, with a fixed "NOW" playhead (decorative).
export default function TimelineStrip() {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative h-[260px] overflow-hidden bg-base select-none max-[960px]:h-[195px] ${inView ? '' : 'loops-paused'}`}
    >
      {/* The belt: the cycle twice in a row, moved left by one cycle per loop = seamless */}
      <div className="absolute inset-x-0 bottom-[46px] max-[960px]:bottom-[32px]">
        <div
          className="loop-marquee-left flex w-max"
          style={{ '--dur': `${TIMELINE_LOOP_SECONDS}s`, '--shift': '-50%' }}
        >
          {[0, 1].map((copy) =>
            TIMELINE_BLOCKS.map((block, index) => <Block key={`${copy}-${index}`} block={block} />),
          )}
        </div>
      </div>

      {/* Edges fade into the background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-base to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-base to-transparent" />

      {/* Playhead: white line with an indigo glow, and the "NOW" pill on top */}
      <div className="absolute top-[26px] bottom-[18px] left-1/2 flex -translate-x-1/2 flex-col items-center max-[960px]:top-[16px]">
        <span className="rounded-full bg-white px-3.5 py-1 text-[13px] font-bold tracking-[0.08em] text-[#0B0A1A] shadow-[0_0_20px_rgba(99,102,241,0.6)]">
          NOW
        </span>
        <span className="w-0.5 flex-1 bg-white shadow-[0_0_12px_2px_rgba(99,102,241,0.8)]" />
      </div>
    </div>
  )
}
