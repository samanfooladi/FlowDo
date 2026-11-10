import { About, Download, Features, Footer, Hero, TaskStrip, TimelineStrip } from './sections'
import DownloadPlatformProvider from './components/ui/DownloadPlatformProvider.jsx'

// The page, top to bottom. To add a section: create src/sections/MySection.jsx,
// export it from src/sections/index.js and place it in this list.
const SECTION_ORDER = [Hero, TimelineStrip, About, TaskStrip, Features, Download]

export default function App() {
  return (
    <DownloadPlatformProvider>
      <main>
        {SECTION_ORDER.map((Section) => (
          <Section key={Section.name} />
        ))}
      </main>
      {/* The footer comes last, outside <main>, so it stays its own landmark. */}
      <Footer />
    </DownloadPlatformProvider>
  )
}
