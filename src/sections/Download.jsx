import Aurora from '../components/ui/Aurora.jsx'
import Twinkles from '../components/ui/Twinkles.jsx'
import Button from '../components/ui/Button.jsx'
import MascotImage from '../components/ui/MascotImage.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ShineText from '../components/ui/ShineText.jsx'
import { ChevronIcon, PLATFORM_ICON } from '../components/ui/PlatformIcons.jsx'
import { useDownloadPlatform } from '../context/downloadPlatform.js'
import { DOWNLOAD_INTRO } from '../data/download.js'
import { getPlatform, PLATFORMS, RELEASES_URL, VERSION } from '../data/downloads.js'
import useInView from '../hooks/useInView.js'
import useReveal from '../hooks/useReveal.js'

// One platform tile. Clicking it selects that platform (aria-pressed).
function PlatformTile({ platform, selected, onSelect }) {
  const Icon = PLATFORM_ICON[platform.id]

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-controls="download-versions"
      onClick={onSelect}
      className={[
        'flex h-full w-full flex-col rounded-[24px] border p-6 text-left transition-[transform,box-shadow,background-color,border-color] duration-300 hover:-translate-y-1 sm:p-7',
        selected
          ? 'border-[rgba(199,210,254,0.6)] bg-[linear-gradient(160deg,#6366F1,#4338CA)] shadow-[0_0_0_6px_rgba(99,102,241,0.18),0_30px_70px_rgba(67,56,202,0.5)]'
          : 'border-[rgba(129,140,248,0.22)] bg-[rgba(99,102,241,0.07)] backdrop-blur-[16px] hover:border-[rgba(129,140,248,0.4)]',
      ].join(' ')}
    >
      <span className="flex w-full items-center justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-white/15 text-white">
          <Icon className="size-5" />
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold text-white/90">
          {platform.badge}
        </span>
      </span>
      <span className="mt-6 text-[26px] font-bold tracking-[-0.03em] text-white">{platform.name}</span>
      <span className={`mt-2 text-[15px] leading-relaxed ${selected ? 'text-white/85' : 'text-muted'}`}>
        {platform.sub}
      </span>
      <span className="mt-auto flex items-center gap-1.5 pt-7 text-[15px] font-semibold text-white">
        {platform.cta}
        <ChevronIcon className={`size-4 transition-transform duration-300 ${selected ? 'rotate-180' : ''}`} />
      </span>
    </button>
  )
}

export default function Download() {
  const [sectionRef, inView] = useInView()
  useReveal(sectionRef)
  const { platform: selectedId, choosePlatform } = useDownloadPlatform()
  const selected = getPlatform(selectedId)

  return (
    <section
      ref={sectionRef}
      id="download"
      aria-labelledby="download-title"
      className={`relative isolate overflow-hidden bg-[radial-gradient(80%_70%_at_50%_60%,#2B2899,#13113F_45%,#050409_85%)] px-4 pt-[clamp(96px,10vw,150px)] pb-[clamp(96px,10vw,140px)] ${inView ? '' : 'loops-paused'}`}
    >
      <Aurora
        blobs={[
          { top: '5%', left: '-12%', size: '520px', color: 'rgba(99,102,241,0.35)' },
          { top: '30%', left: '68%', size: '560px', color: 'rgba(79,70,229,0.34)' },
          { top: '78%', left: '40%', size: '480px', color: 'rgba(236,72,153,0.18)' },
        ]}
      />
      {/* Dot-grid texture, masked to the centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(199,210,254,0.18)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(50%_45%_at_50%_55%,#000,transparent)]"
      />
      {/* Indigo glow behind the mascot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[38%] left-1/2 -z-10 size-[700px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(99,102,241,0.35),transparent)]"
      />
      <Twinkles />

      {/* Easter egg: a mascot peeking in from the right edge. The image's right side is the wall. */}
      <div aria-hidden="true" className="pointer-events-none absolute top-[30%] right-0">
        <div className="loop-peek">
          <MascotImage name="peek" className="h-[300px] max-[960px]:h-[200px]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1120px]">
        <SectionHeading
          id="download-title"
          align="center"
          size="text-[clamp(48px,6.4vw,92px)] font-extrabold"
          title={
            <>
              Grab a coffee.
              <br />
              <ShineText>Then start focusing.</ShineText>
            </>
          }
          intro={DOWNLOAD_INTRO}
        />

        {/* Coffee mascot over a slowly turning tick ring; overlaps the tiles by 22px */}
        <div data-reveal="2" className="relative z-10 mx-auto -mb-[22px] mt-10 flex h-[360px] w-full max-w-[360px] items-end justify-center max-[960px]:h-[290px]">
          <div
            aria-hidden="true"
            className="tick-ring absolute top-1/2 left-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 motion-safe:animate-ring-spin max-[960px]:size-[290px]"
          />
          <div className="loop-bob relative" style={{ '--bob': '5px', '--dur': '4s' }}>
            {/* Steam puffs rising from the cup */}
            <div aria-hidden="true" className="absolute top-[34%] left-[39%] z-10">
              {[0, 0.9, 1.8].map((delay, index) => (
                <span
                  key={index}
                  className="loop-steam absolute size-3 rounded-full bg-white/70 opacity-0 blur-[3px]"
                  style={{ left: `${index * 9 - 9}px`, '--delay': `${-delay}s` }}
                />
              ))}
            </div>
            <MascotImage
              name="coffee"
              className="h-[330px] drop-shadow-[0_22px_36px_rgba(67,56,202,0.45)] max-[960px]:h-[260px]"
            />
          </div>
        </div>

        {/* Platform tiles */}
        <ul className="relative mx-auto grid max-w-[1000px] gap-4 md:grid-cols-3">
          {PLATFORMS.map((platform, index) => (
            <li key={platform.id} data-reveal={index + 1}>
              <PlatformTile
                platform={platform}
                selected={platform.id === selectedId}
                onSelect={() => choosePlatform(platform.id)}
              />
            </li>
          ))}
        </ul>

        {/* Version buttons for the selected platform */}
        <div
          id="download-versions"
          aria-live="polite"
          className="mx-auto mt-8 flex min-h-12 max-w-[1000px] flex-wrap items-center justify-center gap-3"
        >
          {selected.files ? (
            selected.files.map((file) => (
              <Button
                key={file.label}
                href={file.url}
                size="md"
                variant={file.recommended ? 'primary' : 'glass'}
                className={file.recommended ? 'shadow-[0_0_0_4px_rgba(99,102,241,0.28)]' : ''}
              >
                {file.ext ? `${file.label} ${file.ext}` : file.label}
                {file.recommended && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                    Recommended
                  </span>
                )}
              </Button>
            ))
          ) : (
            <p className="text-[15px] text-indigo-200">{selected.note}</p>
          )}
        </div>

        <p className="mt-8 text-center text-[14px] text-muted">
          Latest version v{VERSION} ·{' '}
          <a
            href={RELEASES_URL}
            className="inline-flex min-h-11 items-center rounded text-indigo-200 underline underline-offset-4 hover:text-white"
          >
            See all releases on GitHub
          </a>
        </p>
      </div>
    </section>
  )
}
