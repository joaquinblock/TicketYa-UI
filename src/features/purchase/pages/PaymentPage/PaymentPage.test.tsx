import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
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
        quantity: 1,
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
