import { screen } from '@testing-library/react'
import { within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { LocationProbe } from '@/test/LocationProbe'
import { getCurrentUrl } from '@/test/LocationProbe'
import userEvent from '@testing-library/user-event'
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

  it('sin participantes no muestra "Participan"', async () => {
    const event = await getEvent(SEEDER_EVENT.BOARD_WITHOUT_PARTICIPANTS)
    expect(event.participants).toEqual([])
    renderEventPage(event.id)

    expect(within(await findEventFacts()).queryByText('Participan')).not.toBeInTheDocument()
  })

  it('sin apertura de la venta no muestra "Venta desde"', async () => {
    const event = await getEvent(SEEDER_EVENT.ON_SALE_WITHOUT_SALE_START)
    expect(event.saleStart).toBeNull()
    renderEventPage(event.id)

    expect(within(await findEventFacts()).queryByText('Venta desde')).not.toBeInTheDocument()
  })
})

describe('Detalle del evento: CA2', () => {
  it('con la venta todavía cerrada avisa cuándo abre, y no avisa la alta demanda', async () => {
    const event = await getEvent(SEEDER_EVENT.SALE_NOT_STARTED)
    expect(event.highDemand).toBe(true)
    renderEventPage(event.id)

    const notice = await findEventNotice()
    expect(notice).toHaveTextContent('La venta todavía no empezó')
    expect(notice).toHaveTextContent(`Abre el ${formatEventDateTime(event.saleStart ?? '')}.`)
    expect(notice).not.toHaveTextContent('fila virtual')
  })

  it.each([
    [SEEDER_EVENT.SOLD_OUT, 'Agotado', 'Entradas agotadas'],
    [SEEDER_EVENT.SUSPENDED, 'Suspendido', 'Evento suspendido'],
    [SEEDER_EVENT.CANCELLED, 'Cancelado', 'Evento cancelado'],
    [SEEDER_EVENT.FINISHED, 'Finalizado', 'Este evento ya pasó'],
  ])('el evento %i muestra el badge "%s" y el aviso "%s"', async (eventId, badge, title) => {
    const event = await getEvent(eventId)
    renderEventPage(event.id)

    expect(within(await findEventHero(event.name)).getByText(badge)).toBeInTheDocument()
    expect(await findEventNotice()).toHaveTextContent(title)
  })

  it('a la venta, sin alta demanda y con la venta abierta no muestra ningún aviso', async () => {
    const event = await getEvent(SEEDER_EVENT.ON_SALE_WITHOUT_SALE_START)
    expect(event).toMatchObject({ status: 'PUBLISHED', highDemand: false, saleStart: null })
    renderEventPage(event.id)

    await screen.findByRole('heading', { level: 1, name: event.name })
    expect(screen.queryByRole('region', { name: 'Aviso' })).not.toBeInTheDocument()
  })

  it.each(Object.values(SEEDER_EVENT).filter((id) => id !== SEEDER_EVENT.DRAFT))(
    'el evento %i no muestra ningún código de estado del backend',
    async (eventId) => {
      const event = await getEvent(eventId)
      renderEventPage(event.id)

      await screen.findByRole('heading', { level: 1, name: event.name })
      for (const code of BACKEND_STATUS_CODES) expect(document.body).not.toHaveTextContent(code)
    },
  )
})

const BACKEND_STATUS_CODES = ['PUBLISHED', 'SOLD_OUT', 'SUSPENDED', 'CANCELLED', 'FINISHED']

const MISSING_EVENT_ID = 999999

describe('Detalle del evento: CA3', () => {
  it('un id inexistente muestra "No encontramos este evento", y "Volver a explorar" lleva a Inicio', async () => {
    const user = userEvent.setup()
    renderEventPage(MISSING_EVENT_ID)

    expect(
      await screen.findByRole('heading', { name: 'No encontramos este evento' }),
    ).toBeInTheDocument()
    const backLinks = screen.getAllByRole('link', { name: /Volver a explorar/ })
    expect(backLinks).toHaveLength(1)

    await user.click(backLinks[0])

    expect(getCurrentUrl().pathname).toBe(ROUTES.home)
  })

  it.each([SEEDER_EVENT.DRAFT, 'abc'])(
    '/eventos/%s muestra "No encontramos este evento"',
    async (eventId) => {
      renderEventPage(eventId)

      expect(
        await screen.findByRole('heading', { name: 'No encontramos este evento' }),
      ).toBeInTheDocument()
    },
  )
})

describe('Detalle del evento: CA4', () => {
  it('mientras carga anuncia "Cargando evento" y no muestra los datos', () => {
    renderEventPage(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)

    expect(screen.getByText('Cargando evento')).toHaveAttribute('role', 'status')
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })
})

function findEventNotice() {
  return screen.findByRole('region', { name: 'Aviso' })
}

function findEventHero(eventName: string) {
  return screen.findByRole('region', { name: eventName })
}

function findEventFacts() {
  return screen.findByRole('complementary', { name: 'El evento' })
}
