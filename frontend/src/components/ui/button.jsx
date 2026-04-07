import { cn } from '../../lib/utils'

const variants = {
  default:
    'border-2 border-[#47216f] bg-[#5b2d8e] text-white shadow-[0_4px_0_0_#47216f] hover:bg-[#6a379d] active:translate-y-[2px] active:shadow-[0_2px_0_0_#47216f]',
  outline:
    'border-2 border-[#d8c8ea] bg-white text-[#5b2d8e] shadow-[0_3px_0_0_#e8dcf5] hover:bg-[#f5f0fb] active:translate-y-[2px] active:shadow-[0_1px_0_0_#e8dcf5]',
}

export function Button({
  className,
  variant = 'default',
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex h-10 w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-[background-color,transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a58bf] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
