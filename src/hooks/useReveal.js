import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase)

// Same curve as CSS cubic-bezier(.22, 1, .36, 1).
const REVEAL_EASE = CustomEase.create('reveal', 'M0,0 C0.22,1 0.36,1 1,1')

// data-reveal="0" | "1" | "2" | "3"  ->  delay 0s, 0.12s, 0.24s, 0.38s
const DELAYS = [0, 0.12, 0.24, 0.38]

// Scroll reveal for a section: every element inside `scopeRef` with a `data-reveal`
// attribute rises 36px and fades in over 1s, once, when 20% of the way into the screen.
// With reduced motion nothing animates: the content is simply there.
//
// Usage:
//   const ref = useRef(null)
//   useReveal(ref)
//   <section ref={ref}><h2 data-reveal="0">…</h2><p data-reveal="1">…</p></section>
//
// Tip: put data-reveal on a wrapper, not on an element that has its own transform
// (hover lift, CSS loop), so the two don't fight.
export default function useReveal(scopeRef) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('[data-reveal]', scopeRef.current).forEach((element) => {
          const step = Number(element.dataset.reveal) || 0
          gsap.from(element, {
            y: 36,
            opacity: 0,
            duration: 1,
            ease: REVEAL_EASE,
            delay: DELAYS[Math.min(step, DELAYS.length - 1)],
            scrollTrigger: { trigger: element, start: 'top 80%', once: true },
          })
        })
      })
    },
    { scope: scopeRef },
  )
}
