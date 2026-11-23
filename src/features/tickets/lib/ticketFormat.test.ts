import { describe, expect, it } from 'vitest'
import { formatTicketCode, formatTicketLocation } from './ticketFormat'

describe('ticketFormat', () => {
  it('formatea una entrada numerada con sector, fila y asiento', () => {
    expect(
      formatTicketLocation({
        sectorName: 'Platea',
        row: 'A',
        number: 1,
      }),
    ).toBe('Platea · Fila A, asiento 1')
  })

  it('formatea una entrada no numerada solo con el sector', () => {
    expect(
      formatTicketLocation({
        sectorName: 'Campo',
        row: null,
        number: null,
      }),
    ).toBe('Campo')
  })

  it('formatea el código de entrada como TY- seguido de 5 dígitos', () => {
    expect(formatTicketCode(1)).toBe('TY-00001')
    expect(formatTicketCode(481)).toBe('TY-00481')
  })
})
