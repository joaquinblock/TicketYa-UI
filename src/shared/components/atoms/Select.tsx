import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'min-h-11 w-full cursor-pointer rounded-control border border-line-strong bg-surface px-2.5 text-label text-ink disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
