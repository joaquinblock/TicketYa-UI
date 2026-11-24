import { cn } from '@/shared/lib/cn'
import { STATUS_TONE_CLASS, type StatusTone } from '../constants/returnRequests.constants'

type BackofficeStatusBadgeProps = {
  label: string
  tone: StatusTone
}

/** `.bo-status` del diseño: el punto y el texto, nunca solo el color. */
export function BackofficeStatusBadge({ label, tone }: BackofficeStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.25 rounded-[20px] px-1.75 py-1.25 text-[8px] font-[650] whitespace-nowrap',
        STATUS_TONE_CLASS[tone],
      )}
    >
      <i aria-hidden className="size-1.25 rounded-full bg-current" />
      {label}
    </span>
  )
}
