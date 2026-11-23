import type { EventDetail } from '../../types/catalog.types'
import { useEventNotice } from './useEventNotice'

type EventNoticeProps = { event: EventDetail }

/** Un solo aviso por evento, o nada si está a la venta sin nada que avisar. */
export function EventNotice({ event }: EventNoticeProps) {
  const notice = useEventNotice(event)
  if (!notice) return null

  return (
    <section aria-label="Aviso">
      <strong>{notice.title}</strong>
      <p>{notice.message}</p>
    </section>
  )
}
