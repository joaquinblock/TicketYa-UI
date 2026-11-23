import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { renderWithProviders } from '@/test/render'
import { PAYMENT_METHOD_LABEL, TICKET_STATUS_META } from '../constants/tickets.constants'
import { formatOrderPrice, formatTicketCode, formatTicketLocation } from '../lib/ticketFormat'
import { getOrders } from '../services/orders.service'

function renderMyTicketsPage() {
  return renderWithProviders(<AppRouter />, { route: ROUTES.myTickets })
}

describe('Mis entradas: CA1', () => {
  it('muestra las órdenes PAID de más nueva a más vieja con sus entradas y oculta las no pagadas', async () => {
    const token = await devLogin(SEEDER_USER.CLIENT)
    localStorage.setItem('ticketya.accessToken', token)
    const allOrders = await getOrders()
    localStorage.clear()

    const paidOrders = allOrders
      .filter((order) => order.status === 'PAID')
      .sort((a, b) => b.id - a.id)
    const unpaidOrders = allOrders.filter((order) => order.status !== 'PAID')
    expect(paidOrders.length).toBeGreaterThanOrEqual(2)
    expect(unpaidOrders.length).toBeGreaterThanOrEqual(1)

    renderMyTicketsPage()

    expect(await screen.findByRole('heading', { level: 1, name: /Mis entradas/ })).toBeInTheDocument()

    const articles = await screen.findAllByRole('article')
    expect(articles).toHaveLength(paidOrders.length)

    paidOrders.forEach((order, index) => {
      const card = articles[index]
      expect(within(card).getByRole('heading', { level: 2, name: order.event.name })).toBeInTheDocument()
      expect(
        within(card).getByText(`${order.event.venueName} · ${order.event.venueCity}`),
      ).toBeInTheDocument()
      expect(within(card).getByText(`ORDEN #${order.id}`)).toBeInTheDocument()
      if (order.paymentMethod) {
        expect(within(card).getByText(PAYMENT_METHOD_LABEL[order.paymentMethod])).toBeInTheDocument()
      }
      expect(within(card).getByText(formatOrderPrice(order.total))).toBeInTheDocument()

      for (const ticket of order.tickets) {
        const button = within(card).getByRole('button', {
          name: new RegExp(formatTicketCode(ticket.id)),
        })
        expect(within(button).getByText(formatTicketLocation(ticket))).toBeInTheDocument()
        expect(within(button).getByText(formatOrderPrice(ticket.price))).toBeInTheDocument()
        expect(
          within(button).getByText(TICKET_STATUS_META[ticket.status].label),
        ).toBeInTheDocument()
      }
    })

    for (const unpaid of unpaidOrders) {
      expect(screen.queryByText(`ORDEN #${unpaid.id}`)).not.toBeInTheDocument()
    }
  })
})
