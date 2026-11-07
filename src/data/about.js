// Text for the About section. Edit the copy here; About.jsx just loops over these lists.

// Colours used by the timer dials.
const FOCUS = '#6366F1' // brand indigo
const BREAK = '#34D399' // green

// The two timer-mode cards. `tone` picks the badge colour ('indigo' or 'green').
// `dial` describes the ring: each segment's size is proportional to its minutes.
export const ABOUT_MODES = [
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    badge: 'Fixed rounds',
    tone: 'indigo',
    description:
      'Focus for 25 minutes, take a 5-minute break, and after every fourth round take a longer 15-minute one. Every length can be changed.',
    dial: {
      label: 'Pomodoro: four 25 minute focus rounds with short breaks and one long break',
      time: '25:00',
      caption: 'round 1 of 4',
      segments: [
        { minutes: 25, color: FOCUS },
        { minutes: 5, color: BREAK },
        { minutes: 25, color: FOCUS },
        { minutes: 5, color: BREAK },
        { minutes: 25, color: FOCUS },
        { minutes: 5, color: BREAK },
        { minutes: 25, color: FOCUS },
        { minutes: 15, color: BREAK },
      ],
    },
  },
  {
    id: 'flowmodoro',
    title: 'Flowmodoro',
    badge: 'Open-ended',
    tone: 'green',
    description:
      "No clock to beat. Focus as long as you're in the zone, then stop. Your break is a fifth of the time you focused, between 1 and 30 minutes.",
    dial: {
      label: 'Flowmodoro: 50 minutes of focus earns a 10 minute break',
      time: '50:00',
      caption: '+10 min break',
      captionTone: 'green', // shows the caption in green instead of grey
      segments: [
        { minutes: 50, color: FOCUS },
        { minutes: 10, color: BREAK },
      ],
    },
  },
]

// The three facts in the strip at the bottom. `icon` is a key in FACT_ICONS (About.jsx).
export const ABOUT_FACTS = [
  {
    icon: 'computer',
    title: 'Your data stays on your computer',
    text: 'No account needed. Export or import everything as JSON whenever you like.',
  },
  {
    icon: 'clock',
    title: 'Accurate, even through sleep',
    text: 'The timer runs on real clock time, so minimizing or a sleeping laptop never breaks a session.',
  },
  {
    icon: 'code',
    title: 'Free and open source',
    text: 'Built in the open on GitHub. Use it, read the code, or help shape what comes next.',
  },
]
