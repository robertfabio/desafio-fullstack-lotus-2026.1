import { cn } from '../../lib/utils'

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
