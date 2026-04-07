import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800',
  outline: 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100',
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
        'inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
