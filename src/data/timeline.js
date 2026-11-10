// The timer timeline strip under the Hero. One full cycle, which then repeats forever.
// Each block is `minutes` long (1 minute = MINUTE_PX pixels).
// kind: 'focus' (indigo), 'break' (green) or 'flow' (Flowmodoro gradient).
// mascot: optional, a mascot that sits on top of that block and rides along.

export const MINUTE_PX = 16
export const TIMELINE_LOOP_SECONDS = 46

export const TIMELINE_BLOCKS = [
  { label: 'Pomodoro · Focus 25:00', minutes: 25, kind: 'focus' },
  { label: 'Break', minutes: 5, kind: 'break' },
  { label: 'Focus 25:00', minutes: 25, kind: 'focus' },
  { label: 'Break', minutes: 5, kind: 'break' },
  { label: 'Flowmodoro · Focus 48:00 ↑', minutes: 48, kind: 'flow' },
  { label: 'Earned 9:36', minutes: 10, kind: 'break' },
  { label: 'Focus 25:00', minutes: 25, kind: 'focus' },
  { label: 'Long break', minutes: 15, kind: 'break', mascot: 'sleep' },
]
