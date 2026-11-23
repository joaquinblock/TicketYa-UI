import { describe, expect, it } from 'vitest'
import { adjustQuantityToAvailable } from './quantityAdjustment'

describe('adjustQuantityToAvailable', () => {
  it('si los libres siguen alcanzando, la cantidad no cambia y no hay aviso', () => {
    expect(adjustQuantityToAvailable({ quantity: 3, availablePlaces: 3 })).toEqual({
      quantity: 3,
      change: 'NONE',
    })
  })

  it('si quedan menos libres que la cantidad, la baja a los libres y avisa que bajó', () => {
    expect(adjustQuantityToAvailable({ quantity: 3, availablePlaces: 2 })).toEqual({
      quantity: 2,
      change: 'LOWERED',
    })
  })
})
