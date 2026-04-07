import { cn } from '../../lib/utils'

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border-2 border-[#dccded] bg-white px-3 py-2 text-sm text-[#2f2141] shadow-[0_2px_0_0_#efe6f8] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9d85b6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8a58bf] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
