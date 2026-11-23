import { cn } from '@/shared/lib/cn'
import type { EventDetail } from '../../types/catalog.types'
import { NOTICE_TONE_CLASS } from './eventDetail.constants'
import { useEventNotice } from './useEventNotice'

type EventNoticeProps = { event: EventDetail }

/** Un solo aviso por evento, o nada si está a la venta sin nada que avisar. */
export function EventNotice({ event }: EventNoticeProps) {
  const notice = useEventNotice(event)
  if (!notice) return null

  return (
    <section
      aria-label="Aviso"
      className={cn(
        'flex flex-col gap-1 rounded-xl px-4 py-3.5 text-sm',
        NOTICE_TONE_CLASS[notice.kind],
      )}
    >
      <strong>{notice.title}</strong>
      <p>{notice.message}</p>
    </section>
  )
}
