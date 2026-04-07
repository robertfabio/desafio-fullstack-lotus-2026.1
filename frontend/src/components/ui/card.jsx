import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-xl border border-zinc-200 bg-white shadow-sm', className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('space-y-1.5 p-6', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return (
    <h1 className={cn('text-2xl font-semibold tracking-tight text-zinc-950', className)} {...props} />
  )
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-zinc-500', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
