import { describe, expect, it } from 'vitest'
import type { EventSector, SectorAvailability } from '../types/catalog.types'
import { joinSectorsWithAvailability } from './sectorAvailability'

const detailSector = (sectorId: number, name: string): EventSector => ({
  sectorId,
  name,
  numbered: false,
  capacity: 100,
  price: 1000,
})

const availabilityOf = (
  eventSectorId: number,
  sectorName: string,
  availablePlaces: number,
): SectorAvailability => ({
  eventSectorId,
  sectorName,
  price: 1000,
  numbered: false,
  availablePlaces,
  seats: null,
})

describe('joinSectorsWithAvailability: unión por nombre', () => {
  it('cada sector toma la disponibilidad de su mismo nombre y queda en el orden del detalle', () => {
    const sectors = [
      detailSector(1, 'Campo'),
      detailSector(2, 'Platea'),
      detailSector(3, 'Pullman'),
    ]
    const availability = [
      availabilityOf(30, 'Pullman', 7),
      availabilityOf(10, 'Campo', 50),
      availabilityOf(20, 'Platea', 0),
    ]

    const joined = joinSectorsWithAvailability(sectors, availability)

    expect(joined.map(({ name, availability }) => [name, availability?.availablePlaces])).toEqual([
      ['Campo', 50],
      ['Platea', 0],
      ['Pullman', 7],
    ])
  })

  it('un sector del detalle sin par en la disponibilidad queda con nombre y precio, sin lugares', () => {
    const joined = joinSectorsWithAvailability(
      [detailSector(1, 'Campo'), detailSector(2, 'Palco')],
      [availabilityOf(10, 'Campo', 50)],
    )

    expect(joined[1]).toEqual({ ...detailSector(2, 'Palco'), availability: undefined })
  })
})
