import { describe, expect, it } from 'vitest'
import { formatPlacesLeft, formatSectorKind, getOccupancyPercent } from './sectorFormat'

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

describe('formatSectorKind: numerado', () => {
  const seatsInRows = (rows: string[]) =>
    rows.map((row, index) => ({ seatId: index + 1, row, number: index + 1, available: true }))

  it('con asientos desordenados en las filas A a D dice "Numerado · filas A a D"', () => {
    const seats = seatsInRows(['C', 'A', 'D', 'B', 'A'])
    expect(formatSectorKind({ numbered: true, seats })).toBe('Numerado · filas A a D')
  })

  it('con una sola fila dice "Numerado · fila A"', () => {
    const seats = seatsInRows(['A', 'A', 'A'])
    expect(formatSectorKind({ numbered: true, seats })).toBe('Numerado · fila A')
  })
})

describe('formatSectorKind: no numerado', () => {
  it('un sector sin asientos numerados dice "No numerado"', () => {
    expect(formatSectorKind({ numbered: false, seats: null })).toBe('No numerado')
  })
})
