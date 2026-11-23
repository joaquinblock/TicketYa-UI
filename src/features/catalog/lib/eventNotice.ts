import { EVENT_NOTICE_TEXT } from '../constants/eventNotice.constants'
import type { EventDetail, EventNotice, FixedNoticeKind } from '../types/catalog.types'

type NoticeInput = Pick<EventDetail, 'status' | 'highDemand' | 'saleStart'>

/** El único aviso del detalle, o `undefined` si el evento está a la venta sin nada que avisar. */
export function getEventNotice(event: NoticeInput, now: Date): EventNotice | undefined {
  void now
  if (event.highDemand) return fixedNotice('HIGH_DEMAND')
  return undefined
}

function fixedNotice(kind: FixedNoticeKind): EventNotice {
  return { kind, ...EVENT_NOTICE_TEXT[kind] }
}
