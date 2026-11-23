import { describe, expect, it } from 'vitest'
import { adjustQuantityToAvailable } from './quantityAdjustment'

describe('adjustQuantityToAvailable', () => {
  it('si los libres siguen alcanzando, la cantidad no cambia y no hay aviso', () => {
    expect(adjustQuantityToAvailable({ quantity: 3, availablePlaces: 3 })).toEqual({
      quantity: 3,
      change: 'NONE',
    })
  })
})
