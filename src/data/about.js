// Text for the About section. Edit the copy here; About.jsx just reads these.

export const ABOUT_INTRO =
  'A focus timer and a to-do list in one desktop app. Pick a task, start the timer, and every minute you focus is logged against it.'

export const ABOUT_CARD_LABEL = 'Two ways to focus'

// Colours used by the timer dial.
const FOCUS = '#6366F1' // brand indigo
const BREAK = '#34D399' // green

// The two modes of the featured card's toggle.
//   dial.segments  drawn clockwise from the top; each slice's size follows its minutes
//   stats          the three chips; tone 'green' = a break value
//   mascot         which mascot stands next to the card in this mode
export const ABOUT_MODES = [
  {
    id: 'pomodoro',
    title: 'Pomodoro',
    description:
      'Fixed rounds with a steady rhythm. Focus for 25 minutes, take a 5-minute break, and after every fourth round take a longer one. Every length can be changed.',
    dial: {
      label: 'Pomodoro: four 25 minute focus rounds with 5 minute breaks, and a 15 minute long break at the end',
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
    stats: [
      { label: 'Focus', value: '25m' },
      { label: 'Break', value: '5m', tone: 'green' },
      { label: 'Long break', value: '15m', tone: 'green' },
    ],
    mascot: 'guide',
  },
  {
    id: 'flowmodoro',
    title: 'Flowmodoro',
    description:
      'No clock to beat. The timer counts up while you focus, and when you stop, your break is a fifth of the time you put in.',
    dial: {
      label: 'Flowmodoro: 50 minutes of focus earns a 10 minute break',
      time: '50:00',
      caption: '+10 min break',
      captionTone: 'green',
      segments: [
        { minutes: 50, color: FOCUS },
        { minutes: 10, color: BREAK },
      ],
    },
    stats: [
      { label: 'Break', value: '÷ 5' },
      { label: 'Shortest', value: '1m', tone: 'green' },
      { label: 'Longest', value: '30m', tone: 'green' },
    ],
    mascot: 'meditate',
  },
]

// The three fact cards. `icon` is a key in FACT_ICONS (About.jsx).
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
    icon: 'history',
    title: 'One shared history',
    text: 'Pomodoro and Flowmodoro sessions land in the same history, even the ones you stop early.',
  },
]
