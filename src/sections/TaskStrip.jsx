import MascotImage from '../components/ui/MascotImage.jsx'
import { CheckIcon } from '../components/features/icons.jsx'
import { PRIORITIES } from '../data/features.js'
import { TASK_STRIP_ROWS } from '../data/taskStrip.js'
import useInView from '../hooks/useInView.js'

// Each row is drawn 3 times in a row and moved by one copy per loop, so it's seamless
// and still covers very wide screens.
const COPIES = 3

// One app-style task pill.
function TaskPill({ task }) {
  const color = PRIORITIES[task.priority].color

  return (
    <div
      className={`flex h-[54px] shrink-0 items-center gap-3 rounded-2xl border bg-surface px-5 max-[960px]:h-[42px] max-[960px]:px-4 ${task.done ? 'border-surface-line' : 'border-[rgba(99,102,241,0.4)]'}`}
    >
      {task.done ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-brand">
          <CheckIcon className="size-3 text-white" />
        </span>
      ) : (
        <span className="size-5 rounded-full border-2" style={{ borderColor: color }} />
      )}
      <span
        className={`text-[17px] font-medium whitespace-nowrap max-[960px]:text-[14px] ${task.done ? 'text-subtle line-through' : 'text-white'}`}
      >
        {task.title}
      </span>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
    </div>
  )
}

// Two rows of task pills rolling to the right, out of the cart mascot's cart (decorative).
export default function TaskStrip() {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative flex h-[240px] flex-col justify-center gap-4 overflow-hidden bg-base select-none max-[960px]:h-[180px] max-[960px]:gap-3 ${inView ? '' : 'loops-paused'}`}
    >
      {TASK_STRIP_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="loop-marquee-right flex w-max"
          style={{ '--dur': `${row.loopSeconds}s`, '--shift': `${-100 / COPIES}%` }}
        >
          {Array.from({ length: COPIES }, (_, copy) => (
            // pr-4 = the same gap after the last pill, so the copies join seamlessly
            <div key={copy} className="flex gap-4 pr-4 max-[960px]:gap-3 max-[960px]:pr-3">
              {row.tasks.map((task) => (
                <TaskPill key={task.title} task={task} />
              ))}
            </div>
          ))}
        </div>
      ))}

      {/* Solid fade on the left, so the pills seem to come out of the cart */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#050409_max(15%,120px),transparent_max(26%,180px))]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-base to-transparent" />

      {/* The cart mascot, with a little push wobble */}
      <div className="absolute bottom-[10px] left-[4%] max-[960px]:left-[2%]">
        <div className="loop-wobble">
          <MascotImage
            name="cart"
            className="h-[220px] drop-shadow-[0_0_30px_rgba(99,102,241,0.35)] max-[960px]:h-[150px]"
          />
        </div>
      </div>
    </div>
  )
}
