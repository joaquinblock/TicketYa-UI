import { describe, expect, it } from 'vitest'
import {
  formatTicketCode,
  formatTicketLocation,
  isWithinReturnDeadline,
} from './ticketFormat'

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

  describe('isWithinReturnDeadline', () => {
    const eventDateTime = '2026-12-10T21:00:00'

    it('devuelve true cuando faltan exactamente 72 horas o más', () => {
      const exactly72hBefore = new Date(2026, 11, 7, 21, 0, 0)
      const moreThan72hBefore = new Date(2026, 11, 6, 10, 0, 0)

      expect(isWithinReturnDeadline(eventDateTime, exactly72hBefore)).toBe(true)
      expect(isWithinReturnDeadline(eventDateTime, moreThan72hBefore)).toBe(true)
    })

    it('devuelve false cuando faltan menos de 72 horas o el evento ya pasó', () => {
      const under72hBefore = new Date(2026, 11, 7, 21, 0, 1)
      const pastEvent = new Date(2026, 11, 11, 0, 0, 0)

      expect(isWithinReturnDeadline(eventDateTime, under72hBefore)).toBe(false)
      expect(isWithinReturnDeadline(eventDateTime, pastEvent)).toBe(false)
    })
  })
})
