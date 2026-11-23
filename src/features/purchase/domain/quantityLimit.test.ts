import { describe, expect, it } from 'vitest'
import { getQuantityLimit } from './quantityLimit'

describe('getQuantityLimit', () => {
  it('con 4 por persona y 5.000 libres, el tope es 4', () => {
    expect(getQuantityLimit({ availablePlaces: 5000, maxTicketsPerCustomer: 4 })).toBe(4)
  })

  it('con 4 por persona y 1 libre, el tope es 1', () => {
    expect(getQuantityLimit({ availablePlaces: 1, maxTicketsPerCustomer: 4 })).toBe(1)
  })

  it('sin límite por persona, el tope es lo que queda libre', () => {
    expect(getQuantityLimit({ availablePlaces: 1240, maxTicketsPerCustomer: null })).toBe(1240)
  })
})
