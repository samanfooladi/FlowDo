// Pill-shaped call-to-action. Renders an <a> when `href` is given, otherwise a <button>.
//
// Props:
//   variant   'primary' (white with an indigo ring), 'glass' (see-through indigo)
//   size      'lg' (56px, Hero) or 'md' (48px)
//   icon      shown before the label
//   className extra layout classes

const BASE =
  'inline-flex items-center justify-center gap-2.5 rounded-full font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,border-color] duration-200 hover:-translate-y-0.5'

const SIZES = {
  lg: 'h-14 px-7 text-[17px]',
  md: 'h-12 px-6 text-[15px]',
}

const VARIANTS = {
  primary:
    'bg-white text-[#0B0A1A] shadow-[0_0_0_6px_rgba(99,102,241,0.28)] hover:shadow-[0_0_0_8px_rgba(99,102,241,0.38)]',
  glass:
    'border border-[rgba(165,180,252,0.4)] bg-[rgba(99,102,241,0.14)] text-white backdrop-blur-md hover:border-[rgba(165,180,252,0.65)] hover:bg-[rgba(99,102,241,0.22)]',
}

export default function Button({
  href,
  icon,
  variant = 'primary',
  size = 'lg',
  className = '',
  children,
  ...props
}) {
  const classes = `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {icon}
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {icon}
      {children}
    </button>
  )
}
