import { describe, expect, it } from 'vitest'
import { toggleSeat } from './seatSelection'

describe('toggleSeat', () => {
  it('elegir un asiento que no estaba lo agrega', () => {
    expect(toggleSeat([3], 7)).toEqual([3, 7])
  })

  it('elegirlo de nuevo lo saca', () => {
    expect(toggleSeat([3, 7], 7)).toEqual([3])
  })
})
