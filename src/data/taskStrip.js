// The two rows of task pills rolling out of the cart mascot's cart.
// priority: 'urgent' | 'high' | 'normal' | 'low' (colours in src/data/features.js)
// done: true = ticked off (filled check, struck-through text)

export const TASK_STRIP_ROWS = [
  {
    loopSeconds: 50,
    tasks: [
      { title: 'Journal your workflow', priority: 'low', done: true },
      { title: "Plan today's top 3", priority: 'high', done: false },
      { title: 'Finish the landing page', priority: 'urgent', done: true },
      { title: 'Reply to emails', priority: 'normal', done: false },
      { title: 'Read 20 pages', priority: 'low', done: true },
      { title: 'Review the PR', priority: 'normal', done: false },
    ],
  },
  {
    loopSeconds: 58,
    tasks: [
      { title: 'Study for physics', priority: 'high', done: false },
      { title: 'Push to origin', priority: 'normal', done: true },
      { title: 'Stretch for 5 minutes', priority: 'low', done: false },
      { title: 'Update the resume', priority: 'high', done: true },
      { title: 'Prepare slides', priority: 'urgent', done: false },
      { title: 'Water the plants', priority: 'low', done: true },
    ],
  },
]
