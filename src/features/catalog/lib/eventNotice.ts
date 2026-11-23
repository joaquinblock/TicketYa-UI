import type { EventDetail } from '../types/catalog.types'

export type EventNotice = { title: string; message: string }

type NoticeInput = Pick<EventDetail, 'status' | 'highDemand' | 'saleStart'>

/** El único aviso del detalle, o `undefined` si el evento está a la venta sin nada que avisar. */
export function getEventNotice(event: NoticeInput, now: Date): EventNotice | undefined {
  void event
  void now
  return undefined
}
