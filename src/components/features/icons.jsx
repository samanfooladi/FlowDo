// Tiny line icons used by the task demo and the feature cards.
// They're decorative, so each one is aria-hidden. Pass a className to size/colour them.

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// A calendar page
export function CalendarIcon({ className = 'size-3.5' }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  )
}

// A parent line with two indented children (subtasks)
export function SubtaskIcon({ className = 'size-3.5' }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M5 4v12a2 2 0 0 0 2 2h4M5 10h6" />
      <circle cx="16" cy="10" r="2.5" />
      <circle cx="16" cy="18" r="2.5" />
    </svg>
  )
}

// A checkmark
export function CheckIcon({ className = 'size-3' }) {
  return (
    <svg {...iconProps} strokeWidth={3} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}
