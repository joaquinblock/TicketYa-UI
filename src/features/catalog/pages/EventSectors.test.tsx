import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getCurrentUrl, LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import { formatPrice } from '@/shared/utils/eventFormat'
import { getAvailability } from '@/shared/services/availability.service'
import { getEvent } from '@/shared/services/events.service'
import { formatPlacesLeft } from '../utils/sectorFormat'

/**
 * Anclas de "Datos de prueba" (`event-service.md` y `ticket-service.md`): el id fija el caso, y los
 * sectores y lugares se comparan con lo que responden los services, no con valores fijos.
 */
const SEEDER_EVENT = {
  HIGH_DEMAND_ON_SALE: 1,
  ON_SALE_WITHOUT_HIGH_DEMAND: 2,
  SALE_NOT_STARTED: 4,
  SOLD_OUT: 6,
  SUSPENDED: 7,
  CANCELLED: 8,
  FINISHED: 9,
} as const

function renderEventPage(eventId: number) {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route: ROUTES.event(eventId) },
  )
}

async function findSectorRows() {
  const section = await screen.findByRole('region', { name: 'Sectores y precios' })
  return within(section).findAllByRole('listitem')
}

describe('Sectores y precios: CA1', () => {
  it('muestra una fila por sector con su nombre, su precio y los lugares que quedan', async () => {
    const [event, availability] = await Promise.all([
      getEvent(SEEDER_EVENT.HIGH_DEMAND_ON_SALE),
      getAvailability(SEEDER_EVENT.HIGH_DEMAND_ON_SALE),
    ])
    renderEventPage(event.id)

    const rows = await findSectorRows()
    expect(rows).toHaveLength(event.sectors.length)
    event.sectors.forEach((sector, index) => {
      const placesLeft = availability.sectors.find(
        (candidate) => candidate.sectorName === sector.name,
      )?.availablePlaces
      const row = within(rows[index])
      expect(row.getByText(sector.name)).toBeInTheDocument()
      expect(row.getByText(formatPrice(sector.price))).toBeInTheDocument()
      expect(row.getByText(formatPlacesLeft(placesLeft ?? -1))).toBeInTheDocument()
    })
  })
})

describe('Sectores y precios: CA2', () => {
  it('con alta demanda, "Entrar a la fila" lleva a la fila virtual del evento', async () => {
    const user = userEvent.setup()
    renderEventPage(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)

    await user.click(await screen.findByRole('link', { name: /Entrar a la fila/ }))

    expect(getCurrentUrl().pathname).toBe(ROUTES.queue(SEEDER_EVENT.HIGH_DEMAND_ON_SALE))
  })

  it('sin alta demanda, "Elegir lugares" lleva a Lugares del evento', async () => {
    const user = userEvent.setup()
    renderEventPage(SEEDER_EVENT.ON_SALE_WITHOUT_HIGH_DEMAND)

    await user.click(await screen.findByRole('link', { name: /Elegir lugares/ }))

    expect(getCurrentUrl().pathname).toBe(ROUTES.seats(SEEDER_EVENT.ON_SALE_WITHOUT_HIGH_DEMAND))
  })

  it('debajo del botón avisa el límite por persona del evento y las devoluciones', async () => {
    const event = await getEvent(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)
    renderEventPage(event.id)

    const button = await screen.findByRole('link', { name: /Entrar a la fila/ })
    const terms = screen.getByText(
      `Hasta ${event.maxTicketsPerCustomer} entradas por persona · Devoluciones hasta 72 horas antes del evento`,
    )
    expect(button.compareDocumentPosition(terms)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})

const PLACES_TEXT = /disponibles|Últimos|Agotado/
const PURCHASE_LINK = /Entrar a la fila|Elegir lugares/

describe('Sectores y precios: sin compra', () => {
  it('el evento agotado dice "Agotado" en cada sector y no tiene botón de compra', async () => {
    const event = await getEvent(SEEDER_EVENT.SOLD_OUT)
    renderEventPage(event.id)

    const rows = await findSectorRows()
    expect(rows).toHaveLength(event.sectors.length)
    for (const row of rows) expect(within(row).getByText('Agotado')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: PURCHASE_LINK })).not.toBeInTheDocument()
  })

  it.each([
    ['con la venta todavía cerrada', SEEDER_EVENT.SALE_NOT_STARTED],
    ['suspendido', SEEDER_EVENT.SUSPENDED],
    ['cancelado', SEEDER_EVENT.CANCELLED],
    ['finalizado', SEEDER_EVENT.FINISHED],
  ])('%s muestra cada sector con nombre y precio, sin lugares ni botón', async (_, eventId) => {
    const event = await getEvent(eventId)
    renderEventPage(eventId)

    const rows = await findSectorRows()
    expect(rows).toHaveLength(event.sectors.length)
    event.sectors.forEach((sector, index) => {
      const row = within(rows[index])
      expect(row.getByText(sector.name)).toBeInTheDocument()
      expect(row.getByText(formatPrice(sector.price))).toBeInTheDocument()
      expect(row.queryByText(PLACES_TEXT)).not.toBeInTheDocument()
    })
    expect(screen.queryByRole('link', { name: PURCHASE_LINK })).not.toBeInTheDocument()
  })
})

describe('Sectores y precios: CA5', () => {
  it('mientras pide la disponibilidad avisa "Cargando sectores", y al llegar muestra las filas', async () => {
    renderEventPage(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)

    const section = await screen.findByRole('region', { name: 'Sectores y precios' })
    expect(within(section).getByText('Cargando sectores')).toBeInTheDocument()
    expect(await within(section).findAllByRole('listitem')).not.toHaveLength(0)
    expect(within(section).queryByText('Cargando sectores')).not.toBeInTheDocument()
  })
})

const AVAILABILITY_PATH = '/api/availability'

/** Corta solo la disponibilidad, como si se cayera el ticket-service: el detalle sigue cargando. */
function failAvailabilityRequests() {
  const realFetch = globalThis.fetch
  return vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
    const url = input instanceof Request ? input.url : String(input)
    if (url.includes(AVAILABILITY_PATH)) return Promise.reject(new TypeError('Failed to fetch'))
    return realFetch(input, init)
  })
}

describe('Sectores y precios: CA5 error', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sin la disponibilidad avisa el error con "Reintentar", y al volver muestra los sectores', async () => {
    const event = await getEvent(SEEDER_EVENT.HIGH_DEMAND_ON_SALE)
    const availabilityDown = failAvailabilityRequests()
    const user = userEvent.setup()
    renderEventPage(event.id)

    const section = await screen.findByRole('region', { name: 'Sectores y precios' })
    const error = await within(section).findByRole('alert')
    expect(error).toHaveTextContent('No pudimos cargar los sectores')
    expect(screen.getByRole('heading', { level: 1, name: event.name })).toBeInTheDocument()

    availabilityDown.mockRestore()
    await user.click(within(error).getByRole('button', { name: 'Reintentar' }))

    expect(await within(section).findAllByRole('listitem')).toHaveLength(event.sectors.length)
    expect(within(section).queryByRole('alert')).not.toBeInTheDocument()
  })
})
