import { describe, expect, it } from 'vitest'
import { formatPlacesLeft, getOccupancyPercent } from './sectorAvailability'

describe('formatPlacesLeft y getOccupancyPercent', () => {
  it('con 1240 de 5000 libres dice "1.240 disponibles" y ocupa el 75 %', () => {
    expect(formatPlacesLeft(1240)).toBe('1.240 disponibles')
    expect(getOccupancyPercent({ capacity: 5000, availablePlaces: 1240 })).toBe(75)
  })
})

describe('formatPlacesLeft: últimos lugares', () => {
  it.each([
    [9, 'Últimos 9 lugares'],
    [10, '10 disponibles'],
    [1, 'Últimos 1 lugares'],
  ])('con %i libres dice "%s"', (availablePlaces, label) => {
    expect(formatPlacesLeft(availablePlaces)).toBe(label)
  })
})
