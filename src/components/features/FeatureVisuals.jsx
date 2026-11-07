// The small app-style pictures on top of each feature card.
// They only show text from src/data/features.js, so edit the words there.
import { DEMO_PROJECTS, PRIORITIES, SUBTASK_EXAMPLE } from '../../data/features.js'
import { CalendarIcon, CheckIcon } from './icons.jsx'

// Projects: three rows, each with its colour dot, name and task count.
export function ProjectsVisual() {
  return (
    <ul className="flex flex-col gap-1">
      {DEMO_PROJECTS.map((project, index) => (
        <li
          key={project.name}
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] ${index === 0 ? 'bg-white/8 text-white' : 'text-[#8A90A0]'}`}
        >
          <span className="size-2 rounded-full" style={{ backgroundColor: project.color }} />
          <span className="flex-1 truncate">{project.name}</span>
          <span className="text-[#6F7482] tabular-nums">{project.count}</span>
        </li>
      ))}
    </ul>
  )
}

// Subtasks: a parent task with three indented steps, the first two ticked.
export function SubtasksVisual() {
  return (
    <div className="text-[13px]">
      <p className="truncate font-medium text-white">{SUBTASK_EXAMPLE.title}</p>
      <ul className="mt-2 flex flex-col gap-1.5 border-l border-[#23242C] pl-3">
        {SUBTASK_EXAMPLE.steps.map((step) => (
          <li key={step.title} className="flex items-center gap-2">
            {/* Square checkbox: filled indigo with a check when done, empty otherwise */}
            <span
              className={`flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border ${step.done ? 'border-brand bg-brand' : 'border-[#6F7482]'}`}
            >
              {step.done && <CheckIcon className="size-2.5 text-white" />}
            </span>
            <span
              className={`truncate ${step.done ? 'text-[#6F7482] line-through' : 'text-[#C7CAD3]'}`}
            >
              {step.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Deadlines: a date field plus two quick-pick chips ("Today" is selected).
export function DeadlinesVisual() {
  return (
    <div className="text-[13px]">
      <div className="flex items-center gap-2 rounded-lg border border-[#23242C] bg-[#0B0C0E] px-3 py-2 text-white">
        <CalendarIcon className="size-4 text-[#8A90A0]" />
        Mon, Nov 9
      </div>
      <div className="mt-2.5 flex gap-2">
        <span className="rounded-full border border-[rgba(99,102,241,0.55)] bg-[rgba(99,102,241,0.15)] px-3 py-1 text-brand-light">
          Today
        </span>
        <span className="rounded-full border border-[#23242C] px-3 py-1 text-[#8A90A0]">
          Tomorrow
        </span>
      </div>
    </div>
  )
}

// Priority: four pills in a 2×2 grid, "Urgent" selected.
export function PriorityVisual() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[13px]">
      {Object.entries(PRIORITIES).map(([key, priority]) => {
        const selected = key === 'urgent'
        return (
          <span
            key={key}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 ${selected ? 'text-white' : 'border-[#23242C] text-[#8A90A0]'}`}
            // The selected pill gets a red tint and red border (15% / 55% of the urgent colour).
            style={
              selected
                ? { backgroundColor: `${priority.color}26`, borderColor: `${priority.color}8C` }
                : undefined
            }
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: priority.color }} />
            {priority.label}
          </span>
        )
      })}
    </div>
  )
}
