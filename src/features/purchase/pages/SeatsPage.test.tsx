import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getAvailability } from '@/shared/services/availability.service'
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

describe('Lugares: CA1, mapa', () => {
  it('muestra el escenario y un botón por asiento del sector abierto, con la letra de cada fila a los dos lados', async () => {
    const sector = await firstSectorWithPlaces(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    const map = await screen.findByRole('region', { name: `Mapa de ${sector.sectorName}` })
    expect(within(map).getByText('Escenario')).toBeInTheDocument()
    expect(within(map).getAllByRole('button', { name: SEAT_NAME })).toHaveLength(
      sector.seats?.length ?? 0,
    )
    for (const row of new Set(sector.seats?.map((seat) => seat.row))) {
      expect(within(map).getAllByText(row, { exact: true })).toHaveLength(2)
    }
  })
})

const SEAT_NAME = /^Fila \w+, asiento \d+, /

async function firstSectorWithPlaces(eventId: number) {
  const { sectors } = await getAvailability(eventId)
  const sector = sectors.find((candidate) => candidate.availablePlaces > 0)
  if (!sector) throw new Error(`El evento ${eventId} no tiene sectores con lugares`)
  return sector
}
