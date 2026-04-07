import { cn } from '../../lib/utils'

const variants = {
  default: 'border border-[#47216f] bg-[#5b2d8e] text-white',
  outline: 'border border-[#d8c8ea] bg-white text-[#5b2d8e]',
  success: 'border border-emerald-200 bg-emerald-100 text-emerald-800',
  warning: 'border border-amber-200 bg-amber-100 text-amber-800',
  danger: 'border border-red-200 bg-red-100 text-red-800',
}

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
