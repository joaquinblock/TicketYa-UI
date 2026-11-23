import { getEventNotice } from '../../lib/eventNotice'
import type { EventDetail } from '@/shared/types/event.types'

/** El aviso del evento según el reloj de ahora. */
export function useEventNotice(event: EventDetail) {
  return getEventNotice(event, new Date())
}
