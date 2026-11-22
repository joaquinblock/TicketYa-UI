import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

type ChipProps = Omit<ComponentProps<'button'>, 'aria-pressed'> & { isSelected: boolean }

export function Chip({ isSelected, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        'text-label text-muted hover:text-ink min-h-9 cursor-pointer rounded-full px-3.5 font-medium',
        isSelected && 'bg-ink text-surface hover:text-surface',
        className,
      )}
      {...props}
    />
  )
}
