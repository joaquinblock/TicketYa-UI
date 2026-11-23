import { describe, expect, it } from 'vitest'
import { formatSectorTabLabel } from './seatFormat'

describe('formatSectorTabLabel', () => {
  it('con lugares muestra el precio con formato', () => {
    expect(formatSectorTabLabel({ price: 20000, availablePlaces: 12 })).toBe('$20.000')
  })

  it('con 0 lugares muestra "Agotado"', () => {
    expect(formatSectorTabLabel({ price: 20000, availablePlaces: 0 })).toBe('Agotado')
  })
})
