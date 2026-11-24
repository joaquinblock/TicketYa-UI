import { cn } from '@/shared/lib/cn'
import type { EventStatus } from '@/shared/types/event.types'
import { ACCESS_EVENT_STATUS_META } from '../constants/access.constants'

/** `.bo-status` del diseño: el punto y el texto, nunca solo el color. */
export function AccessStatusBadge({ status }: { status: EventStatus }) {
  const meta = ACCESS_EVENT_STATUS_META[status]

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.25 rounded-[20px] px-2 py-1 text-[10px] font-[650] whitespace-nowrap',
        meta.className,
      )}
    >
      <i aria-hidden className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  )
}
