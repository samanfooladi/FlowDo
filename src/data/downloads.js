// Everything about the current release lives here.
// For a new version, update VERSION (and the file URLs once they point at real files).

export const VERSION = '0.5.3'

export const GITHUB_URL = 'https://github.com/samanfooladi/Flowdo'
export const RELEASES_URL = `${GITHUB_URL}/releases`
export const ISSUES_URL = `${GITHUB_URL}/issues`

// For now every file links to the latest release page.
const LATEST_URL = `${RELEASES_URL}/latest`

// One entry per platform, in the order of the Download tiles.
//   id          used by the Hero buttons and the shared "selected platform" state
//   badge       small pill on the tile
//   sub         the line under the name
//   cta         the tile's call to action
//   files       the version buttons shown under the tiles (`recommended` = the white one)
//   soon        true = not available yet (Web app)
//   note        text shown instead of version buttons
export const PLATFORMS = [
  {
    id: 'windows',
    name: 'Windows',
    badge: 'Most popular',
    sub: 'Windows 10 and 11. Installer or portable.',
    cta: 'Choose a version',
    files: [
      { label: 'Installer', ext: '.exe', recommended: true, url: LATEST_URL },
      { label: 'Portable', ext: '.exe', url: LATEST_URL },
    ],
  },
  {
    id: 'web',
    name: 'Web app',
    badge: 'Coming soon',
    sub: 'Use Flowdo in your browser, nothing to install.',
    cta: 'Learn more',
    soon: true,
    note: 'The web app is on its way. Watch the GitHub releases.',
  },
  {
    id: 'linux',
    name: 'Linux',
    badge: 'x64',
    sub: 'AppImage for most distros, or a .deb package.',
    cta: 'Choose a version',
    files: [
      { label: 'AppImage', ext: '', recommended: true, url: LATEST_URL },
      { label: '.deb', ext: '', url: LATEST_URL },
    ],
  },
]

// The platform the Download section shows first.
export const DEFAULT_PLATFORM = 'windows'

// Hero download row: which platforms, in which order.
export const HERO_PLATFORM_ORDER = ['windows', 'linux', 'web']

// The small line under the Hero buttons.
export const DOWNLOAD_FORMATS = 'Installer, portable, AppImage or .deb'

export const getPlatform = (id) => PLATFORMS.find((platform) => platform.id === id)
