import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

type ChipProps = Omit<ComponentProps<'button'>, 'aria-pressed'> & { isSelected: boolean }

export function Chip({ isSelected, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        'min-h-9 cursor-pointer rounded-full px-3.5 text-label font-medium text-muted hover:text-ink',
        isSelected && 'bg-ink text-surface hover:text-surface',
        className,
      )}
      {...props}
    />
  )
}
