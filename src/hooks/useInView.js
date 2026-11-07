import { useEffect, useRef, useState } from 'react'

// Tells you whether an element is on screen.
// Usage: const [ref, inView] = useInView()  ->  <section ref={ref}>
// `rootMargin` starts things a little before the element scrolls into view.
export default function useInView(rootMargin = '200px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
