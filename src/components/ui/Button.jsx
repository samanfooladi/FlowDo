// Shared by both styles: pill shape, size, hover lift, keyboard focus ring.
const BASE =
  'inline-flex h-14 items-center justify-center gap-3 rounded-full px-7 text-base font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand-light'

const VARIANTS = {
  // White pill with a soft indigo ring: the main call to action.
  primary:
    'bg-white text-[#0F1115] shadow-[0_0_0_6px_rgba(99,102,241,0.18)] hover:shadow-[0_0_0_8px_rgba(99,102,241,0.28)]',
  // Dark see-through pill: for the other options next to a primary button.
  secondary:
    'border border-white/15 bg-white/5 text-text backdrop-blur-sm hover:border-brand-light/50 hover:bg-white/10',
}

// Reusable call-to-action link styled as a pill.
// Pass `icon` to show something before the label, `variant="secondary"` for the quieter style,
// and `className` for extra layout classes (like a width).
export default function Button({ href, icon, variant = 'primary', className = '', children, ...props }) {
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props}>
      {icon}
      {children}
    </a>
  )
}
