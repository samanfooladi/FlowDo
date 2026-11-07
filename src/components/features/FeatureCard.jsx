// One feature card: a small app-style picture on top, then a title and a short text.
// Props:
//   title    the card's heading
//   text     one or two sentences under it
//   visual   the little picture (any JSX), see FeatureVisuals.jsx
//   className  extra classes (the section uses one to animate the cards in)
export default function FeatureCard({ title, text, visual, className = '' }) {
  return (
    <li
      className={`flex flex-col rounded-[24px] border border-white/8 bg-[#050507] p-7 ${className}`}
    >
      {/* The picture is decorative, so screen readers skip it */}
      <div
        aria-hidden="true"
        // Same fixed height on every card, so the titles below line up across the row.
        className="flex h-[140px] flex-col justify-center rounded-[14px] border border-[#23242C] bg-[#101114] p-4 select-none"
      >
        {visual}
      </div>

      <h3 className="mt-6 text-[19px] leading-snug font-bold tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
    </li>
  )
}
