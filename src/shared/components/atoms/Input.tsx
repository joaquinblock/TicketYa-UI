import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'min-h-11 w-full rounded-control border border-line-strong bg-surface px-3 text-control text-ink placeholder:text-subtle aria-invalid:border-error-ink',
        className,
      )}
      {...props}
    />
  )
}
