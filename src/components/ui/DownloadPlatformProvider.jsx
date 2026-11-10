import { useCallback, useEffect, useMemo, useState } from 'react'
import { DownloadPlatformContext } from '../../context/downloadPlatform.js'
import { DEFAULT_PLATFORM, PLATFORMS } from '../../data/downloads.js'

// Reads a platform from a link like  /#download?platform=linux
function platformFromHash() {
  const match = window.location.hash.match(/^#download\?platform=(\w+)/)
  const id = match?.[1]
  return PLATFORMS.some((platform) => platform.id === id) ? id : null
}

function scrollToDownload() {
  const target = document.getElementById('download')
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

// Shares the selected download platform between the Hero and the Download section.
export default function DownloadPlatformProvider({ children }) {
  const [platform, setPlatform] = useState(() => platformFromHash() ?? DEFAULT_PLATFORM)

  // Opening the page with #download?platform=… scrolls there (the browser can't, since
  // no element has that id).
  useEffect(() => {
    if (platformFromHash()) scrollToDownload()
  }, [])

  const choosePlatform = useCallback((id, { scroll = false } = {}) => {
    setPlatform(id)
    if (scroll) {
      scrollToDownload()
      // Keep a shareable address, without adding a history entry.
      history.replaceState(null, '', `#download?platform=${id}`)
    }
  }, [])

  const value = useMemo(() => ({ platform, choosePlatform }), [platform, choosePlatform])

  return <DownloadPlatformContext.Provider value={value}>{children}</DownloadPlatformContext.Provider>
}
