import { describe, expect, it } from 'vitest'
import { formatPlacesLeft, getOccupancyPercent } from './sectorAvailability'

describe('formatPlacesLeft y getOccupancyPercent', () => {
  it('con 1240 de 5000 libres dice "1.240 disponibles" y ocupa el 75 %', () => {
    expect(formatPlacesLeft(1240)).toBe('1.240 disponibles')
    expect(getOccupancyPercent({ capacity: 5000, availablePlaces: 1240 })).toBe(75)
  })
})
