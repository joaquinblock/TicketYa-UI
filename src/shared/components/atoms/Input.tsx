import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'rounded-control border-line-strong bg-surface text-control text-ink placeholder:text-subtle aria-invalid:border-error-ink min-h-11 w-full border px-3',
        className,
      )}
      {...props}
    />
  )
}
