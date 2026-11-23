import { describe, expect, it } from 'vitest'
import type { OrderTicket } from '../types/payment.types'
import { formatCountdown, getRemainingSeconds, summarizeOrderTickets } from './paymentFormat'

const BASE_TICKET: OrderTicket = {
  id: 1,
  eventSectorId: 10,
  sectorName: 'Platea baja',
  seatId: 100,
  row: 'F',
  number: 6,
  price: 68000,
  status: 'RESERVED',
  qrCode: null,
}

describe('paymentFormat', () => {
  it('calcula los segundos restantes hasta expiresAt y devuelve 0 si ya venció', () => {
    const now = new Date(2026, 10, 23, 17, 0, 0).getTime()
    expect(getRemainingSeconds('2026-11-23T17:09:42', now)).toBe(582)
    expect(getRemainingSeconds('2026-11-23T16:59:59', now)).toBe(0)
  })

  it('formatea el contador en MM:SS con ceros a la izquierda', () => {
    expect(formatCountdown(582)).toBe('09:42')
    expect(formatCountdown(65)).toBe('01:05')
    expect(formatCountdown(0)).toBe('00:00')
  })

  it('agrupa asientos numerados de una misma fila y resume entradas no numeradas', () => {
    const numbered: OrderTicket[] = [BASE_TICKET, { ...BASE_TICKET, id: 2, seatId: 101, number: 7 }]
    expect(summarizeOrderTickets(numbered)).toEqual([
      { key: '10-F', label: 'Platea baja · Fila F, asientos 6 y 7', subtotal: 136000 },
    ])

    const general: OrderTicket[] = [
      {
        ...BASE_TICKET,
        id: 3,
        eventSectorId: 11,
        sectorName: 'Campo',
        seatId: null,
        row: null,
        number: null,
        price: 52000,
      },
      {
        ...BASE_TICKET,
        id: 4,
        eventSectorId: 11,
        sectorName: 'Campo',
        seatId: null,
        row: null,
        number: null,
        price: 52000,
      },
    ]
    expect(summarizeOrderTickets(general)).toEqual([
      { key: '11-general', label: 'Campo × 2', subtotal: 104000 },
    ])
  })
})
