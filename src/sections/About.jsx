import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import RingDial from '../components/ui/RingDial.jsx'
import { ABOUT_FACTS, ABOUT_MODES } from '../data/about.js'
import useInView from '../hooks/useInView.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SWITCH_EVERY = 4000 // ms between moving the mascot's "pointer" to the other card

// Badge colours for each `tone` in src/data/about.js
const BADGE_TONES = {
  indigo: 'bg-brand/15 text-brand-light ring-brand/30',
  green: 'bg-[#34D399]/12 text-[#6EE7B7] ring-[#34D399]/30',
}

// Small line icons for the facts strip (decorative, so aria-hidden).
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
  // A laptop
  computer: (
    <svg {...iconProps}>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </svg>
  ),
  // A clock
  clock: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  // Code brackets
  code: (
    <svg {...iconProps}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  ),
}

// One timer-mode card: dial on the left, text on the right (stacked on phones).
// `active` = the mascot is pointing at it, which brightens the border and adds a glow.
function ModeCard({ mode, active }) {
  const { dial } = mode

  return (
    <li
      className={[
        'about-card flex flex-col gap-6 rounded-[28px] border p-7 sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:py-9',
        // Only these three properties animate, so the class swap fades smoothly over 0.5s
        // (and it never fights GSAP, which only moves `transform` and `opacity`).
        'transition-[border-color,background-color,box-shadow] duration-500 ease-out',
        active
          ? 'border-[rgba(129,140,248,0.55)] bg-[rgba(99,102,241,0.09)] shadow-[0_0_0_6px_rgba(99,102,241,0.10),0_30px_80px_rgba(67,56,202,0.25)]'
          : // Same two shadows at zero strength, so the browser can fade between them.
            'border-white/8 bg-white/[0.03] shadow-[0_0_0_0_rgba(99,102,241,0),0_0_0_rgba(67,56,202,0)]',
      ].join(' ')}
    >
      <RingDial segments={dial.segments} size={132} thickness={10} label={dial.label}>
        <span className="text-[24px] leading-none font-bold tracking-[-0.03em] tabular-nums">
          {dial.time}
        </span>
        <span
          className={`mt-1.5 text-[11px] font-medium ${dial.captionTone === 'green' ? 'text-[#34D399]' : 'text-subtle'}`}
        >
          {dial.caption}
        </span>
      </RingDial>

      <div>
        <span
          className={`inline-block rounded-full px-3 py-1 text-[12px] font-semibold ring-1 ring-inset ${BADGE_TONES[mode.tone]}`}
        >
          {mode.badge}
        </span>
        <h3 className="mt-3 text-[28px] leading-tight font-bold tracking-[-0.03em]">{mode.title}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-muted">{mode.description}</p>
      </div>
    </li>
  )
}

export default function About() {
  // useInView gives us a ref for the <section> plus "is it on screen?".
  // We also need the same element for GSAP's scope, so we reuse that ref.
  const [sectionRef, inView] = useInView()
  const reducedMotion = usePrefersReducedMotion()
  const mascotImgRef = useRef(null)

  // Which card the mascot points at: 0 = Pomodoro, 1 = Flowmodoro.
  const [activeIndex, setActiveIndex] = useState(0)
  // Becomes true once the entrance animation has finished; the switching waits for it.
  const [entered, setEntered] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The endless float, created paused. It starts when the entrance is done.
        // It moves the <img>, while the entrance moves its wrapper, so the two never clash.
        const float = gsap.to(mascotImgRef.current, {
          y: -12,
          duration: 3.2,
          ease: 'sine.inOut',
          yoyo: true, // float back down the same way
          repeat: -1, // forever
          paused: true,
        })

        // One timeline for the whole entrance. It plays once, when the top of the
        // section reaches 75% of the way down the screen.
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out', duration: 1 },
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
          onComplete: () => {
            float.play()
            setEntered(true)
          },
        })

        tl.from('.about-rise', { y: 30, opacity: 0, stagger: 0.1 }) // eyebrow, h2, paragraph
          .from('.about-card', { x: -40, opacity: 0, stagger: 0.15 }, '-=0.7') // '-=0.7' = overlap the previous step
          .from('.about-mascot', { x: 60, opacity: 0, duration: 1.2 }, '-=0.75') // slides in from the right, just after the cards
          .from('.about-facts', { y: 30, opacity: 0 }, '-=0.8') // last
      })

      // Reduced motion: everything just fades in, no movement and no float.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.about-rise, .about-card, .about-mascot, .about-facts', {
          opacity: 0,
          duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        })
      })
    },
    { scope: sectionRef }, // class selectors above only match inside this section
  )

  // Move the highlight to the other card every 4 seconds, but only when:
  // the entrance is done, the section is on screen, and the visitor allows motion.
  useEffect(() => {
    if (!entered || !inView || reducedMotion) return

    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % ABOUT_MODES.length)
    }, SWITCH_EVERY)
    return () => clearInterval(timer) // stops when the section scrolls away, restarts when it's back
  }, [entered, inView, reducedMotion])

  // Reduced motion always shows Pomodoro as the highlighted card.
  const highlighted = reducedMotion ? 0 : activeIndex

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      // `isolate` lets the decorative layers use -z-10 to sit behind the content.
      className="relative isolate overflow-hidden bg-bg px-4 pt-[140px] pb-[160px]"
    >
      {/* Thin line along the top that fades out at both ends (decorative) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(165,180,252,0.35),transparent)]"
      />

      <div className="relative mx-auto max-w-[1120px]">
        {/* 1. Heading block */}
        <div className="max-w-[760px]">
          <p className="about-rise text-[13px] font-semibold tracking-[0.16em] text-brand">
            ABOUT FLOWDO
          </p>
          <h2
            id="about-title"
            className="about-rise mt-4 text-[clamp(40px,5.2vw,68px)] leading-[1.03] font-bold tracking-[-0.04em]"
          >
            Your tasks and your focus time, <span className="text-brand">in one place.</span>
          </h2>
          <p className="about-rise mt-6 max-w-[620px] text-[19px] leading-relaxed text-muted">
            Pick a task, start the timer, and every minute you focus is logged against it. Choose
            how you like to work: fixed rounds or open-ended flow.
          </p>
        </div>

        {/* 2. Guide row: cards on the left, mascot on the right.
            Below 900px wide: cards first, then the mascot centred underneath. */}
        <div className="mt-16 flex flex-col min-[900px]:flex-row min-[900px]:items-start">
          {/* The cards start 24px lower than the mascot, so his stick points at the first one */}
          <ul aria-label="Timer modes" className="flex min-w-0 flex-1 flex-col gap-5 min-[900px]:mt-6">
            {ABOUT_MODES.map((mode, index) => (
              <ModeCard key={mode.id} mode={mode} active={index === highlighted} />
            ))}
          </ul>

          {/* Mascot column. -ml-3 pulls him 12px toward the cards so the stick tip reaches them.
              z-10 keeps the stick drawn on top of the card edge. */}
          <div className="relative z-10 mt-14 flex shrink-0 justify-center min-[900px]:mt-0 min-[900px]:-ml-3 min-[900px]:w-[380px] min-[900px]:justify-start">
            {/* Big soft indigo glow behind him (decorative) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[560px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(99,102,241,0.22),transparent)] min-[900px]:size-[820px]"
            />

            {/* The wrapper does the entrance; the <img> inside does the float. */}
            <div className="about-mascot relative">
              {/* Soft shadow under his feet (decorative) */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 h-6 w-3/5 -translate-x-1/2 translate-y-1/2 rounded-[50%] bg-[rgba(67,56,202,0.55)] blur-[18px]"
              />
              <img
                ref={mascotImgRef}
                src="/assets/mascot/flowdo-mascot-5-guide.webp"
                width={409}
                height={720}
                alt="Flowdo's mascot pointing at the two timer modes"
                draggable={false}
                loading="lazy"
                decoding="async"
                // The height sets the size; the width follows the image's shape (409×720).
                className="relative h-[380px] w-auto max-w-none drop-shadow-[0_18px_30px_rgba(67,56,202,0.35)] select-none min-[900px]:h-[620px]"
              />
            </div>
          </div>
        </div>

        {/* 3. Facts strip: three cells side by side, stacked on phones */}
        <ul className="about-facts mt-20 grid divide-y divide-white/8 overflow-hidden rounded-[20px] border border-white/8 bg-white/[0.02] md:grid-cols-3 md:divide-x md:divide-y-0">
          {ABOUT_FACTS.map((fact) => (
            <li key={fact.title} className="flex gap-4 p-6 lg:p-7">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-light ring-1 ring-brand/25 ring-inset">
                {FACT_ICONS[fact.icon]}
              </span>
              <div>
                <h3 className="text-[16px] leading-snug font-semibold">{fact.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{fact.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
