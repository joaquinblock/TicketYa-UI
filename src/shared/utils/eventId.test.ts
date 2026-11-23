import { describe, expect, it } from 'vitest'
import { parseEventId } from './eventId'

describe('parseEventId', () => {
  it('convierte un entero positivo de la URL en el id del evento', () => {
    expect(parseEventId('15')).toBe(15)
  })

  it.each(['abc', '0', '-3', '1.5', ''])('"%s" no es un id de evento', (param) => {
    expect(parseEventId(param)).toBeUndefined()
  })
})
