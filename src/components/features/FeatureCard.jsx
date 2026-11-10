// One feature card: a small app-style picture on top, then a title and a short text.
// Props:
//   title    the card's heading
//   text     one or two sentences under it
//   visual   the little picture (any JSX), see FeatureVisuals.jsx
//   className  extra classes (the section uses one to animate the cards in)
export default function FeatureCard({ title, text, visual, className = '', ...props }) {
  return (
    <li className={`glass flex flex-col p-6 ${className}`} {...props}>
      {/* The picture is decorative, so screen readers skip it */}
      <div
        aria-hidden="true"
        // Same fixed height on every card, so the titles below line up across the row.
        className="flex h-[130px] flex-col justify-center rounded-[14px] border border-surface-line bg-surface p-4 select-none"
      >
        {visual}
      </div>

      <h3 className="mt-5 text-[19px] leading-snug font-bold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
    </li>
  )
}
