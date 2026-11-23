import { describe, expect, it } from 'vitest'
import { getAvailability } from './availability.service'
import { getEvent } from './events.service'

/** Ancla de "Datos de prueba": el evento 1 está a la venta, con un sector no numerado y otro numerado. */
const ON_SALE_EVENT_ID = 1

describe('getAvailability', () => {
  it('trae cada sector del evento con su precio y lugares entre 0 y su capacidad', async () => {
    const [availability, event] = await Promise.all([
      getAvailability(ON_SALE_EVENT_ID),
      getEvent(ON_SALE_EVENT_ID),
    ])
    const capacityByName = new Map(event.sectors.map((sector) => [sector.name, sector.capacity]))

    expect(availability.eventId).toBe(ON_SALE_EVENT_ID)
    expect(availability.sectors.map((sector) => sector.sectorName).sort()).toEqual(
      [...capacityByName.keys()].sort(),
    )
    for (const sector of availability.sectors) {
      expect(sector.price).toBeGreaterThan(0)
      expect(sector.availablePlaces).toBeGreaterThanOrEqual(0)
      expect(sector.availablePlaces).toBeLessThanOrEqual(capacityByName.get(sector.sectorName)!)
      if (!sector.numbered) expect(sector.seats).toBeNull()
    }
  })
})
