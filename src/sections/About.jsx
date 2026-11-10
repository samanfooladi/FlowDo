import { useState } from 'react'
import Aurora from '../components/ui/Aurora.jsx'
import Twinkles from '../components/ui/Twinkles.jsx'
import MascotImage from '../components/ui/MascotImage.jsx'
import RingDial from '../components/ui/RingDial.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ShineText from '../components/ui/ShineText.jsx'
import { ABOUT_CARD_LABEL, ABOUT_FACTS, ABOUT_INTRO, ABOUT_MODES } from '../data/about.js'
import useInView from '../hooks/useInView.js'
import useReveal from '../hooks/useReveal.js'

// Small line icons for the fact cards (decorative, so aria-hidden).
const iconProps = {
  viewBox: '0 0 24 24',
  className: 'size-5',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const FACT_ICONS = {
  computer: (
    <svg {...iconProps}>
      <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
      <path d="M9 19.5h6M12 15.5v4" />
    </svg>
  ),
  clock: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  history: (
    <svg {...iconProps}>
      <path d="M6 19v-6M12 19V7M18 19v-9" />
    </svg>
  ),
}

// Mascot per mode. Each one has its own size and loop; they crossfade over 0.45s.
const MODE_MASCOTS = {
  guide: { height: 'h-[560px] max-[960px]:h-[380px]', bob: '10px', loop: '6.4s' },
  meditate: { height: 'h-[440px] max-[960px]:h-[300px]', bob: '14px', loop: '4s' },
}

// Pomodoro / Flowmodoro segmented control. aria-pressed tells screen readers which is on.
function ModeToggle({ activeId, onChange }) {
  return (
    <div
      role="group"
      aria-label="Timer mode"
      className="flex rounded-full border border-white/10 bg-white/[0.04] p-1"
    >
      {ABOUT_MODES.map((mode) => {
        const active = mode.id === activeId
        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(mode.id)}
            className={`min-h-11 rounded-full px-5 text-[15px] font-medium transition-colors duration-300 ${active ? 'bg-white text-[#0B0A1A]' : 'text-muted hover:text-white'}`}
          >
            {mode.title}
          </button>
        )
      })}
    </div>
  )
}

export default function About() {
  const [sectionRef, inView] = useInView()
  useReveal(sectionRef)

  const [modeId, setModeId] = useState(ABOUT_MODES[0].id)
  const mode = ABOUT_MODES.find((item) => item.id === modeId)

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className={`relative isolate overflow-hidden bg-[linear-gradient(180deg,#050409,#0B0A22_30%,#13113D_65%,#050409)] px-4 pt-[clamp(96px,10vw,150px)] pb-[clamp(96px,10vw,150px)] ${inView ? '' : 'loops-paused'}`}
    >
      {/* Faint hairline along the top */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(165,180,252,0.3),transparent)]"
      />
      {/* Radial glow on the right, behind the mascot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[30%] right-[-10%] -z-10 size-[800px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.3),transparent)]"
      />
      <Aurora
        blobs={[
          { top: '20%', left: '-15%', size: '520px', color: 'rgba(79,70,229,0.32)' },
          { top: '45%', left: '65%', size: '560px', color: 'rgba(99,102,241,0.34)' },
          { top: '80%', left: '30%', size: '420px', color: 'rgba(129,140,248,0.3)' },
        ]}
      />
      <Twinkles />

      <div className="relative mx-auto max-w-[1120px]">
        <SectionHeading
          id="about-title"
          title={
            <>
              What is <ShineText>Flowdo</ShineText>?
            </>
          }
          intro={ABOUT_INTRO}
        />

        {/* Featured card + mascot. Side by side above 960px, stacked below. */}
        <div className="mt-16 flex flex-col items-center min-[961px]:flex-row min-[961px]:items-center">
          <div data-reveal="2" className="relative z-10 w-full min-w-0 min-[961px]:max-w-[640px] min-[961px]:flex-1">
            <div className="glass-featured p-6 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-[13px] font-semibold tracking-[0.18em] text-muted uppercase">
                  {ABOUT_CARD_LABEL}
                </p>
                <ModeToggle activeId={modeId} onChange={setModeId} />
              </div>

              <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
                <RingDial segments={mode.dial.segments} size={200} thickness={18} gap={2.5} ticks label={mode.dial.label}>
                  <span key={mode.id} className="flex flex-col items-center motion-safe:animate-fade-swap">
                    <span className="text-[44px] leading-none font-bold tracking-[-0.04em] tabular-nums">
                      {mode.dial.time}
                    </span>
                    <span
                      className={`mt-1.5 text-[14px] ${mode.dial.captionTone === 'green' ? 'font-semibold text-break' : 'text-muted'}`}
                    >
                      {mode.dial.caption}
                    </span>
                  </span>
                </RingDial>

                {/* Swapped in with a short fade whenever the mode changes */}
                <div key={mode.id} className="min-w-0 flex-1 motion-safe:animate-fade-swap" aria-live="polite">
                  <h3 className="text-[30px] leading-tight font-bold tracking-[-0.03em]">{mode.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-muted">{mode.description}</p>
                  <dl className="mt-5 grid grid-cols-3 gap-2.5">
                    {mode.stats.map((stat) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
                        <dt className="text-[13px] text-muted">{stat.label}</dt>
                        <dd
                          className={`mt-1 text-[20px] font-bold tracking-[-0.02em] ${stat.tone === 'green' ? 'text-break-light' : 'text-white'}`}
                        >
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Mascot column: overlaps the card slightly; crossfades between the two poses */}
          <div
            data-reveal="3"
            className="relative mt-10 flex h-[400px] w-full max-w-[340px] shrink-0 items-end justify-center min-[961px]:mt-0 min-[961px]:-ml-6 min-[961px]:h-[580px] min-[961px]:w-[340px]"
          >
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 h-8 w-3/4 -translate-x-1/2 translate-y-1/3 rounded-[50%] bg-[rgba(67,56,202,0.6)] blur-[22px]"
            />
            {Object.entries(MODE_MASCOTS).map(([name, look]) => (
              <div
                key={name}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-opacity duration-[450ms] ease-out ${mode.mascot === name ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="loop-bob" style={{ '--bob': look.bob, '--dur': look.loop }}>
                  <MascotImage
                    name={name}
                    className={`${look.height} drop-shadow-[0_18px_30px_rgba(67,56,202,0.35)]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fact cards */}
        <ul className="mt-20 grid gap-5 md:grid-cols-3">
          {ABOUT_FACTS.map((fact, index) => (
            <li key={fact.title} data-reveal={index + 1} className="glass p-7">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[rgba(99,102,241,0.18)] text-indigo-300">
                {FACT_ICONS[fact.icon]}
              </span>
              <h3 className="mt-5 text-[19px] leading-snug font-bold tracking-[-0.02em]">{fact.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{fact.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
