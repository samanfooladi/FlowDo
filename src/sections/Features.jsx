import { useEffect, useState } from 'react'
import TaskDemo from '../components/features/TaskDemo.jsx'
import FeatureCard from '../components/features/FeatureCard.jsx'
import {
  DeadlinesVisual,
  PriorityVisual,
  ProjectsVisual,
  SubtasksVisual,
} from '../components/features/FeatureVisuals.jsx'
import Aurora from '../components/ui/Aurora.jsx'
import Twinkles from '../components/ui/Twinkles.jsx'
import MascotImage from '../components/ui/MascotImage.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import ShineText from '../components/ui/ShineText.jsx'
import { DEMO_TASKS, FEATURES, FEATURES_INTRO, FEATURES_MASCOT_LABEL } from '../data/features.js'
import useInView from '../hooks/useInView.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import useReveal from '../hooks/useReveal.js'

const TICK_EVERY = 1400 // ms between ticking off one task and the next
const HOLD_STEPS = 2 // after the last task, wait this many ticks before starting over
const TOTAL_STEPS = DEMO_TASKS.length + 1 + HOLD_STEPS // 0..5 ticked, then 2 holds
const REDUCED_MOTION_DONE = 2 // the still picture shown with reduced motion

// Which little picture goes on top of each card (keys match `id` in src/data/features.js).
const FEATURE_VISUALS = {
  projects: <ProjectsVisual />,
  subtasks: <SubtasksVisual />,
  deadlines: <DeadlinesVisual />,
  priority: <PriorityVisual />,
}

export default function Features() {
  const [sectionRef, inView] = useInView('-10% 0px')
  const reducedMotion = usePrefersReducedMotion()
  useReveal(sectionRef)

  // The tick loop: one more task every 1.4s, only while the section is on screen.
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!inView || reducedMotion) return
    const timer = setInterval(() => setStep((current) => (current + 1) % TOTAL_STEPS), TICK_EVERY)
    return () => clearInterval(timer)
  }, [inView, reducedMotion])

  const done = reducedMotion ? REDUCED_MOTION_DONE : Math.min(step, DEMO_TASKS.length)
  const allDone = done === DEMO_TASKS.length

  return (
    <section
      ref={sectionRef}
      id="features"
      aria-labelledby="features-title"
      className={`relative isolate overflow-hidden bg-base px-4 pt-[clamp(96px,10vw,150px)] pb-[clamp(96px,10vw,150px)] ${inView ? '' : 'loops-paused'}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(165,180,252,0.3),transparent)]"
      />
      <Aurora
        blobs={[
          { top: '-10%', left: '65%', size: '620px', color: 'rgba(79,70,229,0.36)' },
          { top: '45%', left: '-15%', size: '540px', color: 'rgba(67,56,202,0.38)' },
          { top: '75%', left: '55%', size: '460px', color: 'rgba(99,102,241,0.3)' },
        ]}
      />
      <Twinkles />

      <div className="relative mx-auto max-w-[1120px]">
        <SectionHeading
          id="features-title"
          title={
            <>
              Organize the work. <ShineText>Then get it done.</ShineText>
            </>
          }
          intro={FEATURES_INTRO}
          className="max-w-[760px]"
        />

        {/* Stage: task demo on the left, mascot on the right (stacked at 960px and below) */}
        <div data-reveal="2" className="mt-14">
          <div className="glass rounded-[28px] p-4 sm:p-8">
            <div className="flex flex-col items-center gap-10 min-[961px]:flex-row min-[961px]:gap-8">
              <div className="w-full min-w-0 flex-1">
                <TaskDemo done={done} />
              </div>

              <div className="relative flex w-full max-w-[440px] shrink-0 flex-col items-center min-[961px]:w-[380px] xl:w-[440px]">
                {/* Label above the mascot */}
                <p
                  aria-hidden="true"
                  className={`mb-4 rounded-full border px-4 py-1.5 text-[14px] font-semibold transition-colors duration-500 ${allDone ? 'border-[rgba(52,211,153,0.45)] bg-[rgba(52,211,153,0.12)] text-break-light' : 'border-[rgba(129,140,248,0.3)] bg-[rgba(99,102,241,0.12)] text-indigo-200'}`}
                >
                  {allDone ? FEATURES_MASCOT_LABEL.done : FEATURES_MASCOT_LABEL.working}
                </p>

                <div className="relative w-full">
                  <div
                    aria-hidden="true"
                    className="absolute bottom-2 left-1/2 h-8 w-4/5 -translate-x-1/2 rounded-[50%] bg-[rgba(67,56,202,0.5)] blur-[22px]"
                  />
                  {/* Desk mascot while working... */}
                  <div className={`transition-opacity duration-500 ${allDone ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="loop-bob" style={{ '--bob': '6px', '--dur': '3.6s' }}>
                      <MascotImage
                        name="desk"
                        className="h-auto !w-full drop-shadow-[0_20px_34px_rgba(67,56,202,0.35)]"
                      />
                    </div>
                  </div>
                  {/* ...cheering when every task is done: pops up with a slight overshoot */}
                  <div
                    className={`absolute inset-0 flex items-end justify-center transition-[opacity,transform] duration-500 ease-pop ${allDone ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-6 scale-90 opacity-0'}`}
                  >
                    <MascotImage
                      name="cheer"
                      className="h-[92%] drop-shadow-[0_20px_34px_rgba(67,56,202,0.35)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards: 1 column on phones, 2 on tablets, 4 from 1024px */}
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              data-reveal={index}
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
