import { createContext, useContext } from 'react'
import { DEFAULT_PLATFORM } from '../data/downloads.js'

// Which platform is selected in the Download section ('windows' | 'linux' | 'web').
// The Hero buttons change it (and scroll down), the Download tiles read and change it.
// The provider lives in src/components/ui/DownloadPlatformProvider.jsx.
export const DownloadPlatformContext = createContext({
  platform: DEFAULT_PLATFORM,
  choosePlatform: () => {},
})

// const { platform, choosePlatform } = useDownloadPlatform()
// choosePlatform('linux', { scroll: true }) selects Linux and scrolls to #download.
export function useDownloadPlatform() {
  return useContext(DownloadPlatformContext)
}
