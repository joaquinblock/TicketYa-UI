import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Order } from '../types/tickets.types'
import { OrderCard } from './OrderCard'

const DEADLINE_WARNING =
  'Faltan menos de 72 horas para este evento: ya no se pueden pedir devoluciones.'

function toLocalDateTimeString(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
}

function makeOrder(hoursFromNow: number): Order {
  const date = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000)
  return {
    id: 10,
    eventId: 1,
    event: {
      name: 'Los Serranos en vivo',
      dateTime: toLocalDateTimeString(date),
      venueName: 'Estadio del Sur',
      venueAddress: 'Av. del Estadio 1000',
      venueCity: 'Buenos Aires',
    },
    status: 'PAID',
    expiresAt: '2026-12-01T10:00:00',
    total: 45000,
    paymentMethod: 'CREDIT_CARD',
    tickets: [
      {
        id: 1,
        eventSectorId: 1,
        sectorName: 'Campo',
        seatId: null,
        row: null,
        number: null,
        price: 45000,
        status: 'ISSUED',
        qrCode: 'qr-1',
        hasPendingReturnRequest: false,
      },
    ],
  }
}

describe('OrderCard: aviso de plazo de devolución', () => {
  it('muestra el aviso cuando faltan menos de 72 horas o el evento ya pasó', () => {
    const { rerender } = render(<OrderCard order={makeOrder(48)} />)
    expect(screen.getByText(DEADLINE_WARNING)).toBeInTheDocument()

    rerender(<OrderCard order={makeOrder(-24)} />)
    expect(screen.getByText(DEADLINE_WARNING)).toBeInTheDocument()
  })

  it('no muestra el aviso cuando faltan 72 horas o más', () => {
    render(<OrderCard order={makeOrder(96)} />)
    expect(screen.queryByText(DEADLINE_WARNING)).not.toBeInTheDocument()
  })
})
