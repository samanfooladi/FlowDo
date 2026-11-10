// A section title + intro paragraph, both revealed on scroll (data-reveal, see useReveal).
//
// Props:
//   id         id for the <h2> (the section's aria-labelledby points at it)
//   title      the heading content (can include <ShineText>)
//   intro      the paragraph under it
//   align      'left' (default) or 'center'
//   size       Tailwind classes for the heading's size/weight
//   className  extra classes for the wrapper
export default function SectionHeading({
  id,
  title,
  intro,
  align = 'left',
  size = 'text-[clamp(44px,5.6vw,76px)] font-bold',
  className = '',
}) {
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} ${className}`}>
      <h2 id={id} data-reveal="0" className={`leading-[1.02] tracking-[-0.045em] text-balance ${size}`}>
        {title}
      </h2>
      {intro && (
        <p
          data-reveal="1"
          className={`mt-6 max-w-[640px] text-[clamp(17px,1.4vw,20px)] leading-relaxed text-muted ${centered ? 'mx-auto' : ''}`}
        >
          {intro}
        </p>
      )}
    </div>
  )
}
