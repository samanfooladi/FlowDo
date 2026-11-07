// Small platform icons for download buttons (decorative, so aria-hidden).
// Same drawings as the ones in Hero.jsx. Pass `className` to change the size (default 16px).

export function WindowsIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="7.5" height="7.5" />
      <rect x="8.5" y="0" width="7.5" height="7.5" />
      <rect x="0" y="8.5" width="7.5" height="7.5" />
      <rect x="8.5" y="8.5" width="7.5" height="7.5" />
    </svg>
  )
}

// A simple penguin silhouette (Tux) with the belly cut out.
export function LinuxIcon({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M8 1C6.3 1 5.2 2.4 5.2 4.3v1.4c0 .9-.5 1.7-1.1 2.5C3.3 9.2 2.6 10.4 2.6 11.8c0 .5.1.9.3 1.3L2 14.2c-.2.3 0 .8.4.8h3.1c.4 0 .7-.2.9-.5.5.1 1 .2 1.6.2s1.1-.1 1.6-.2c.2.3.5.5.9.5h3.1c.4 0 .6-.5.4-.8l-.9-1.1c.2-.4.3-.8.3-1.3 0-1.4-.7-2.6-1.5-3.6-.6-.8-1.1-1.6-1.1-2.5V4.3C10.8 2.4 9.7 1 8 1zM8 8.4c-1.1 0-1.9 1.2-1.9 2.6S6.9 13.4 8 13.4s1.9-1 1.9-2.4S9.1 8.4 8 8.4zM7 3.3a.6.6 0 1 0 0 1.2.6.6 0 1 0 0-1.2zm2 0a.6.6 0 1 0 0 1.2.6.6 0 1 0 0-1.2z" />
    </svg>
  )
}
