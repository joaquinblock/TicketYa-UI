import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getEvent } from '@/shared/services/events.service'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'

/**
 * Anclas de "Datos de prueba" (`ticket-service.md`): en el evento 2 la Platea tiene A1 y A2
 * vendidos y hay una Pullman; en el evento 11 la Platea está agotada. Lo demás se compara con lo
 * que responde el service.
 */
const SEEDER_EVENT = {
  PLATEA_WITH_SOLD_SEATS: 2,
  PLATEA_SOLD_OUT: 11,
  WITHOUT_PRICES: 999999,
} as const

function renderSeatsPage(eventId: number) {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route: ROUTES.seats(eventId) },
  )
}

describe('Lugares: CA1, encabezado', () => {
  it('arriba del título muestra el nombre del evento, la fecha y el lugar', async () => {
    const event = await getEvent(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    renderSeatsPage(event.id)

    const eyebrow = await screen.findByText(
      `${event.name} · ${formatEventDateTime(event.dateTime)} · ${event.venue.name}`,
    )
    const title = screen.getByRole('heading', { level: 1, name: 'Elegí tus lugares.' })
    expect(eyebrow.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
