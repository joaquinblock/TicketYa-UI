import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { setupApiClient } from '@/app/setupApiClient'
import { configureApiClient } from '@/shared/lib/http/apiClient'
import { ROUTES } from '@/shared/lib/routes'
import { saveAccessToken } from '@/shared/lib/session'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { getCurrentUrl, LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import {
  PAYMENT_METHOD_LABEL,
  PENDING_RETURN_TICKET_META,
  TICKET_STATUS_META,
} from '../constants/tickets.constants'
import { formatOrderPrice, formatTicketCode, formatTicketLocation } from '../lib/ticketFormat'
import { getOrders } from '../services/orders.service'

function renderMyTicketsPage() {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route: ROUTES.myTickets },
  )
}

describe('Mis entradas: CA1', () => {
  it('muestra las órdenes PAID de más nueva a más vieja con sus entradas y oculta las no pagadas', async () => {
    const token = await devLogin(SEEDER_USER.CLIENT)
    localStorage.setItem('ticketya.accessToken', token)
    const allOrders = await getOrders()

    const paidOrders = allOrders
      .filter((order) => order.status === 'PAID')
      .sort((a, b) => b.id - a.id)
    const unpaidOrders = allOrders.filter((order) => order.status !== 'PAID')
    expect(paidOrders.length).toBeGreaterThanOrEqual(2)
    expect(unpaidOrders.length).toBeGreaterThanOrEqual(1)

    renderMyTicketsPage()

    expect(
      await screen.findByRole('heading', { level: 1, name: /Mis entradas/ }),
    ).toBeInTheDocument()

    const articles = await screen.findAllByRole('article')
    expect(articles).toHaveLength(paidOrders.length)

    paidOrders.forEach((order, index) => {
      const card = articles[index]
      expect(
        within(card).getByRole('heading', { level: 2, name: order.event.name }),
      ).toBeInTheDocument()
      expect(
        within(card).getByText(`${order.event.venueName} · ${order.event.venueCity}`),
      ).toBeInTheDocument()
      expect(within(card).getByText(`ORDEN #${order.id}`)).toBeInTheDocument()
      if (order.paymentMethod) {
        expect(
          within(card).getByText(PAYMENT_METHOD_LABEL[order.paymentMethod]),
        ).toBeInTheDocument()
      }
      expect(
        within(card).getAllByText(formatOrderPrice(order.total)).length,
      ).toBeGreaterThanOrEqual(1)

      for (const ticket of order.tickets) {
        const button = within(card).getByRole('button', {
          name: new RegExp(formatTicketCode(ticket.id)),
        })
        expect(within(button).getByText(formatTicketLocation(ticket))).toBeInTheDocument()
        expect(within(button).getByText(formatOrderPrice(ticket.price))).toBeInTheDocument()
        const expectedStatusLabel =
          ticket.status === 'ISSUED' && ticket.hasPendingReturnRequest
            ? PENDING_RETURN_TICKET_META.label
            : TICKET_STATUS_META[ticket.status].label
        expect(within(button).getByText(expectedStatusLabel)).toBeInTheDocument()
      }
    })

    for (const unpaid of unpaidOrders) {
      expect(screen.queryByText(`ORDEN #${unpaid.id}`)).not.toBeInTheDocument()
    }
  })
})

describe('Mis entradas: CA2', () => {
  it('al tocar una entrada muestra su QR, código y mensaje de estado, y al volver a tocarla se colapsa', async () => {
    const token = await devLogin(SEEDER_USER.CLIENT)
    localStorage.setItem('ticketya.accessToken', token)
    const allOrders = await getOrders()

    const firstPaidOrder = allOrders
      .filter((order) => order.status === 'PAID')
      .sort((a, b) => b.id - a.id)[0]
    const ticket = firstPaidOrder.tickets[0]
    const code = formatTicketCode(ticket.id)
    const statusMeta = TICKET_STATUS_META[ticket.status]
    const user = userEvent.setup()

    renderMyTicketsPage()

    const ticketButton = await screen.findByRole('button', { name: new RegExp(code) })
    expect(ticketButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(ticketButton)

    expect(ticketButton).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByRole('img', { name: new RegExp(code) })).toBeInTheDocument()
    expect(screen.getByText(code)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: statusMeta.title })).toBeInTheDocument()
    expect(screen.getByText(statusMeta.description)).toBeInTheDocument()

    await user.click(ticketButton)

    expect(ticketButton).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('heading', { level: 3, name: statusMeta.title }),
    ).not.toBeInTheDocument()
  })
})

describe('Mis entradas: CA3', () => {
  it('cuando no tiene compras pagadas muestra el estado vacío con un link para explorar eventos', async () => {
    const token = await devLogin(SEEDER_USER.ORGANIZER)
    saveAccessToken(token)
    const user = userEvent.setup()

    renderMyTicketsPage()

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Todavía no tenés compras' }),
    ).toBeInTheDocument()
    const exploreLink = screen.getByRole('link', { name: 'Explorar eventos' })
    expect(exploreLink).toHaveAttribute('href', ROUTES.home)

    await user.click(exploreLink)
    expect(getCurrentUrl().pathname).toBe(ROUTES.home)
  })
})

describe('Mis entradas: CA4', () => {
  it('mientras se están pidiendo las órdenes muestra el indicador de carga', () => {
    renderMyTicketsPage()

    expect(screen.getByText('Cargando tus entradas').closest('[role="status"]')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Todavía no tenés compras' }),
    ).not.toBeInTheDocument()
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })

  it('cuando falla la carga muestra el error y "Reintentar" vuelve a pedir las órdenes', async () => {
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    pointApiClientToClosedPort()
    const user = userEvent.setup()
    renderMyTicketsPage()

    expect(
      await screen.findByRole(
        'heading',
        { level: 2, name: 'No pudimos cargar tus entradas' },
        NETWORK_FAILURE_TIMEOUT,
      ),
    ).toBeInTheDocument()

    setupApiClient()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    const articles = await screen.findAllByRole('article')
    expect(articles.length).toBeGreaterThanOrEqual(2)
  })
})

const NETWORK_FAILURE_TIMEOUT = { timeout: 10_000 }

function pointApiClientToClosedPort() {
  configureApiClient({
    baseUrl: 'http://localhost:1',
    getAccessToken: () => undefined,
    onUnauthorized: () => {},
  })
}

describe('Mis entradas: solicitud de devolución', () => {
  it('muestra aviso y botón deshabilitado en orden < 72 h, Devolución pendiente del seeder, y permite abrir y cancelar el diálogo en una entrada elegible', async () => {
    const token = await devLogin(SEEDER_USER.CLIENT)
    localStorage.setItem('ticketya.accessToken', token)
    const allOrders = await getOrders()

    const paidOrders = allOrders.filter((order) => order.status === 'PAID')
    const pastOrder = paidOrders.find((order) => order.eventId === 9)
    const pendingOrder = paidOrders.find((order) =>
      order.tickets.some((ticket) => ticket.hasPendingReturnRequest),
    )
    const eligibleOrder = paidOrders.find(
      (order) =>
        order.eventId !== 9 &&
        order.tickets.some(
          (ticket) => ticket.status === 'ISSUED' && !ticket.hasPendingReturnRequest,
        ),
    )

    expect(pastOrder).toBeDefined()
    expect(pendingOrder).toBeDefined()
    expect(eligibleOrder).toBeDefined()

    const user = userEvent.setup()
    renderMyTicketsPage()

    const pastCard = await screen.findByRole('article', {
      name: `Orden ${pastOrder!.id}, ${pastOrder!.event.name}`,
    })
    expect(
      within(pastCard).getByText(
        'Faltan menos de 72 horas para este evento: ya no se pueden pedir devoluciones.',
      ),
    ).toBeInTheDocument()

    await user.click(
      within(pastCard).getByRole('button', {
        name: new RegExp(formatTicketCode(pastOrder!.tickets[0].id)),
      }),
    )
    expect(
      await within(pastCard).findByRole('button', { name: 'Pedir la devolución' }),
    ).toBeDisabled()

    const pendingTicket = pendingOrder!.tickets.find((ticket) => ticket.hasPendingReturnRequest)!
    const pendingCard = screen.getByRole('article', {
      name: `Orden ${pendingOrder!.id}, ${pendingOrder!.event.name}`,
    })
    expect(
      within(pendingCard).getByRole('button', {
        name: new RegExp(formatTicketCode(pendingTicket.id)),
      }),
    ).toHaveTextContent('Devolución pendiente')

    const eligibleTicket = eligibleOrder!.tickets.find(
      (ticket) => ticket.status === 'ISSUED' && !ticket.hasPendingReturnRequest,
    )!
    const eligibleCard = screen.getByRole('article', {
      name: `Orden ${eligibleOrder!.id}, ${eligibleOrder!.event.name}`,
    })
    await user.click(
      within(eligibleCard).getByRole('button', {
        name: new RegExp(formatTicketCode(eligibleTicket.id)),
      }),
    )
    await user.click(
      await within(eligibleCard).findByRole('button', { name: /pedir la devolución/i }),
    )

    const dialog = await screen.findByRole('dialog', { name: '¿Pedir la devolución?' })
    expect(
      within(dialog).getByText(
        `${eligibleOrder!.event.name} · ${formatTicketLocation(eligibleTicket)}`,
      ),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText(
        new RegExp(`te reintegramos ${formatOrderPrice(eligibleTicket.price).replace('$', '\\$')}`),
      ),
    ).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'No, volver' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('Mis entradas: #8 CA5, sin sesión', () => {
  it('se abre el login, detrás dice que inicie sesión y al entrar se cargan mis entradas', async () => {
    const user = userEvent.setup()
    renderMyTicketsPage()

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Iniciá sesión para ver tus entradas.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Ingresá a TicketYa' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continuar con Google' }))
    await user.click(screen.getByRole('button', { name: /client@ticketya.com/ }))

    expect((await screen.findAllByRole('article')).length).toBeGreaterThanOrEqual(1)
  })
})
