// Everything about the current release lives here.
// For a new version, update VERSION and the file names below (they're on the GitHub release page).

export const VERSION = '0.5.3'

const RELEASE_URL = `https://github.com/navidh0/Flowdo/releases/download/v${VERSION}`

// One entry per download button, in the order they appear.
// `platform` picks the icon. The first entry is the recommended download.
export const DOWNLOADS = [
  {
    label: 'Windows Installer',
    platform: 'windows',
    file: `Flowdo-Setup-${VERSION}.exe`,
  },
  {
    label: 'Windows Portable',
    platform: 'windows',
    file: `Flowdo-${VERSION}-portable.exe`,
  },
  {
    label: 'Linux AppImage',
    platform: 'linux',
    file: `Flowdo-${VERSION}.AppImage`,
  },
  {
    label: 'Linux .deb',
    platform: 'linux',
    file: `flowdo_${VERSION}_amd64.deb`,
  },
].map((download) => ({ ...download, url: `${RELEASE_URL}/${download.file}` }))
