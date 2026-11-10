import { lazy, Suspense, useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Button from '../components/ui/Button.jsx'
import Mascot from '../components/ui/Mascot.jsx'
import Aurora from '../components/ui/Aurora.jsx'
import Twinkles from '../components/ui/Twinkles.jsx'
import { ChevronIcon, PLATFORM_ICON } from '../components/ui/PlatformIcons.jsx'
import { useDownloadPlatform } from '../context/downloadPlatform.js'
import { DOWNLOAD_FORMATS, getPlatform, HERO_PLATFORM_ORDER, VERSION } from '../data/downloads.js'
import { HERO_TAGLINE, HERO_TITLE_LETTERS } from '../data/hero.js'
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

// The title letters rise in one after another while the 3D logo loads.
// "Do" shines: each of its letters animates on its own, so we measure the word and give
// every letter the same gradient width plus its own offset (see .shine-split in index.css).
function HeroTitle() {
  const titleRef = useRef(null)

  useLayoutEffect(() => {
    const title = titleRef.current
    const letters = [...title.querySelectorAll('.shine-split')]
    if (!letters.length) return

    function measure() {
      // offsetLeft ignores transforms, so GSAP's movement doesn't affect the numbers.
      const start = letters[0].offsetLeft
      const last = letters[letters.length - 1]
      const width = last.offsetLeft + last.offsetWidth - start
      for (const letter of letters) {
        letter.style.setProperty('--shine-w', `${width * 2}px`)
        letter.style.setProperty('--shine-x', `${start - letter.offsetLeft}px`)
      }
    }

    measure()
    document.fonts?.ready.then(measure) // re-measure once Plus Jakarta Sans has loaded
    const observer = new ResizeObserver(measure) // the size follows the viewport (clamp)
    observer.observe(title)
    return () => observer.disconnect()
  }, [])

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
    { scope: titleRef },
  )

  return (
    // aria-label so screen readers read "FlowDo" as one word, not six letters.
    <h1
      ref={titleRef}
      aria-label="FlowDo"
      className="text-[clamp(64px,11vw,148px)] leading-[0.95] font-bold tracking-[-0.055em] text-white text-shadow-[0_0_60px_rgba(99,102,241,0.4)]"
    >
      {HERO_TITLE_LETTERS.map((letter, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`title-letter inline-block ${letter.shine ? 'shine-split' : ''}`}
        >
          {letter.char}
        </span>
      ))}
    </h1>
  )
}

// The four mascots around the logo (decoration only, hidden at 960px and below).
// They wait for the 3D logo, then rise in one after another. Each one bobs on its own loop.
function HeroMascots({ show }) {
  const layerRef = useRef(null)

  useGSAP(
    () => {
      if (!show) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.mascot-entrance',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.3 },
        )
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.mascot-entrance', { opacity: 1 })
      })
    },
    { scope: layerRef, dependencies: [show] },
  )

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden min-[961px]:block"
    >
      <div className="relative mx-auto h-full max-w-[1440px]">
        {HERO_MASCOTS.map((mascot) => (
          <Mascot key={mascot.name} {...mascot} />
        ))}
      </div>
    </div>
  )
}

// Windows / Linux buttons scroll to #download and select that platform there.
// The Web app pill is not clickable yet.
function HeroDownloads() {
  const { choosePlatform } = useDownloadPlatform()

  function handleChoose(event, id) {
    event.preventDefault()
    choosePlatform(id, { scroll: true })
  }

  return (
    <div className="mt-7 flex flex-col items-center">
      <ul aria-label="Downloads" className="flex flex-wrap items-center justify-center gap-3.5">
        {HERO_PLATFORM_ORDER.map(getPlatform).map((platform) => {
          const Icon = PLATFORM_ICON[platform.id]

          if (platform.soon) {
            return (
              <li key={platform.id}>
                <span
                  role="link"
                  aria-disabled="true"
                  className="inline-flex h-14 items-center gap-2.5 rounded-full border border-dashed border-[rgba(165,180,252,0.35)] pr-3 pl-6 text-[17px] font-medium text-[#B9BEF5]/80"
                >
                  <Icon className="size-[18px]" />
                  {platform.name}
                  <span className="rounded-full bg-[rgba(99,102,241,0.2)] px-2.5 py-1 text-[12px] font-semibold text-indigo-200">
                    Soon
                  </span>
                </span>
              </li>
            )
          }

          return (
            <li key={platform.id}>
              <Button
                href={`#download?platform=${platform.id}`}
                onClick={(event) => handleChoose(event, platform.id)}
                variant={platform.id === 'windows' ? 'primary' : 'glass'}
                icon={<Icon className="size-[18px]" />}
              >
                {platform.name}
              </Button>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-[13px] text-subtle">
        v{VERSION} · {DOWNLOAD_FORMATS} ·{' '}
        <a
          href="#download"
          onClick={(event) => {
            event.preventDefault()
            document.getElementById('download')?.scrollIntoView({
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            })
          }}
          className="inline-flex min-h-11 items-center gap-0.5 rounded text-indigo-300 hover:text-white"
        >
          All download options
          <ChevronIcon className="size-3.5" />
        </a>
      </p>
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
      aria-label="Flowdo"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      // --logo-box is the 3D logo's size; the ring and the overlap below are sized from it.
      className={[
        'relative isolate flex min-h-[max(100svh,760px)] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center',
        '[--logo-box:min(500px,90vw)]',
        'bg-[radial-gradient(90%_70%_at_50%_45%,#1E1B6B,#0D0B2B_45%,#050409_80%)]',
        inView ? '' : 'loops-paused',
      ].join(' ')}
    >
      <Aurora
        blobs={[
          { top: '-15%', left: '-10%', size: '560px', color: 'rgba(99,102,241,0.35)' },
          { top: '40%', left: '70%', size: '620px', color: 'rgba(79,70,229,0.3)' },
          { top: '70%', left: '-5%', size: '480px', color: 'rgba(129,140,248,0.3)' },
        ]}
      />
      <Twinkles />

      {/* First in the DOM so it paints under the glow and the text */}
      <HeroMascots show={logoReady} />

      <HeroTitle />

      {/* Logo box: the glow and tick ring are centred on it, so they always line up. */}
      <div className="relative -mt-2 size-(--logo-box)">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-[1600ms] ease-reveal ${logoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Rotating conic indigo glow, faded out toward its edges */}
          <div className="absolute top-1/2 left-1/2 size-[820px] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,#000_45%,transparent_100%)]">
            <div className="size-full rounded-full bg-[conic-gradient(#6366F1,#818CF8,#4338CA,#A5B4FC,#4F46E5,#6366F1)] opacity-80 blur-[110px] motion-safe:animate-glow-spin" />
          </div>
          {/* Dark vignette over the glow */}
          <div className="absolute top-1/2 left-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,transparent_45%,rgba(5,4,9,0.55)_80%,transparent_100%)]" />
          {/* Fine tick ring */}
          <div className="tick-ring absolute top-1/2 left-1/2 size-[min(510px,92vw)] -translate-x-1/2 -translate-y-1/2 max-[960px]:size-[min(420px,92vw)]" />
        </div>

        {/* Soft indigo shadow under the logo (decorative) */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[8%] left-1/2 h-10 w-1/2 -translate-x-1/2 rounded-[50%] bg-[rgba(79,70,229,0.6)] blur-[28px] transition-opacity duration-1000 ${logoReady ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* The 3D logo (unchanged) */}
        <div
          role="img"
          aria-label="Flowdo app icon in 3D"
          className={`absolute inset-0 transition-opacity duration-1000 ease-reveal ${logoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <Suspense fallback={<div className="size-full" />}>
            <SceneCanvas active={inView} onError={handleLogoReady}>
              <Logo3D pointer={pointer} reducedMotion={reducedMotion} onLoaded={handleLogoReady} />
            </SceneCanvas>
          </Suspense>
        </div>
      </div>

      {/* Negative margin: the tagline tucks slightly under the logo, like the design */}
      <p className="-mt-[calc(var(--logo-box)*0.08)] max-w-[600px] text-[clamp(17px,1.5vw,21px)] leading-relaxed text-muted">
        {HERO_TAGLINE}
      </p>

      <HeroDownloads />
    </section>
  )
}
