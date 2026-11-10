import { DEMO_PROJECTS, DEMO_TASKS, PRIORITIES } from '../../data/features.js'
import { CalendarIcon, CheckIcon, SubtaskIcon } from './icons.jsx'

// Classes for the gentle colour/opacity fades (Tailwind's transition utilities).
const FADE = 'transition-all duration-[450ms] ease-out'

// One task row. `done` = ticked off, `next` = the row that will be ticked next (highlighted).
function TaskRow({ task, done, next }) {
  const priority = PRIORITIES[task.priority]
  const dueIsUrgent = task.due === 'Today' && !done

  return (
    <li
      className={[
        'relative flex items-start gap-3 overflow-hidden rounded-xl border px-3.5 py-3',
        FADE,
        next
          ? 'border-[rgba(99,102,241,0.55)] bg-[rgba(99,102,241,0.10)]'
          : 'border-transparent bg-transparent',
        done ? 'opacity-70' : 'opacity-100',
      ].join(' ')}
    >
      {/* The 3px indigo bar on the left edge of the "next" row */}
      <span
        className={`absolute inset-y-0 left-0 w-[3px] bg-brand ${FADE} ${next ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* The circle: priority-coloured outline, fills with indigo + a check when done.
          `motion-safe:animate-check-pop` plays the little springy grow once, when it's ticked. */}
      <span
        className={[
          'mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2',
          FADE,
          done ? 'motion-safe:animate-check-pop bg-brand' : 'bg-transparent',
        ].join(' ')}
        style={{ borderColor: done ? 'var(--color-brand)' : priority.color }}
      >
        <CheckIcon
          className={`size-2.5 text-white ${FADE} ${done ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
        />
      </span>

      <div className="min-w-0">
        {/* The line-through is always there but transparent, so its colour can fade in. */}
        <p
          className={[
            'text-[15px] leading-snug line-through',
            FADE,
            done ? 'text-[#6F7482] decoration-[#6F7482]' : 'text-white decoration-transparent',
          ].join(' ')}
        >
          {task.title}
        </p>

        {/* Meta line: due date, subtasks (if any), priority */}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#8A90A0]">
          <span
            className={`flex items-center gap-1 ${FADE} ${dueIsUrgent ? 'text-[#FCA5A5]' : ''}`}
          >
            <CalendarIcon className="size-3.5" />
            {task.due}
          </span>

          {task.subtasks && (
            <span className="flex items-center gap-1 tabular-nums">
              <SubtaskIcon className="size-3.5" />
              {done ? task.subtasks.total : task.subtasks.done}/{task.subtasks.total}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: priority.color }} />
            {priority.label}
          </span>
        </div>
      </div>
    </li>
  )
}

// A mock of the app's task list. The parent decides how many tasks are ticked
// (Features.jsx runs the tick loop), so it can also react when all are done.
// Props:
//   done   how many tasks, from the top, are ticked off (0 to DEMO_TASKS.length)
export default function TaskDemo({ done }) {
  const open = DEMO_TASKS.length - done
  const project = DEMO_PROJECTS[0]

  return (
    <div
      role="img"
      aria-label="A Flowdo project called Launch week with five tasks being ticked off one by one"
      className="rounded-[20px] border border-surface-line bg-surface p-4 shadow-[0_40px_80px_rgba(0,0,0,0.6)] select-none sm:p-5"
    >
      {/* a) Project tabs. The first one is active. */}
      <div className="flex flex-wrap gap-1.5">
        {DEMO_PROJECTS.map((tab, index) => (
          <span
            key={tab.name}
            className={[
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px]',
              index === 0 ? 'bg-white/8 text-white' : 'text-[#8A90A0]',
            ].join(' ')}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: tab.color }} />
            {tab.name}
            <span className="text-[#6F7482] tabular-nums">{tab.count}</span>
          </span>
        ))}
      </div>

      {/* b) Project header */}
      <div className="mt-5 flex items-center gap-2.5">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: project.color }} />
        <span className="text-[17px] font-bold">{project.name}</span>
        <span className="text-[13px] text-[#8A90A0] tabular-nums">{open} open</span>
      </div>

      {/* c) A fake "add task" bar (just a picture, not a real input) */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#23242C] bg-[#0B0C0E] px-3.5 py-2.5 text-[13px] text-[#6F7482]">
        <span className="text-[16px] leading-none">+</span>
        <span className="truncate">Add a task to {project.name}. Enter to save</span>
      </div>

      {/* d) The tasks */}
      <ul className="mt-3 flex flex-col gap-1">
        {DEMO_TASKS.map((task, index) => (
          <TaskRow key={task.title} task={task} done={index < done} next={index === done} />
        ))}
      </ul>

      {/* e) Footer: progress bar + count */}
      <div className="mt-4 flex items-center gap-3 border-t border-[#23242C] pt-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-[600ms] ease-out"
            style={{ width: `${(done / DEMO_TASKS.length) * 100}%` }}
          />
        </div>
        <span className="text-[12px] text-[#8A90A0] tabular-nums">
          {done} of {DEMO_TASKS.length} done
        </span>
      </div>
    </div>
  )
}
