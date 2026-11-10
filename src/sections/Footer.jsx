import Aurora from '../components/ui/Aurora.jsx'
import Twinkles from '../components/ui/Twinkles.jsx'
import MascotImage from '../components/ui/MascotImage.jsx'
import { FOOTER_LINK_GROUPS, FOOTER_NOTE, FOOTER_TAGLINE } from '../data/footer.js'
import useInView from '../hooks/useInView.js'

// Links to a section on this page (href="#something") scroll there smoothly.
// Without JavaScript the plain href still works.
function scrollToSection(event) {
  const id = event.currentTarget.getAttribute('href').slice(1)
  const target = document.getElementById(id)
  if (!target) return

  event.preventDefault()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  history.pushState(null, '', `#${id}`)
}

const LINK_CLASS =
  'inline-flex min-h-11 items-center rounded text-[17px] text-muted transition-colors duration-200 hover:text-white'

export default function Footer() {
  const [ref, inView] = useInView()

  return (
    <footer
      ref={ref}
      className={`relative isolate overflow-hidden bg-[linear-gradient(180deg,#050409,#0A0920)] px-4 pb-9 ${inView ? '' : 'loops-paused'}`}
    >
      <Aurora
        className="opacity-60"
        blobs={[
          { top: '-30%', left: '-10%', size: '480px', color: 'rgba(79,70,229,0.4)' },
          { top: '10%', left: '70%', size: '460px', color: 'rgba(99,102,241,0.3)' },
          { top: '60%', left: '35%', size: '380px', color: 'rgba(67,56,202,0.3)' },
        ]}
      />
      <Twinkles />

      <div className="relative mx-auto max-w-[1120px] border-t border-[rgba(129,140,248,0.22)] pt-14 pb-12">
        <div className="flex flex-col justify-between gap-12 min-[961px]:flex-row">
          <div>
            <a
              href="#top"
              onClick={scrollToSection}
              aria-label="Flowdo, back to top"
              className="inline-block rounded-md"
            >
              <img src="/assets/flowdo-logo.svg" width={118} height={32} alt="" className="h-8 w-auto" draggable={false} />
            </a>
            <p className="mt-5 max-w-[380px] text-[17px] leading-relaxed text-muted">{FOOTER_TAGLINE}</p>
          </div>

          <div className="flex gap-16 pr-0 sm:gap-40 min-[961px]:pr-4">
            {FOOTER_LINK_GROUPS.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="text-[14px] font-bold tracking-[0.16em] text-white uppercase">{group.title}</h2>
                <ul className="mt-3 flex flex-col">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={link.href.startsWith('#') ? scrollToSection : undefined}
                        className={LINK_CLASS}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="mt-14 max-w-[60%] text-[15px] text-muted max-[960px]:max-w-[calc(100%-120px)]">{FOOTER_NOTE}</p>

        {/* Waving mascot, between the two link columns on desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[165px] bottom-[-36px] max-[960px]:right-0 max-[960px]:bottom-[-24px]"
        >
          <div className="loop-sway">
            <MascotImage
              name="wave"
              className="h-[190px] drop-shadow-[0_0_24px_rgba(99,102,241,0.35)] max-[960px]:h-[140px]"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
