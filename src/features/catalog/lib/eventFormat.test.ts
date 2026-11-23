import { describe, expect, it } from 'vitest'
import { formatEventDateTime } from './eventFormat'

describe('formatEventDateTime', () => {
  it('muestra el día, el mes corto, el año y la hora local del evento, sin correrse por la zona horaria', () => {
    expect(formatEventDateTime('2026-12-13T21:00:00')).toBe('13 dic 2026 · 21:00 hs')
  })
})
