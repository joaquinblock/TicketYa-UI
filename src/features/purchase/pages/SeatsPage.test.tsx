import { focusManager } from '@tanstack/react-query'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { EventAvailability, SeatAvailability } from '@/shared/types/event.types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { setupApiClient } from '@/app/setupApiClient'
import { configureApiClient } from '@/shared/lib/http/apiClient'
import { ROUTES } from '@/shared/lib/routes'
import { getAvailability } from '@/shared/services/availability.service'
import { getEvent } from '@/shared/services/events.service'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import { getCurrentUrl, LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import { formatSectorTabLabel, formatUnnumberedPlaces } from '../utils/seatFormat'

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

describe('Lugares: CA1, estado de cada asiento', () => {
  it('en la Platea del evento 2, A1 y A2 están ocupados', async () => {
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    expect(
      await screen.findByRole('button', { name: 'Fila A, asiento 1, ocupado' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fila A, asiento 2, ocupado' })).toBeInTheDocument()
  })

  it('cada asiento que el service da como libre se llama "disponible"', async () => {
    const sector = await firstSectorWithPlaces(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    await screen.findByRole('region', { name: `Mapa de ${sector.sectorName}` })
    for (const seat of sector.seats?.filter((candidate) => candidate.available) ?? []) {
      expect(
        screen.getByRole('button', {
          name: `Fila ${seat.row}, asiento ${seat.number}, disponible`,
        }),
      ).toBeInTheDocument()
    }
  })
})

describe('Lugares: CA2, pestañas', () => {
  it('hay una pestaña por sector con su nombre y su etiqueta, y queda abierto el primero con lugares', async () => {
    const { sectors } = await getAvailability(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const firstWithPlaces = await firstSectorWithPlaces(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    const tabs = await findSectorTabs()
    expect(within(tabs).getAllByRole('button')).toHaveLength(sectors.length)
    for (const sector of sectors) {
      const tab = within(tabs).getByRole('button', {
        name: `${sector.sectorName} ${formatSectorTabLabel(sector)}`,
      })
      const isOpen = sector.eventSectorId === firstWithPlaces.eventSectorId
      expect(tab).toHaveAttribute('aria-pressed', String(isOpen))
    }
  })
})

describe('Lugares: CA2, sector agotado', () => {
  it('en el evento 11 la pestaña Platea dice "Agotado" y está deshabilitada, y queda abierta la Pullman', async () => {
    renderSeatsPage(SEEDER_EVENT.PLATEA_SOLD_OUT)

    const tabs = await findSectorTabs()
    expect(within(tabs).getByRole('button', { name: 'Platea Agotado' })).toBeDisabled()
    expect(within(tabs).getByRole('button', { name: /^Pullman / })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})

describe('Lugares: CA3, elegir y soltar', () => {
  it('tocar un asiento disponible lo deja elegido, y tocarlo de nuevo lo vuelve a disponible', async () => {
    const seat = await firstFreeSeat(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    await user.click(await screen.findByRole('button', { name: seatName(seat, 'disponible') }))
    expect(screen.getByRole('button', { name: seatName(seat, 'elegido') })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await user.click(screen.getByRole('button', { name: seatName(seat, 'elegido') }))
    expect(screen.getByRole('button', { name: seatName(seat, 'disponible') })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})

describe('Lugares: CA2, cambiar de pestaña', () => {
  it('muestra el mapa del otro sector, y al volver el asiento elegido está disponible', async () => {
    const seat = await firstFreeSeat(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    await user.click(await screen.findByRole('button', { name: seatName(seat, 'disponible') }))
    const tabs = screen.getByRole('group', { name: 'Sectores' })
    await user.click(within(tabs).getByRole('button', { name: /^Pullman / }))
    expect(screen.getByRole('region', { name: 'Mapa de Pullman' })).toBeInTheDocument()

    await user.click(within(tabs).getByRole('button', { name: /^Platea / }))
    expect(screen.getByRole('button', { name: seatName(seat, 'disponible') })).toBeInTheDocument()
  })
})

describe('Lugares: CA2, tocar la pestaña abierta', () => {
  it('no vacía la selección', async () => {
    const seat = await firstFreeSeat(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    await user.click(await screen.findByRole('button', { name: seatName(seat, 'disponible') }))
    const tabs = screen.getByRole('group', { name: 'Sectores' })
    await user.click(within(tabs).getByRole('button', { pressed: true }))

    expect(screen.getByRole('button', { name: seatName(seat, 'elegido') })).toBeInTheDocument()
  })
})

describe('Lugares: CA4, un asiento ocupado no se elige', () => {
  it('A1 de la Platea del evento 2 está deshabilitado, y tocarlo no lo cambia', async () => {
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    const taken = await screen.findByRole('button', { name: 'Fila A, asiento 1, ocupado' })
    expect(taken).toBeDisabled()

    await user.click(taken)
    expect(screen.getByRole('button', { name: 'Fila A, asiento 1, ocupado' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})

describe('Lugares: CA5, el refresco quita un asiento elegido', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    focusManager.setFocused(undefined)
  })

  it('el asiento pasa a ocupado y se ve el aviso con su código, sin recargar', async () => {
    const seat = await firstFreeSeat(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    await user.click(await screen.findByRole('button', { name: seatName(seat, 'disponible') }))

    takeSeatsOnNextRefreshes([seat.seatId])
    refetchByRefocusing()

    const alert = await screen.findByRole('alert', {
      name: `El asiento ${seat.row}${seat.number} lo acaba de reservar otra persona.`,
    })
    expect(alert).toHaveTextContent('Lo sacamos de tu elección: elegí otro.')
    expect(screen.getByRole('button', { name: seatName(seat, 'ocupado') })).toBeDisabled()
  })
})

describe('Lugares: CA5, el foco no se pierde', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    focusManager.setFocused(undefined)
  })

  it('si el refresco ocupa el asiento que tenía el foco, el foco pasa al aviso', async () => {
    const seat = await firstFreeSeat(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const seatButton = await screen.findByRole('button', { name: seatName(seat, 'disponible') })
    seatButton.focus()
    await user.keyboard('{Enter}')

    takeSeatsOnNextRefreshes([seat.seatId])
    refetchByRefocusing()

    expect(
      await screen.findByRole('alert', { name: /lo acaba de reservar otra persona/ }),
    ).toHaveFocus()
  })
})

describe('Lugares: CA5, dos asientos a la vez', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    focusManager.setFocused(undefined)
  })

  it('si el mismo refresco ocupa dos asientos elegidos, un solo aviso nombra a los dos', async () => {
    const [first, second] = await freeSeats(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS, 2)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    await user.click(await screen.findByRole('button', { name: seatName(first, 'disponible') }))
    await user.click(screen.getByRole('button', { name: seatName(second, 'disponible') }))

    takeSeatsOnNextRefreshes([first.seatId, second.seatId])
    refetchByRefocusing()

    const codes = `${first.row}${first.number} y ${second.row}${second.number}`
    expect(
      await screen.findByRole('alert', {
        name: `Los asientos ${codes} los acaba de reservar otra persona.`,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('alert')).toHaveLength(1)
  })
})

describe('Lugares: CA5, el aviso se va', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    focusManager.setFocused(undefined)
  })

  async function showTakenSeatAlert() {
    const [taken, other] = await freeSeats(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS, 2)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    await user.click(await screen.findByRole('button', { name: seatName(taken, 'disponible') }))
    takeSeatsOnNextRefreshes([taken.seatId])
    refetchByRefocusing()
    await screen.findByRole('alert', { name: /lo acaba de reservar otra persona/ })
    return { user, other }
  }

  it('desaparece al elegir otro asiento', async () => {
    const { user, other } = await showTakenSeatAlert()

    await user.click(screen.getByRole('button', { name: seatName(other, 'disponible') }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('desaparece al cambiar de sector', async () => {
    const { user } = await showTakenSeatAlert()

    const tabs = screen.getByRole('group', { name: 'Sectores' })
    await user.click(within(tabs).getByRole('button', { name: /^Pullman / }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('Lugares: CA6, cargando', () => {
  it('mientras la disponibilidad no respondió, muestra el mapa en carga y ningún asiento', async () => {
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    expect(screen.getByRole('status', { name: 'Cargando lugares' })).toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: SEAT_NAME })).toHaveLength(0)

    expect(await screen.findAllByRole('button', { name: SEAT_NAME })).not.toHaveLength(0)
    expect(screen.queryByRole('status', { name: 'Cargando lugares' })).not.toBeInTheDocument()
  })
})

describe('Lugares: CA6, error', () => {
  afterEach(() => {
    setupApiClient()
  })

  it('con el gateway caído avisa el error, y "Reintentar" con el gateway de vuelta muestra el mapa', async () => {
    const sector = await firstSectorWithPlaces(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    pointApiClientToClosedPort()
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)

    const error = await screen.findByRole(
      'alert',
      { name: 'No pudimos cargar los lugares' },
      NETWORK_FAILURE_TIMEOUT,
    )

    setupApiClient()
    await user.click(within(error).getByRole('button', { name: 'Reintentar' }))

    expect(
      await screen.findByRole('region', { name: `Mapa de ${sector.sectorName}` }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('Lugares: CA6, reintentando', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    setupApiClient()
  })

  it('mientras vuelve a pedir, el error deja lugar al mapa en carga', async () => {
    pointApiClientToClosedPort()
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const error = await screen.findByRole(
      'alert',
      { name: 'No pudimos cargar los lugares' },
      NETWORK_FAILURE_TIMEOUT,
    )

    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise<Response>(() => {}))
    await user.click(within(error).getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('status', { name: 'Cargando lugares' })).toBeInTheDocument()
    expect(error).not.toBeInTheDocument()
  })
})

describe('Lugares: CA6, sin venta', () => {
  it('con el evento 999999 avisa que no tiene lugares a la venta, sin "Reintentar", y el link lleva al evento', async () => {
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.WITHOUT_PRICES)

    const notForSale = await screen.findByRole('region', {
      name: 'Este evento no tiene lugares a la venta',
    })
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument()

    await user.click(within(notForSale).getByRole('link'))
    expect(getCurrentUrl().pathname).toBe(ROUTES.event(SEEDER_EVENT.WITHOUT_PRICES))
  })
})

describe('Lugares: borde, un refresco que falla', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    focusManager.setFocused(undefined)
  })

  it('con un asiento elegido, si el refresco de la disponibilidad falla, el mapa y la selección siguen', async () => {
    const seat = await firstFreeSeat(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    const user = userEvent.setup()
    renderSeatsPage(SEEDER_EVENT.PLATEA_WITH_SOLD_SEATS)
    await user.click(await screen.findByRole('button', { name: seatName(seat, 'disponible') }))

    const availabilityDown = failAvailabilityRequests()
    refetchByRefocusing()
    await waitFor(() => expect(availabilityDown).toHaveBeenCalled())

    expect(
      await screen.findByRole('button', { name: seatName(seat, 'elegido') }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('alert', { name: 'No pudimos cargar los lugares' }),
    ).not.toBeInTheDocument()
  })
})

/** Corta solo la disponibilidad, como si se cayera el ticket-service: el evento sigue cargando. */
function failAvailabilityRequests() {
  const realFetch = globalThis.fetch
  return vi.spyOn(globalThis, 'fetch').mockImplementation((input, init) => {
    const url = input instanceof Request ? input.url : String(input)
    if (url.includes(AVAILABILITY_PATH)) return Promise.reject(new TypeError('Failed to fetch'))
    return realFetch(input, init)
  })
}

/** Un puerto bloqueado para fetch: la llamada falla de verdad, sin mock. */
function pointApiClientToClosedPort() {
  configureApiClient({
    baseUrl: 'http://localhost:1',
    getAccessToken: () => undefined,
    onUnauthorized: () => {},
  })
}

const NETWORK_FAILURE_TIMEOUT = { timeout: 10_000 }

async function freeSeats(eventId: number, count: number) {
  const sector = await firstSectorWithPlaces(eventId)
  const seats = (sector.seats ?? []).filter((candidate) => candidate.available).slice(0, count)
  if (seats.length < count)
    throw new Error(`El sector ${sector.sectorName} no tiene ${count} libres`)
  return seats
}

const AVAILABILITY_PATH = '/api/availability'

/** Desde acá, cada respuesta de la disponibilidad trae esos asientos ocupados por otra persona. */
function takeSeatsOnNextRefreshes(seatIds: number[]) {
  const realFetch = globalThis.fetch
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const response = await realFetch(input, init)
    const url = input instanceof Request ? input.url : String(input)
    if (!url.includes(AVAILABILITY_PATH)) return response
    const availability = (await response.json()) as EventAvailability
    for (const seat of availability.sectors.flatMap((sector) => sector.seats ?? [])) {
      if (seatIds.includes(seat.seatId)) seat.available = false
    }
    return Response.json(availability)
  })
}

/** La disponibilidad se vuelve a pedir al recuperar el foco, como al volver a la pestaña. */
function refetchByRefocusing() {
  act(() => focusManager.setFocused(false))
  act(() => focusManager.setFocused(true))
}

function seatName(seat: SeatAvailability, status: string) {
  return `Fila ${seat.row}, asiento ${seat.number}, ${status}`
}

async function firstFreeSeat(eventId: number) {
  const sector = await firstSectorWithPlaces(eventId)
  const seat = sector.seats?.find((candidate) => candidate.available)
  if (!seat) throw new Error(`El sector ${sector.sectorName} no tiene asientos libres`)
  return seat
}

function findSectorTabs() {
  return screen.findByRole('group', { name: 'Sectores' })
}

const SEAT_NAME = /^Fila \w+, asiento \d+, /

async function firstSectorWithPlaces(eventId: number) {
  const { sectors } = await getAvailability(eventId)
  const sector = sectors.find((candidate) => candidate.availablePlaces > 0)
  if (!sector) throw new Error(`El evento ${eventId} no tiene sectores con lugares`)
  return sector
}

/**
 * En los dos el Campo es el primer sector con lugares, así que la página abre con él. Ancla de
 * "Datos de prueba" (`ticket-service.md`): en el 45 queda 1 lugar en Campo. Del 43 los números
 * se toman de la respuesta.
 */
const UNNUMBERED_EVENT = {
  FIELD_WITH_PLACES: 43,
  FIELD_ONE_PLACE_LEFT: 45,
} as const

describe('Lugares no numerados: CA1, panel de cantidad', () => {
  it('en el evento 43, con el Campo abierto, muestra el escenario, el sector, la cantidad en 1 y los lugares libres de la capacidad', async () => {
    const field = await unnumberedSectorOf(UNNUMBERED_EVENT.FIELD_WITH_PLACES)
    renderSeatsPage(UNNUMBERED_EVENT.FIELD_WITH_PLACES)

    const panel = await findQuantityPanel(field.sectorName)
    expect(within(panel).getByText('Escenario')).toBeInTheDocument()
    expect(
      within(panel).getByRole('img', { name: `${field.sectorName} frente al escenario` }),
    ).toBeInTheDocument()
    expect(quantityIn(panel)).toHaveTextContent(/^1$/)
    expect(
      within(panel).getByText(
        formatUnnumberedPlaces({
          availablePlaces: field.availablePlaces,
          capacity: field.capacity,
        }),
      ),
    ).toBeInTheDocument()
  })
})

/** El sector no numerado, con la capacidad del detalle y el límite por persona del evento. */
async function unnumberedSectorOf(eventId: number) {
  const [{ sectors }, event] = await Promise.all([getAvailability(eventId), getEvent(eventId)])
  const availability = sectors.find((sector) => !sector.numbered)
  const detail = event.sectors.find((sector) => sector.name === availability?.sectorName)
  if (!availability || !detail) throw new Error(`El evento ${eventId} no tiene sector no numerado`)
  return {
    ...availability,
    capacity: detail.capacity,
    maxTicketsPerCustomer: event.maxTicketsPerCustomer,
  }
}

function findQuantityPanel(sectorName: string) {
  return screen.findByRole('region', { name: `Cantidad en ${sectorName}` })
}

function quantityGroupIn(panel: HTMLElement) {
  return within(panel).getByRole('group', { name: 'Cantidad de entradas' })
}

/** El número entre "Una menos" y "Una más". */
function quantityIn(panel: HTMLElement) {
  return within(quantityGroupIn(panel)).getByText(/^\d+$/)
}
