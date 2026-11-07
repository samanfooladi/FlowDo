import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import TaskDemo from '../components/features/TaskDemo.jsx'
import FeatureCard from '../components/features/FeatureCard.jsx'
import {
  DeadlinesVisual,
  PriorityVisual,
  ProjectsVisual,
  SubtasksVisual,
} from '../components/features/FeatureVisuals.jsx'
import { FEATURES } from '../data/features.js'
import useInView from '../hooks/useInView.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Which little picture goes on top of each card (keys match `id` in src/data/features.js).
const FEATURE_VISUALS = {
  projects: <ProjectsVisual />,
  subtasks: <SubtasksVisual />,
  deadlines: <DeadlinesVisual />,
  priority: <PriorityVisual />,
}

export default function Features() {
  // One ref for the <section>: useInView watches it and GSAP uses it as its scope.
  const [sectionRef, inView] = useInView()
  const reducedMotion = usePrefersReducedMotion()
  const mascotImgRef = useRef(null)

  // Becomes true once the entrance animation has finished; the task ticking waits for it.
  const [entered, setEntered] = useState(false)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The gentle "typing" bob, created paused. It starts when the entrance is done.
        // It moves the <img>, while the entrance moves its wrapper, so the two never clash.
        const bob = gsap.to(mascotImgRef.current, {
          y: -6,
          duration: 1.8,
          ease: 'sine.inOut',
          yoyo: true, // back down the same way
          repeat: -1, // forever
          paused: true,
        })

        // Heading + showcase stage. Plays once, when the top of the section
        // reaches 75% of the way down the screen.
        gsap
          .timeline({
            defaults: { ease: 'expo.out', duration: 1 },
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
            onComplete: () => {
              bob.play()
              setEntered(true) // lets TaskDemo start ticking
            },
          })
          .from('.features-rise', { y: 30, opacity: 0, stagger: 0.1 }) // eyebrow, h2, paragraph
          .from('.features-stage', { y: 40, opacity: 0 }, '-=0.7') // '-=0.7' = overlap the previous step
          .from('.features-demo', { x: -40, opacity: 0 }, '-=0.75') // task list slides in from the left
          .from('.features-mascot', { y: 60, opacity: 0, duration: 1.2 }, '-=0.8') // mascot rises, just after

        // The cards are far below the heading (especially on phones), so they get
        // their own trigger and fade up one after another when they reach the screen.
        gsap.from('.features-card', {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.features-cards', start: 'top 75%', once: true },
        })
      })

      // Reduced motion: everything just fades in, no movement and no bob.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.features-rise, .features-stage, .features-demo, .features-mascot', {
          opacity: 0,
          duration: 0.6,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        })
        gsap.from('.features-card', {
          opacity: 0,
          duration: 0.6,
          scrollTrigger: { trigger: '.features-cards', start: 'top 75%', once: true },
        })
      })
    },
    { scope: sectionRef }, // class selectors above only match inside this section
  )

  return (
    <section
      ref={sectionRef}
      id="features"
      aria-labelledby="features-title"
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
          <p className="features-rise text-[13px] font-semibold tracking-[0.16em] text-brand">
            FEATURES
          </p>
          <h2
            id="features-title"
            className="features-rise mt-4 text-[clamp(40px,5.2vw,68px)] leading-[1.03] font-bold tracking-[-0.04em]"
          >
            Organize the work. <span className="text-brand">Then get it done.</span>
          </h2>
          <p className="features-rise mt-6 max-w-[620px] text-[19px] leading-relaxed text-muted">
            Group tasks into projects, break big ones into steps, set deadlines and priorities.
            Then pick one and start the timer.
          </p>
        </div>

        {/* 2. Showcase stage: task demo on the left, mascot on the right.
            Below 900px wide they stack: demo first, mascot underneath. */}
        <div className="features-stage relative isolate mt-16 overflow-hidden rounded-[32px] border border-white/8 bg-[#050507] p-4 sm:p-8 lg:p-12">
          {/* Soft indigo glow toward the bottom-right corner (decorative) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_95%,rgba(99,102,241,0.22),transparent_60%)]"
          />

          <div className="flex flex-col items-center gap-12 min-[900px]:flex-row min-[900px]:gap-10">
            <div className="features-demo w-full min-w-0 flex-1">
              <TaskDemo playing={entered && inView} reducedMotion={reducedMotion} />
            </div>

            {/* Mascot column: 440px on wide screens, a bit narrower on laptops so the task
                list keeps enough room. The wrapper does the entrance; the <img> does the bob. */}
            <div className="features-mascot relative w-full max-w-[440px] shrink-0 min-[900px]:w-[340px] xl:w-[440px]">
              {/* Soft blurred shadow under the desk (decorative) */}
              <div
                aria-hidden="true"
                className="absolute bottom-2 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-[50%] bg-[rgba(67,56,202,0.5)] blur-[22px]"
              />
              <img
                ref={mascotImgRef}
                src="/assets/mascot/flowdo-mascot-6-desk.webp"
                width={564}
                height={720}
                alt="Flowdo's mascot typing on a laptop at his desk"
                draggable={false}
                loading="lazy"
                decoding="async"
                className="relative h-auto w-full drop-shadow-[0_20px_34px_rgba(67,56,202,0.35)] select-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Feature cards: 1 column on phones, 2 on tablets and small laptops, 4 on desktops (1280px+) */}
        <ul className="features-cards mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              className="features-card"
              title={feature.title}
              text={feature.text}
              visual={FEATURE_VISUALS[feature.id]}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
