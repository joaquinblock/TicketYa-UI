import { screen } from '@testing-library/react'
import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import { EVENT_TYPE_LABEL } from '../constants/catalog.constants'
import { formatEventDateTime } from '../lib/eventFormat'
import { getEvent } from '../services/events.service'

/**
 * Anclas de "Datos de prueba" (`event-service.md`): el id fija el caso, y los datos (nombre, lugar,
 * fecha) se comparan con lo que responde el service, no con valores fijos.
 */
const SEEDER_EVENT = {
  HIGH_DEMAND_ON_SALE: 1,
  ON_SALE_WITHOUT_SALE_START: 2,
  DRAFT: 3,
  SALE_NOT_STARTED: 4,
  SOLD_OUT: 6,
  SUSPENDED: 7,
  CANCELLED: 8,
  FINISHED: 9,
  BOARD_WITHOUT_PARTICIPANTS: 13,
} as const

function renderEventPage(eventId: number | string) {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route: ROUTES.event(eventId) },
  )
}

describe('Detalle del evento: CA1', () => {
  it('muestra el tipo, el nombre, la descripción, la fecha y el lugar del evento', async () => {
    const event = await getEvent(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)
    renderEventPage(event.id)

    expect(await screen.findByRole('heading', { level: 1, name: event.name })).toBeInTheDocument()
    expect(screen.getByText(EVENT_TYPE_LABEL[event.type].singular)).toBeInTheDocument()
    expect(screen.getByText(event.description ?? '')).toBeInTheDocument()
    expect(screen.getByText(formatEventDateTime(event.dateTime))).toBeInTheDocument()
    expect(screen.getByText(`${event.venue.name} · ${event.venue.city}`)).toBeInTheDocument()
  })

  it('"El evento" muestra los participantes, la apertura de la venta y la dirección', async () => {
    const event = await getEvent(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)
    renderEventPage(event.id)

    const facts = await findEventFacts()
    expect(within(facts).getByText('Participan').nextSibling).toHaveTextContent(
      event.participants.map((participant) => participant.name).join(', '),
    )
    expect(within(facts).getByText('Venta desde').nextSibling).toHaveTextContent(
      formatEventDateTime(event.saleStart ?? ''),
    )
    expect(within(facts).getByText('Ubicación').nextSibling).toHaveTextContent(
      `${event.venue.name} · ${event.venue.address}, ${event.venue.city}`,
    )
  })

  it('"Ver en el mapa" abre Google Maps en las coordenadas del evento, en otra pestaña', async () => {
    const event = await getEvent(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)
    renderEventPage(event.id)

    const mapLink = within(await findEventFacts()).getByRole('link', { name: /Ver en el mapa/ })
    expect(mapLink).toHaveAttribute(
      'href',
      `https://www.google.com/maps/search/?api=1&query=${event.venue.latitude},${event.venue.longitude}`,
    )
    expect(mapLink).toHaveAttribute('target', '_blank')
    expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('un evento de alta demanda lo dice en el hero', async () => {
    const event = await getEvent(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)
    renderEventPage(event.id)

    expect(
      within(await findEventHero(event.name)).getByText('Alta demanda · fila virtual'),
    ).toBeInTheDocument()
  })
})

function findEventHero(eventName: string) {
  return screen.findByRole('region', { name: eventName })
}

function findEventFacts() {
  return screen.findByRole('complementary', { name: 'El evento' })
}
