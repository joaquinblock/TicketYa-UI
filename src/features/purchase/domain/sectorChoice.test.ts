import { describe, expect, it } from 'vitest'
import type { SectorAvailability } from '@/shared/types/event.types'
import { pickInitialSector } from './sectorChoice'

const sectorWith = (eventSectorId: number, availablePlaces: number): SectorAvailability => ({
  eventSectorId,
  sectorName: `Sector ${eventSectorId}`,
  price: 1000,
  numbered: true,
  availablePlaces,
  seats: [],
})

describe('pickInitialSector', () => {
  it('con varios sectores con lugares, abre el primero', () => {
    const sectors = [sectorWith(10, 5), sectorWith(20, 8)]

    expect(pickInitialSector(sectors)?.eventSectorId).toBe(10)
  })

  it('si el primero está agotado, abre el segundo', () => {
    const sectors = [sectorWith(10, 0), sectorWith(20, 8), sectorWith(30, 3)]

    expect(pickInitialSector(sectors)?.eventSectorId).toBe(20)
  })

  it('con todos agotados, no abre ninguno', () => {
    const sectors = [sectorWith(10, 0), sectorWith(20, 0)]

    expect(pickInitialSector(sectors)).toBeUndefined()
  })
})
