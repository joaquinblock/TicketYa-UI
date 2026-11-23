import { EVENT_NOTICE_TEXT, SALE_NOT_STARTED_TITLE } from '../constants/eventNotice.constants'
import type { EventDetail, EventNotice, FixedNoticeKind } from '../types/catalog.types'
import { formatEventDateTime } from './eventFormat'

type NoticeInput = Pick<EventDetail, 'status' | 'highDemand' | 'saleStart'>

/**
 * El único aviso del detalle, o `undefined` si el evento está a la venta sin nada que avisar.
 * Un evento fuera de venta avisa su estado; a la venta, la apertura futura le gana a la alta demanda.
 */
export function getEventNotice(event: NoticeInput, now: Date): EventNotice | undefined {
  if (event.status !== 'PUBLISHED') return fixedNotice(event.status)
  if (event.saleStart && hasSaleNotStarted(event.saleStart, now))
    return saleNotStartedNotice(event.saleStart)
  if (event.highDemand) return fixedNotice('HIGH_DEMAND')
  return undefined
}

/** `saleStart` viene en hora local sin zona: `new Date` lo lee como hora local, igual que `now`. */
export function hasSaleNotStarted(saleStart: string, now: Date) {
  return new Date(saleStart) > now
}

function saleNotStartedNotice(saleStart: string): EventNotice {
  return {
    kind: 'SALE_NOT_STARTED',
    title: SALE_NOT_STARTED_TITLE,
    message: `Abre el ${formatEventDateTime(saleStart)}. Ese día vas a poder entrar a la fila.`,
  }
}

function fixedNotice(kind: FixedNoticeKind): EventNotice {
  return { kind, ...EVENT_NOTICE_TEXT[kind] }
}
