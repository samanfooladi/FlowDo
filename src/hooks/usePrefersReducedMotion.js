import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// true when the user asked their OS for less motion. Updates live if they change it.
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
