// Text for the Features section. Edit the copy here; the components just loop over these lists.

// Priority levels, with the same colours as the real app.
export const PRIORITIES = {
  urgent: { label: 'Urgent', color: '#F43F5E' },
  high: { label: 'High', color: '#F59E0B' },
  normal: { label: 'Normal', color: '#3B82F6' },
  low: { label: 'Low', color: '#8A90A0' },
}

// The project tabs at the top of the task demo (and in the "Projects" card).
// The first one is the project the demo shows.
export const DEMO_PROJECTS = [
  { name: 'Launch week', count: 5, color: '#F59E0B' },
  { name: 'College', count: 2, color: '#22C55E' },
  { name: 'Personal', count: 3, color: '#6366F1' },
]

// The five tasks that get ticked off one by one, top to bottom.
// `due: 'Today'` is shown in light red until the task is done.
// `subtasks` is optional: { done, total }. When the task is ticked it shows total/total.
export const DEMO_TASKS = [
  { title: 'Journal your workflow', due: 'Today', priority: 'low' },
  { title: "Plan today's top 3", due: 'Today', priority: 'high' },
  {
    title: 'Finish the landing page hero',
    due: 'Today',
    priority: 'urgent',
    subtasks: { done: 2, total: 3 },
  },
  { title: 'Reply to client emails', due: 'Tomorrow', priority: 'normal' },
  { title: 'Read 20 pages', due: 'Mon, Nov 9', priority: 'low' },
]

// The four feature cards under the demo. `id` picks the small picture on top
// (see FEATURE_VISUALS in src/sections/Features.jsx).
export const FEATURES = [
  {
    id: 'projects',
    title: 'Projects',
    text: 'Group your tasks by project, each with its own color, so work, study and personal stuff never mix.',
  },
  {
    id: 'subtasks',
    title: 'Subtasks',
    text: 'Break a big task into small steps and tick them off as you go.',
  },
  {
    id: 'deadlines',
    title: 'Deadlines',
    text: "Give tasks a due date in one click. Today and Upcoming show you what's next.",
  },
  {
    id: 'priority',
    title: 'Priority',
    text: "Mark what's urgent, high, normal or low, and the color follows the task everywhere.",
  },
]

// The example inside the "Subtasks" card.
export const SUBTASK_EXAMPLE = {
  title: 'Finish the landing page',
  steps: [
    { title: 'Hero section', done: true },
    { title: 'About section', done: true },
    { title: 'Features section', done: false },
  ],
}
