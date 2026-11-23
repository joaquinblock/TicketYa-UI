import type { SectorAvailability } from '@/shared/types/event.types'
import type { ReservationDraft, SeatId } from '../types/purchase.types'

type ReservationDraftInput = {
  eventId: number | undefined
  sector: SectorAvailability | undefined
  selection: SeatId[]
  quantity: number
}

/** Lo que se reservaría con lo elegido en el sector abierto. Sin nada elegido, no hay reserva. */
export function toReservationDraft({
  eventId,
  sector,
  selection,
  quantity,
}: ReservationDraftInput): ReservationDraft | undefined {
  if (eventId === undefined || !sector) return undefined
  if (sector.numbered) return selection.length > 0 ? { eventId, seatIds: selection } : undefined
  return quantity > 0 ? { eventId, eventSectorId: sector.eventSectorId, quantity } : undefined
}
