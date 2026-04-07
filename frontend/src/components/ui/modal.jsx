import { useEffect } from 'react'
import { cn } from '../../lib/utils'

export function Modal({
  open,
  onClose,
  title,
  description,
  className,
  children,
}) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Modal'}
        className={cn('w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl', className)}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h2 className="text-lg font-semibold text-zinc-900">{title}</h2> : null}
        {description ? <p className="mt-1 text-sm text-zinc-600">{description}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
