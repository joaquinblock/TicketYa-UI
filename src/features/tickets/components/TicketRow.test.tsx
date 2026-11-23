import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TICKET_STATUS_META } from '../constants/tickets.constants'
import { formatTicketCode } from '../lib/ticketFormat'
import type { Ticket, TicketStatus } from '../types/tickets.types'
import { TicketRow } from './TicketRow'

function makeTicket(status: TicketStatus): Ticket {
  return {
    id: 99,
    eventSectorId: 1,
    sectorName: 'Platea',
    seatId: 10,
    row: 'B',
    number: 4,
    price: 30000,
    status,
    qrCode: null,
  }
}

describe('TicketRow: estados no vigentes', () => {
  it.each(['USED', 'REFUNDED'] as const)(
    'para estado %s muestra su badge, mensaje y marca el QR como no vigente',
    async (status) => {
      const ticket = makeTicket(status)
      const code = formatTicketCode(ticket.id)
      const meta = TICKET_STATUS_META[status]
      const user = userEvent.setup()

      render(<TicketRow ticket={ticket} />)

      const button = screen.getByRole('button', { name: new RegExp(code) })
      expect(button).toHaveTextContent(meta.label)

      await user.click(button)

      expect(
        await screen.findByRole('img', { name: `Código QR no vigente de la entrada ${code}` }),
      ).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: meta.title })).toBeInTheDocument()
      expect(screen.getByText(meta.description)).toBeInTheDocument()
    },
  )
})

describe('TicketRow: devolución de entradas', () => {
  it('cuando está ISSUED con devolución pendiente muestra Devolución pendiente, QR atenuado y sin botón de devolución', async () => {
    const ticket: Ticket = {
      ...makeTicket('ISSUED'),
      qrCode: 'qr-123',
      hasPendingReturnRequest: true,
    }
    const code = formatTicketCode(ticket.id)
    const user = userEvent.setup()

    render(<TicketRow ticket={ticket} />)

    const button = screen.getByRole('button', { name: new RegExp(code) })
    expect(button).toHaveTextContent('Devolución pendiente')

    await user.click(button)

    expect(
      await screen.findByRole('img', { name: `Código QR no vigente de la entrada ${code}` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Estamos revisando tu devolución' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Un administrador está revisando tu pedido. Mientras tanto, este QR no sirve para entrar.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /pedir la devolución/i })).not.toBeInTheDocument()
  })
})
