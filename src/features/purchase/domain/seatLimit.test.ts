import { describe, expect, it } from 'vitest'
import { isSeatPickable } from './seatLimit'

describe('isSeatPickable', () => {
  it('con menos elegidos que el límite, un asiento libre se puede tocar', () => {
    expect(isSeatPickable({ selectedCount: 3, isSelected: false, maxTicketsPerCustomer: 4 })).toBe(
      true,
    )
  })

  it('con el límite completo, un asiento libre no elegido no se puede tocar', () => {
    expect(isSeatPickable({ selectedCount: 4, isSelected: false, maxTicketsPerCustomer: 4 })).toBe(
      false,
    )
  })

  it('con el límite completo, un asiento elegido se puede destildar', () => {
    expect(isSeatPickable({ selectedCount: 4, isSelected: true, maxTicketsPerCustomer: 4 })).toBe(
      true,
    )
  })

  it('sin límite por persona, siempre se puede tocar', () => {
    expect(
      isSeatPickable({ selectedCount: 40, isSelected: false, maxTicketsPerCustomer: null }),
    ).toBe(true)
  })
})
