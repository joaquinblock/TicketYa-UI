import { describe, expect, it } from 'vitest'
import type { SectorAvailability } from '@/shared/types/event.types'
import { toReservationDraft } from './reservationDraft'

const EVENT_ID = 17

const platea: SectorAvailability = {
  eventSectorId: 22,
  sectorName: 'Platea',
  price: 56000,
  numbered: true,
  availablePlaces: 50,
  seats: [],
}

const campo: SectorAvailability = { ...platea, eventSectorId: 18, numbered: false, seats: null }

describe('toReservationDraft', () => {
  it('en un sector numerado, reserva los asientos elegidos', () => {
    expect(
      toReservationDraft({ eventId: EVENT_ID, sector: platea, selection: [81, 82], quantity: 0 }),
    ).toEqual({ eventId: EVENT_ID, seatIds: [81, 82] })
  })

  it('en un sector no numerado, reserva la cantidad del sector', () => {
    expect(
      toReservationDraft({ eventId: EVENT_ID, sector: campo, selection: [], quantity: 2 }),
    ).toEqual({ eventId: EVENT_ID, eventSectorId: 18, quantity: 2 })
  })

  it.each([
    ['sin asientos elegidos', { sector: platea, quantity: 0 }],
    ['con la cantidad en 0', { sector: campo, quantity: 0 }],
    ['sin sector abierto', { sector: undefined, quantity: 2 }],
  ])('%s no hay reserva', (_case, { sector, quantity }) => {
    expect(toReservationDraft({ eventId: EVENT_ID, sector, selection: [], quantity })).toBe(
      undefined,
    )
  })
})
