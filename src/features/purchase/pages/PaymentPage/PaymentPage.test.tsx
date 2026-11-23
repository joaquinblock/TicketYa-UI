import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ApiError } from '@/shared/lib/http/ApiError'
import * as paymentService from '../../services/payment.service'
import { apiClient } from '@/shared/lib/http/apiClient'
import { ROUTES } from '@/shared/lib/routes'
import { saveAccessToken } from '@/shared/lib/session'
import { getAvailability } from '@/shared/services/availability.service'
import { formatEventDateTime, formatPrice } from '@/shared/utils/eventFormat'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import { PAYMENT_METHOD_META } from '../../constants/payment.constants'
import type { Order } from '../../types/payment.types'

async function authenticateClient() {
  const token = await devLogin(SEEDER_USER.CLIENT)
  saveAccessToken(token)
}

async function createRealPendingOrder(): Promise<Order> {
  await authenticateClient()
  // Eventos de cartelera (11+) tienen venta abierta, no son alta demanda y admiten hasta 4 entradas.
  const page = await apiClient.get<{ content: Array<{ id: number; highDemand: boolean }> }>(
    '/api/events',
    { params: { page: 0, size: 20 } },
  )
  for (const candidate of page.content) {
    if (candidate.highDemand) continue
    const availability = await getAvailability(candidate.id)
    const generalSector = availability.sectors.find((s) => !s.numbered && s.availablePlaces >= 2)
    if (!generalSector) continue
    try {
      return await apiClient.post<Order>('/api/orders', {
        eventId: candidate.id,
        idempotencyKey: crypto.randomUUID(),
        eventSectorId: generalSector.eventSectorId,
        quantity: 2,
      })
    } catch {
      // Si el cliente del seeder ya alcanzó el tope en este evento, probamos el siguiente.
    }
  }
  throw new Error('No se pudo crear una orden PENDING de prueba en el backend')
}

function renderPaymentPage(route: string) {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route },
  )
}

describe('Pago: CA1', () => {
  it('muestra el contador de reserva, los 3 medios de pago y el resumen de la orden activa', async () => {
    const order = await createRealPendingOrder()

    try {
      renderPaymentPage(`${ROUTES.payment(order.eventId)}?orderId=${order.id}`)

      expect(
        await screen.findByRole('heading', { level: 1, name: '¿Cómo querés pagar?' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('timer', { name: /Tiempo restante/i })).toHaveTextContent(
        /^\d{2}:\d{2}$/,
      )

      expect(
        screen.getByRole('radio', { name: PAYMENT_METHOD_META.CREDIT_CARD.label }),
      ).toBeChecked()
      expect(
        screen.getByRole('radio', { name: PAYMENT_METHOD_META.DEBIT_CARD.label }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('radio', { name: PAYMENT_METHOD_META.ACCOUNT_MONEY.label }),
      ).toBeInTheDocument()

      expect(screen.getByText(`TICKETYA · ORDEN #${order.id}`)).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: order.event.name })).toBeInTheDocument()
      expect(screen.getByText(formatEventDateTime(order.event.dateTime))).toBeInTheDocument()
      expect(screen.getAllByText(formatPrice(order.total)).length).toBeGreaterThanOrEqual(1)
      expect(
        screen.getByRole('button', { name: `Pagar ${formatPrice(order.total)}` }),
      ).toBeInTheDocument()
    } finally {
      await apiClient.post(`/api/orders/${order.id}/cancel`).catch(() => undefined)
    }
  })
})

describe('Pago: CA1 fallback y 404, CA2, CA3, CA4, CA5 y CA6', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('CA1 fallback: sin orderId busca la orden PENDING del evento y con 404 muestra sin reserva activa', async () => {
    const order = await createRealPendingOrder()
    try {
      renderPaymentPage(ROUTES.payment(order.eventId))
      expect(await screen.findByText(`TICKETYA · ORDEN #${order.id}`)).toBeInTheDocument()
    } finally {
      await apiClient.post(`/api/orders/${order.id}/cancel`).catch(() => undefined)
    }

    renderPaymentPage(`${ROUTES.payment(order.eventId)}?orderId=999999`)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'No encontramos una reserva activa' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Elegir lugares de nuevo' })).toHaveAttribute(
      'href',
      ROUTES.seats(order.eventId),
    )
  })

  it('CA2 éxito: al pagar con Tarjeta de crédito muestra confirmación y links a Mis entradas e Inicio', async () => {
    const user = userEvent.setup()
    const order = await createRealPendingOrder()

    renderPaymentPage(`${ROUTES.payment(order.eventId)}?orderId=${order.id}`)
    const payButton = await screen.findByRole('button', {
      name: `Pagar ${formatPrice(order.total)}`,
    })
    await user.click(payButton)

    expect(
      await screen.findByRole('heading', { level: 1, name: /¡Listo! Ya tenés tus entradas/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver mis entradas' })).toHaveAttribute(
      'href',
      ROUTES.myTickets,
    )
    expect(screen.getByRole('link', { name: 'Seguir explorando' })).toHaveAttribute(
      'href',
      ROUTES.home,
    )
    const stepsNav = screen.getByRole('navigation', { name: 'Pasos de la compra' })
    expect(within(stepsNav).getByText('Pago').closest('li')).not.toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('CA3 rechazos: Tarjeta de débito muestra alerta e Intento N de 3, y al 3er rechazo finaliza la orden', async () => {
    const user = userEvent.setup()
    const order = await createRealPendingOrder()

    try {
      renderPaymentPage(`${ROUTES.payment(order.eventId)}?orderId=${order.id}`)
      const debitRadio = await screen.findByRole('radio', {
        name: PAYMENT_METHOD_META.DEBIT_CARD.label,
      })
      await user.click(debitRadio)

      const payBtn = screen.getByRole('button', { name: `Pagar ${formatPrice(order.total)}` })
      await user.click(payBtn)
      expect(await screen.findByText(/Intento 1 de 3/)).toBeInTheDocument()

      await user.click(payBtn)
      expect(await screen.findByText(/Intento 2 de 3/)).toBeInTheDocument()

      await user.click(payBtn)
      expect(
        await screen.findByRole('heading', { level: 1, name: 'El pago se rechazó 3 veces' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Elegir lugares de nuevo' })).toHaveAttribute(
        'href',
        ROUTES.seats(order.eventId),
      )
    } finally {
      await apiClient.post(`/api/orders/${order.id}/cancel`).catch(() => undefined)
    }
  })

  it('CA4 sin respuesta (503): reintenta con exactamente la misma idempotencyKey y luego aprueba', async () => {
    const user = userEvent.setup()
    const order = await createRealPendingOrder()

    try {
      const paySpy = vi
        .spyOn(paymentService, 'payOrder')
        .mockRejectedValueOnce(
          new ApiError({ error: 'service_unavailable', message: 'Sin respuesta', status: 503 }),
        )
        .mockResolvedValueOnce({ ...order, status: 'PAID', paymentMethod: 'CREDIT_CARD' })

      renderPaymentPage(`${ROUTES.payment(order.eventId)}?orderId=${order.id}`)
      const payBtn = await screen.findByRole('button', {
        name: `Pagar ${formatPrice(order.total)}`,
      })
      await user.click(payBtn)

      expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos confirmar el pago')
      const retryBtn = screen.getByRole('button', { name: 'Reintentar el pago' })
      await user.click(retryBtn)

      await waitFor(() => expect(paySpy).toHaveBeenCalledTimes(2))
      expect(paySpy.mock.calls[0][1].idempotencyKey).toBe(paySpy.mock.calls[1][1].idempotencyKey)
      expect(
        await screen.findByRole('heading', { level: 1, name: /¡Listo! Ya tenés tus entradas/ }),
      ).toBeInTheDocument()
    } finally {
      await apiClient.post(`/api/orders/${order.id}/cancel`).catch(() => undefined)
    }
  })

  it('CA5 vencimiento: si la orden ya venció o el servidor responde reservation_expired pasa a Se venció tu reserva', async () => {
    const user = userEvent.setup()
    const order = await createRealPendingOrder()

    try {
      vi.spyOn(paymentService, 'payOrder').mockRejectedValueOnce(
        new ApiError({ error: 'reservation_expired', message: 'Expirada', status: 409 }),
      )

      renderPaymentPage(`${ROUTES.payment(order.eventId)}?orderId=${order.id}`)
      await user.click(
        await screen.findByRole('button', { name: `Pagar ${formatPrice(order.total)}` }),
      )

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Se venció tu reserva' }),
      ).toBeInTheDocument()
    } finally {
      await apiClient.post(`/api/orders/${order.id}/cancel`).catch(() => undefined)
    }
  })

  it('CA6 abandonar reserva: cancela en el backend y ante 409 payment_in_progress mantiene la reserva', async () => {
    const user = userEvent.setup()
    const order = await createRealPendingOrder()

    try {
      const cancelSpy = vi
        .spyOn(paymentService, 'cancelOrder')
        .mockRejectedValueOnce(
          new ApiError({ error: 'payment_in_progress', message: 'En curso', status: 409 }),
        )

      renderPaymentPage(`${ROUTES.payment(order.eventId)}?orderId=${order.id}`)
      const abandonBtn = await screen.findByRole('button', { name: 'Abandonar la reserva' })
      await user.click(abandonBtn)

      expect(await screen.findByRole('alert')).toHaveTextContent('Hay un pago en curso')
      cancelSpy.mockRestore()

      await user.click(screen.getByRole('button', { name: 'Abandonar la reserva' }))
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Abandonaste la reserva' }),
      ).toBeInTheDocument()
    } finally {
      await apiClient.post(`/api/orders/${order.id}/cancel`).catch(() => undefined)
    }
  })
})
