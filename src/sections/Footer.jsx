import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Button from '../components/ui/Button.jsx'
import { LinuxIcon, WindowsIcon } from '../components/ui/PlatformIcons.jsx'
import { DOWNLOADS, VERSION } from '../data/downloads.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const GITHUB_URL = 'https://github.com/navidh0/Flowdo'

// The first download is the recommended one (the Windows installer): it gets the big button.
// The rest become the small chips. Everything comes from src/data/downloads.js,
// so a new release only needs a change there.
const [MAIN_DOWNLOAD, ...OTHER_DOWNLOADS] = DOWNLOADS

// Small icon for a chip, picked by the `platform` field in downloads.js.
function PlatformIcon({ platform, className }) {
  return platform === 'windows' ? <WindowsIcon className={className} /> : <LinuxIcon className={className} />
}

// The two link columns. `href` starting with "#" = a section on this page.
const LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Features', href: '#features' },
      { label: 'Download', href: '#top' }, // the Hero, where the download buttons are
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'All releases', href: `${GITHUB_URL}/releases` },
      { label: 'Report an issue', href: `${GITHUB_URL}/issues` },
    ],
  },
]

// Click handler for links to a section on this page (href="#something").
// It scrolls there smoothly instead of jumping. Without JavaScript the plain href still works.
function scrollToSection(event) {
  const id = event.currentTarget.getAttribute('href').slice(1) // "#top" -> "top"
  const target = document.getElementById(id)
  if (!target) return // not found: let the browser handle the link normally

  event.preventDefault()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  history.pushState(null, '', `#${id}`) // keep the address bar in sync, like a normal link
}

// Shared look for every footer link: muted, white on hover, at least 24px tall.
const LINK_CLASS =
  'inline-flex min-h-6 items-center text-[15px] text-muted transition-colors duration-200 hover:text-text focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-light'

function FooterLink({ href, children }) {
  const isOnPage = href.startsWith('#')
  return (
    <a href={href} onClick={isOnPage ? scrollToSection : undefined} className={LINK_CLASS}>
      {children}
    </a>
  )
}

export default function Footer() {
  const footerRef = useRef(null)
  const mascotImgRef = useRef(null)
  const ringRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The endless float, created paused. It starts when the mascot has landed.
        // It moves the <img>, while the entrance moves its wrapper, so they never clash.
        gsap.set(mascotImgRef.current, { rotation: -1.5 }) // start tilted one way...
        const float = gsap.to(mascotImgRef.current, {
          y: -14,
          rotation: 1.5, // ...and tilt the other way at the top
          duration: 2.8,
          ease: 'sine.inOut',
          yoyo: true, // back down the same way
          repeat: -1, // forever
          paused: true,
        })

        // The tick ring behind him: one full turn every 60 seconds, forever.
        gsap.to(ringRef.current, { rotation: 360, duration: 60, ease: 'none', repeat: -1 })

        // Card entrance. Plays once, when the top of the card reaches 80% down the screen.
        gsap
          .timeline({
            defaults: { ease: 'expo.out', duration: 1 },
            scrollTrigger: { trigger: '.footer-card', start: 'top 80%', once: true },
            onComplete: () => float.play(),
          })
          .from('.footer-card', { y: 40, opacity: 0 })
          .from('.footer-rise', { y: 24, opacity: 0, stagger: 0.08 }, '-=0.75') // heading, text, buttons, chips
          // The mascot drops in from above with a little bounce, slightly after the card.
          .from('.footer-mascot', { y: -40, opacity: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0.3)

        // The giant "FlowDo" rises into view while you scroll through the footer.
        // scrub: true ties the animation to the scrollbar, so it moves back if you scroll up.
        gsap.fromTo(
          '.footer-wordmark',
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top bottom', // footer's top enters the screen
              end: 'bottom bottom', // you reach the very end of the page
              scrub: true,
            },
          },
        )
      })

      // Reduced motion: everything just fades in once. No bounce, float, rotation or scrub.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.footer-card, .footer-mascot', {
          opacity: 0,
          duration: 0.6,
          scrollTrigger: { trigger: '.footer-card', start: 'top 80%', once: true },
        })
        gsap.from('.footer-wordmark', {
          opacity: 0,
          duration: 0.6,
          scrollTrigger: { trigger: '.footer-wordmark', start: 'top bottom', once: true },
        })
      })
    },
    { scope: footerRef }, // class selectors above only match inside this footer
  )

  return (
    // overflow-hidden clips the bottom of the giant wordmark at the page's edge.
    <footer ref={footerRef} className="relative overflow-hidden bg-bg px-4 pt-[160px] pb-10">
      <div className="mx-auto max-w-[1120px]">
        {/* 1. Final call-to-action card */}
        <section
          aria-labelledby="footer-cta-title"
          className={[
            'footer-card relative rounded-[36px] border border-[rgba(129,140,248,0.35)] px-6 py-10 sm:px-10 sm:py-12 min-[900px]:px-14 min-[900px]:py-16',
            // Indigo glow on the right, over a dark top-to-bottom gradient
            'bg-[radial-gradient(ellipse_at_80%_45%,rgba(99,102,241,0.35),transparent_60%),linear-gradient(180deg,#0B0B14,#050507)]',
            'shadow-[0_0_0_8px_rgba(99,102,241,0.06),0_40px_120px_rgba(67,56,202,0.25)]',
          ].join(' ')}
        >
          {/* Two columns from 900px; below that the mascot sits above the text. */}
          <div className="flex flex-col items-center gap-10 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-8">
            {/* LEFT: text and downloads */}
            <div className="min-w-0 flex-1">
              <h2
                id="footer-cta-title"
                className="footer-rise text-[clamp(36px,4.6vw,60px)] leading-[1.05] font-bold tracking-[-0.04em]"
              >
                Grab a coffee. <span className="text-[#818CF8]">Start your first focus round.</span>
              </h2>

              <p className="footer-rise mt-6 max-w-[480px] text-[18px] leading-relaxed text-muted">
                Flowdo is free for Windows and Linux. Download it, pick a task, and you're focusing
                in under a minute.
              </p>

              {/* Main download button + version note */}
              <div className="footer-rise mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button href={MAIN_DOWNLOAD.url} icon={<WindowsIcon />} title={MAIN_DOWNLOAD.file}>
                  Download for Windows
                </Button>
                <p className="text-[13px] text-subtle">v{VERSION} · Installer for Windows 10 and 11</p>
              </div>

              {/* The other downloads, as small chips */}
              <div className="footer-rise mt-7 flex flex-wrap items-center gap-2">
                <p className="mr-1 text-[14px] text-subtle">Other downloads:</p>
                <ul aria-label="Other downloads" className="flex flex-wrap gap-2">
                  {OTHER_DOWNLOADS.map((download) => (
                    <li key={download.file}>
                      <a
                        href={download.url}
                        title={download.file}
                        className="inline-flex h-9 items-center gap-2 rounded-full bg-white/5 px-3.5 text-[14px] font-medium text-text/90 transition-colors duration-200 hover:bg-white/10 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                      >
                        <PlatformIcon platform={download.platform} className="size-3.5" />
                        {download.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={GITHUB_URL}
                className="footer-rise mt-7 inline-block text-[15px] text-brand-light underline underline-offset-4 transition-colors hover:text-text focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-light"
              >
                Or view the source on GitHub
              </a>
            </div>

            {/* RIGHT: the mascot. On phones `order-first` puts him above the text.
                From 900px he sits on the right, centred top-to-bottom inside the card. */}
            <div className="footer-mascot relative order-first flex w-full shrink-0 justify-center min-[900px]:order-none min-[900px]:w-[340px]">
              {/* Slowly turning tick ring behind him (decorative). Centred with inset + margin
                  instead of a transform, so GSAP's rotation doesn't fight the centring. */}
              <div
                ref={ringRef}
                aria-hidden="true"
                className="tick-ring pointer-events-none absolute inset-0 m-auto size-[260px] opacity-95 min-[900px]:size-[360px]"
              />
              <img
                ref={mascotImgRef}
                src="/assets/mascot/flowdo-mascot-7-coffee.webp"
                width={424}
                height={720}
                alt="Flowdo's mascot hugging a big Flowdo coffee cup"
                draggable={false}
                loading="lazy"
                decoding="async"
                // The height sets the size; the width follows the image's shape (424×720).
                className="relative h-[280px] w-auto max-w-none drop-shadow-[0_22px_36px_rgba(67,56,202,0.45)] select-none min-[900px]:h-[340px]"
              />
            </div>
          </div>
        </section>

        {/* 2. Link area: brand on the left, link columns on the right. Wraps on small screens. */}
        <div className="mt-24 flex flex-wrap justify-between gap-16">
          <div>
            <a
              href="#top"
              onClick={scrollToSection}
              aria-label="Flowdo home"
              className="inline-block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-light"
            >
              <img src="/assets/flowdo-logo.svg" width={118} height={32} alt="" draggable={false} />
            </a>
            <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-muted">
              A focus timer and a to-do list in one desktop app. Pomodoro or Flowmodoro, your choice.
            </p>
          </div>

          <div className="flex flex-wrap gap-16 sm:gap-24">
            {LINK_GROUPS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="text-[13px] font-semibold tracking-[0.12em] text-text uppercase">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* 3. Bottom row */}
        <div className="mt-20 flex items-center justify-between gap-4 border-t border-white/8 pt-4 text-[14px] text-subtle">
          <p>© {new Date().getFullYear()} Flowdo</p>
          <a
            href="#top"
            onClick={scrollToSection}
            className="inline-flex min-h-11 items-center gap-1.5 transition-colors duration-200 hover:text-text focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>

        {/* 4. Giant outlined wordmark (decorative). The negative bottom margin pushes its
            lower part past the footer's bottom edge, where overflow-hidden cuts it off. */}
        <p
          aria-hidden="true"
          className="footer-wordmark mt-10 mb-[calc(-0.2em-40px)] text-center text-[clamp(96px,19vw,280px)] leading-none font-bold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgba(129,140,248,0.22)]"
        >
          FlowDo
        </p>
      </div>
    </footer>
  )
}
