// Copy and links for the footer.
import { GITHUB_URL, ISSUES_URL, RELEASES_URL } from './downloads.js'

export const FOOTER_TAGLINE =
  'A focus timer and a to-do list in one desktop app. Pomodoro or Flowmodoro, your choice.'

export const FOOTER_NOTE = '© 2026 Flowdo · See you in your next focus session.'

// The two link columns. `href` starting with "#" = a section on this page.
export const FOOTER_LINK_GROUPS = [
  {
    title: 'Product',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Features', href: '#features' },
      { label: 'Download', href: '#download' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: GITHUB_URL },
      { label: 'All releases', href: RELEASES_URL },
      { label: 'Report an issue', href: ISSUES_URL },
    ],
  },
]
