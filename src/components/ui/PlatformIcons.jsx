// Small platform icons (decorative, so aria-hidden). Pass `className` to change the size.

export function WindowsIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="7.5" height="7.5" rx="0.6" />
      <rect x="8.5" y="0" width="7.5" height="7.5" rx="0.6" />
      <rect x="0" y="8.5" width="7.5" height="7.5" rx="0.6" />
      <rect x="8.5" y="8.5" width="7.5" height="7.5" rx="0.6" />
    </svg>
  )
}

// A simple penguin (Tux) outline.
export function LinuxIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3c-2.2 0-3.6 1.8-3.6 4.2v2.2c0 1.2-.7 2.2-1.5 3.3-.9 1.3-1.9 2.8-1.9 4.6 0 .6.1 1.1.4 1.6l-1 1.3c-.2.3 0 .8.4.8h3.6c.4 0 .7-.2.9-.5.9.3 1.8.5 2.7.5s1.8-.2 2.7-.5c.2.3.5.5.9.5h3.6c.4 0 .6-.5.4-.8l-1-1.3c.3-.5.4-1 .4-1.6 0-1.8-1-3.3-1.9-4.6-.8-1.1-1.5-2.1-1.5-3.3V7.2C15.6 4.8 14.2 3 12 3Z" />
      <path d="M10.2 7.4h.01M13.8 7.4h.01" strokeWidth="2.4" />
    </svg>
  )
}

export function GlobeIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  )
}

export function ChevronIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

// Icon per platform id (see src/data/downloads.js).
export const PLATFORM_ICON = {
  windows: WindowsIcon,
  linux: LinuxIcon,
  web: GlobeIcon,
}
