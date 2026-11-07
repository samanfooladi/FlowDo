import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Button from '../components/ui/Button.jsx'
import Mascot from '../components/ui/Mascot.jsx'
import { DOWNLOADS, VERSION } from '../data/downloads.js'
import { HERO_MASCOTS } from '../data/mascots.js'
import useInView from '../hooks/useInView.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

// The 3D code (three.js is big) loads in the background, so the text shows immediately.
const SceneCanvas = lazy(() => import('../components/three/SceneCanvas.jsx'))
// Start fetching the logo code (and, through it, the .glb) right away, in parallel with
// the canvas code, instead of waiting until the canvas has mounted.
const logo3DImport = import('../components/three/Logo3D.jsx')
const Logo3D = lazy(() => logo3DImport)

gsap.registerPlugin(useGSAP)

const clamp = (value) => Math.max(-1, Math.min(1, value))

function WindowsIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="7.5" height="7.5" />
      <rect x="8.5" y="0" width="7.5" height="7.5" />
      <rect x="0" y="8.5" width="7.5" height="7.5" />
      <rect x="8.5" y="8.5" width="7.5" height="7.5" />
    </svg>
  )
}

// A simple penguin silhouette (Tux) with the belly cut out.
function LinuxIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M8 1C6.3 1 5.2 2.4 5.2 4.3v1.4c0 .9-.5 1.7-1.1 2.5C3.3 9.2 2.6 10.4 2.6 11.8c0 .5.1.9.3 1.3L2 14.2c-.2.3 0 .8.4.8h3.1c.4 0 .7-.2.9-.5.5.1 1 .2 1.6.2s1.1-.1 1.6-.2c.2.3.5.5.9.5h3.1c.4 0 .6-.5.4-.8l-.9-1.1c.2-.4.3-.8.3-1.3 0-1.4-.7-2.6-1.5-3.6-.6-.8-1.1-1.6-1.1-2.5V4.3C10.8 2.4 9.7 1 8 1zM8 8.4c-1.1 0-1.9 1.2-1.9 2.6S6.9 13.4 8 13.4s1.9-1 1.9-2.4S9.1 8.4 8 8.4zM7 3.3a.6.6 0 1 0 0 1.2.6.6 0 1 0 0-1.2zm2 0a.6.6 0 1 0 0 1.2.6.6 0 1 0 0-1.2z" />
    </svg>
  )
}

const PLATFORM_ICONS = {
  windows: <WindowsIcon />,
  linux: <LinuxIcon />,
}

// "FlowDo" split into letters so GSAP can animate each one. `color` keeps Flow white, Do indigo.
const TITLE_LETTERS = [
  { char: 'F', color: 'text-text' },
  { char: 'l', color: 'text-text' },
  { char: 'o', color: 'text-text' },
  { char: 'w', color: 'text-text' },
  { char: 'D', color: 'text-brand' },
  { char: 'o', color: 'text-brand' },
]

// The title letters rise in one after another while the 3D logo loads.
function HeroTitle() {
  const titleRef = useRef(null)

  // useGSAP runs before the first paint (so there's no flash of the final text)
  // and cleans the animation up automatically when the component unmounts.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.title-letter', {
          yPercent: 60, // start a bit below
          opacity: 0,
          filter: 'blur(12px)',
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08, // delay between each letter
          delay: 0.15,
          lazy: false, // apply the hidden start state to every letter right away (no flash)
        })
      })

      // Reduced motion: a plain fade, no movement.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from(titleRef.current, { opacity: 0, duration: 0.6 })
      })
    },
    { scope: titleRef }, // '.title-letter' only matches inside this h1
  )

  return (
    // aria-label so screen readers read "FlowDo" as one word, not six letters.
    <h1
      ref={titleRef}
      aria-label="FlowDo"
      className="text-[clamp(64px,11vw,148px)] leading-[0.9] font-bold tracking-[-0.055em] text-shadow-[0_0_60px_rgba(99,102,241,0.35)]"
    >
      {TITLE_LETTERS.map((letter, index) => (
        <span key={index} aria-hidden="true" className={`title-letter inline-block ${letter.color}`}>
          {letter.char}
        </span>
      ))}
    </h1>
  )
}

// The four mascots around the logo (decoration only). They wait for the 3D logo,
// then rise in one after another. Each Mascot handles its own floating.
function HeroMascots({ show }) {
  const layerRef = useRef(null)

  useGSAP(
    () => {
      if (!show) return // logo not ready yet: stay hidden (Mascot starts at opacity 0)

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.mascot-entrance',
          { opacity: 0, y: 30 }, // start a little lower, invisible
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.12, // one after another
            delay: 0.3, // slightly after the logo starts fading in
          },
        )
      })

      // Reduced motion: just fade in, no rise.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.to('.mascot-entrance', { opacity: 1, duration: 0.6, delay: 0.3 })
      })
    },
    { scope: layerRef, dependencies: [show] }, // '.mascot-entrance' only matches inside this layer
  )

  return (
    // Covers the whole section, behind everything else (-z-10), and never catches clicks.
    // Hidden below 960px wide: there isn't room next to the logo there.
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden min-[960px]:block"
    >
      {/* Centred area the mascots are positioned in, so they don't drift apart on very wide screens */}
      <div className="relative mx-auto h-full max-w-[1320px]">
        {HERO_MASCOTS.map((mascot) => (
          <Mascot key={mascot.src} {...mascot} />
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const [sectionRef, inView] = useInView()
  const reducedMotion = usePrefersReducedMotion()

  // Becomes true when the model is ready (or failed), which fades the logo and glow in.
  const [logoReady, setLogoReady] = useState(false)
  const handleLogoReady = useCallback(() => setLogoReady(true), [])

  // Mouse position over the section, from -1 to 1 on each axis (0,0 = centre).
  // A ref, not state: it changes every mouse move and only the 3D loop reads it.
  const pointer = useRef({ x: 0, y: 0 })

  function handlePointerMove(event) {
    if (event.pointerType !== 'mouse') return // no drift on touch screens
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current = {
      x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1),
      y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1),
    }
  }

  function handlePointerLeave() {
    pointer.current = { x: 0, y: 0 }
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      // `isolate` lets the glow use -z-10 to sit behind the text but above the black background.
      // --logo-box is the 3D logo's size; the ring and the overlap below are sized from it.
      className="relative isolate flex [--logo-box:min(500px,90vw)] min-h-svh flex-col items-center justify-center overflow-hidden bg-bg px-4 py-16 text-center"
    >
      {/* First in the DOM so it paints under the glow and the text */}
      <HeroMascots show={logoReady} />

      <HeroTitle />

      {/* Logo box: the glow and tick ring are centred on it, so they always line up. */}
      <div className="relative size-(--logo-box)">
        {/* Glow + tick ring (decorative) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${logoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* The mask fades the colour out to black away from the logo */}
          <div className="absolute top-1/2 left-1/2 size-[820px] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,#000_45%,transparent_100%)]">
            <div className="hero-glow size-full rounded-full opacity-80 blur-[110px] motion-safe:animate-glow-spin" />
          </div>
          <div className="tick-ring absolute top-1/2 left-1/2 size-[calc(var(--logo-box)*0.72)] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Soft indigo shadow under the logo (decorative) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[8%] left-1/2 h-10 w-1/2 -translate-x-1/2 rounded-[50%] bg-[rgba(79,70,229,0.6)] blur-[28px] transition-opacity duration-1000 ${logoReady ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* The 3D logo */}
        <div
          role="img"
          aria-label="Flowdo app icon in 3D"
          className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${logoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Same-size empty box while the 3D code loads, so nothing jumps */}
          <Suspense fallback={<div className="size-full" />}>
            <SceneCanvas active={inView} onError={handleLogoReady}>
              <Logo3D
                pointer={pointer}
                reducedMotion={reducedMotion}
                onLoaded={handleLogoReady}
              />
            </SceneCanvas>
          </Suspense>
        </div>
      </div>

      {/* Negative margin: the subtitle tucks slightly under the logo, like the reference */}
      <p className="-mt-[calc(var(--logo-box)*0.09)] max-w-[520px] text-[19px] leading-relaxed text-muted">
        Pomodoro and Flowmodoro timer with your tasks built in. Free for Windows and Linux.
      </p>

      {/* One button per download. The first (the Windows installer) is the main, white one.
          Phones: stacked full-width. Wider screens: one centred row. */}
      <ul
        aria-label="Downloads"
        className="mt-4 flex w-full max-w-xs flex-col gap-3 sm:max-w-4xl sm:flex-row sm:flex-wrap sm:justify-center"
      >
        {DOWNLOADS.map((download, index) => (
          <li key={download.file}>
            <Button
              href={download.url}
              icon={PLATFORM_ICONS[download.platform]}
              variant={index === 0 ? 'primary' : 'secondary'}
              title={download.file}
              className="w-full sm:w-auto"
            >
              {download.label}
            </Button>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[13px] text-subtle">v{VERSION} · free and open source</p>
    </section>
  )
}
