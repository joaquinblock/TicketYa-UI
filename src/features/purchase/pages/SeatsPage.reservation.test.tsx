import { focusManager } from '@tanstack/react-query'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getAvailability } from '@/shared/services/availability.service'
import { getEvent } from '@/shared/services/events.service'
import type { EventAvailability, SeatAvailability } from '@/shared/types/event.types'
import { formatPrice } from '@/shared/utils/eventFormat'
import { saveAccessToken } from '@/shared/lib/session'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { getCurrentUrl, LocationProbe } from '@/test/LocationProbe'
import type { Order, OrderTicket } from '../types/payment.types'
import { renderWithProviders } from '@/test/render'

/**
 * Eventos de la cartelera (13 a 42 en "Datos de prueba" de `ticket-service.md`), hasta 4 por
 * persona y con un solo sector. Cada test usa el suyo, para que las reservas de uno no le cambien
 * los lugares libres a otro. Los asientos y los precios se toman de la respuesta.
 */
const NUMBERED_EVENT = {
  SUMMARY: 17,
  SEAT_LIMIT: 18,
  RESERVING: 25,
  RESERVED: 26,
  DOUBLE_CLICK: 27,
  SEAT_TAKEN: 29,
  LIMIT_REACHED: 39,
} as const

const UNNUMBERED_EVENT = {
  SUMMARY: 13,
  SOLD_OUT_ON_REFRESH: 14,
  RESERVED: 31,
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

describe('Lugares: CA1, ver mi selección', () => {
  it('con 2 asientos elegidos, "Tu selección" muestra una línea por asiento, el total y "2/4"', async () => {
    const eventId = NUMBERED_EVENT.SUMMARY
    const { maxTicketsPerCustomer } = await getEvent(eventId)
    const { sector, seats } = await freeSeats(eventId, 2)
    const user = userEvent.setup()
    renderSeatsPage(eventId)

    for (const seat of seats) await user.click(await findFreeSeatButton(seat))

    const summary = screen.getByRole('complementary', { name: 'Tu selección' })
    const lines = within(summary).getAllByRole('listitem')
    expect(lines.map((line) => line.textContent)).toEqual(
      seats.map(
        (seat) =>
          `${sector.sectorName} · fila ${seat.row}, asiento ${seat.number}${formatPrice(sector.price)}`,
      ),
    )
    expect(within(summary).getByText(formatPrice(2 * sector.price))).toBeInTheDocument()
    expect(within(summary).getByText(`2/${maxTicketsPerCustomer}`)).toBeInTheDocument()
  })
})

describe('Lugares: CA1, ver mi selección en un sector no numerado', () => {
  it('con la cantidad en 2, "Tu selección" muestra una sola línea "2 × <sector>" con el precio por 2', async () => {
    const eventId = UNNUMBERED_EVENT.SUMMARY
    const sector = await unnumberedSectorOf(eventId)
    const user = userEvent.setup()
    renderSeatsPage(eventId)

    await user.click(await screen.findByRole('button', { name: 'Una más' }))

    const summary = screen.getByRole('complementary', { name: 'Tu selección' })
    const lines = within(summary).getAllByRole('listitem')
    expect(lines.map((line) => line.textContent)).toEqual([
      `2 × ${sector.sectorName}${formatPrice(2 * sector.price)}`,
    ])
    expect(within(summary).getAllByText(formatPrice(2 * sector.price))).toHaveLength(2)
  })
})

describe('Lugares: CA1, sin nada elegido', () => {
  it('sin asientos elegidos, "Reservar y pagar" está deshabilitado', async () => {
    renderSeatsPage(NUMBERED_EVENT.SUMMARY)

    const summary = await screen.findByRole('complementary', { name: 'Tu selección' })
    expect(within(summary).queryAllByRole('listitem')).toHaveLength(0)
    expect(within(summary).getByRole('button', { name: 'Reservar y pagar' })).toBeDisabled()
  })
})

describe('Lugares: tope de asientos por persona', () => {
  it('con el límite completo, un asiento libre no elegido se deshabilita, y al soltar uno se vuelve a habilitar', async () => {
    const eventId = NUMBERED_EVENT.SEAT_LIMIT
    const { maxTicketsPerCustomer } = await getEvent(eventId)
    if (maxTicketsPerCustomer === null) throw new Error(`El evento ${eventId} no tiene límite`)
    const { seats } = await freeSeats(eventId, maxTicketsPerCustomer + 1)
    const chosen = seats.slice(0, maxTicketsPerCustomer)
    const [extra] = seats.slice(maxTicketsPerCustomer)
    const user = userEvent.setup()
    renderSeatsPage(eventId)

    for (const seat of chosen) await user.click(await findFreeSeatButton(seat))

    const extraButton = screen.getByRole('button', { name: seatName(extra, 'disponible') })
    expect(extraButton).toBeDisabled()
    const [firstChosen] = chosen
    await user.click(screen.getByRole('button', { name: seatName(firstChosen, 'elegido') }))
    expect(extraButton).toBeEnabled()
  })
})

describe('Lugares: CA2, reservando', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await cancelPendingOrders(NUMBERED_EVENT.RESERVING)
  })

  it('al tocar "Reservar y pagar", el botón dice "Reservando…" y está deshabilitado mientras espera', async () => {
    const eventId = NUMBERED_EVENT.RESERVING
    const { seats } = await freeSeats(eventId, 1)
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    const user = userEvent.setup()
    renderSeatsPage(eventId)
    await user.click(await findFreeSeatButton(seats[0]))
    holdOrderRequests()

    await user.click(screen.getByRole('button', { name: 'Reservar y pagar' }))

    expect(await screen.findByRole('button', { name: 'Reservando…' })).toBeDisabled()
  })
})

describe('Lugares: CA2, reservar y seguir al pago', () => {
  afterEach(async () => {
    await cancelPendingOrders(NUMBERED_EVENT.RESERVED)
  })

  it('cuando la reserva se crea, va a Pago con su orderId, y la orden queda PENDING con los asientos elegidos', async () => {
    const eventId = NUMBERED_EVENT.RESERVED
    const { seats } = await freeSeats(eventId, 2)
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    const user = userEvent.setup()
    renderSeatsPage(eventId)
    for (const seat of seats) await user.click(await findFreeSeatButton(seat))

    await user.click(screen.getByRole('button', { name: 'Reservar y pagar' }))

    await waitFor(() => expect(getCurrentUrl().pathname).toBe(ROUTES.payment(eventId)))
    const orderId = Number(getCurrentUrl().searchParams.get('orderId'))
    const order = (await clientOrders()).find((candidate) => candidate.id === orderId)
    expect(order?.status).toBe('PENDING')
    expect(order?.tickets.map((ticket) => ticket.seatId).sort()).toEqual(
      seats.map((seat) => seat.seatId).sort(),
    )
  })
})

describe('Lugares: CA2, reservar en un sector no numerado', () => {
  afterEach(async () => {
    await cancelPendingOrders(UNNUMBERED_EVENT.RESERVED)
  })

  it('con la cantidad en 2, va a Pago y la orden tiene 2 entradas del sector', async () => {
    const eventId = UNNUMBERED_EVENT.RESERVED
    const sector = await unnumberedSectorOf(eventId)
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    const user = userEvent.setup()
    renderSeatsPage(eventId)
    await user.click(await screen.findByRole('button', { name: 'Una más' }))

    await user.click(screen.getByRole('button', { name: 'Reservar y pagar' }))

    await waitFor(() => expect(getCurrentUrl().pathname).toBe(ROUTES.payment(eventId)))
    const orderId = Number(getCurrentUrl().searchParams.get('orderId'))
    const order = (await clientOrders()).find((candidate) => candidate.id === orderId)
    expect(order?.tickets.map((ticket) => ticket.eventSectorId)).toEqual([
      sector.eventSectorId,
      sector.eventSectorId,
    ])
  })
})

describe('Lugares: CA2 borde, dos clics seguidos', () => {
  afterEach(async () => {
    vi.restoreAllMocks()
    await cancelPendingOrders(NUMBERED_EVENT.DOUBLE_CLICK)
  })

  it('dos clics seguidos en "Reservar y pagar" mandan un solo POST /api/orders', async () => {
    const eventId = NUMBERED_EVENT.DOUBLE_CLICK
    const { seats } = await freeSeats(eventId, 1)
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    const user = userEvent.setup()
    renderSeatsPage(eventId)
    await user.click(await findFreeSeatButton(seats[0]))
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    await user.dblClick(screen.getByRole('button', { name: 'Reservar y pagar' }))

    await waitFor(() => expect(getCurrentUrl().pathname).toBe(ROUTES.payment(eventId)))
    const orderRequests = fetchSpy.mock.calls.filter(([input, init]) => isOrderRequest(input, init))
    expect(orderRequests).toHaveLength(1)
  })
})

describe('Lugares: CA3, alguien me ganó un asiento', () => {
  afterEach(async () => {
    await cancelOtherPersonOrders()
    await cancelPendingOrders(NUMBERED_EVENT.SEAT_TAKEN)
  })

  it('si otra persona reservó antes el asiento, sigo en Lugares, veo el aviso y el asiento sale de "Tu selección"', async () => {
    const eventId = NUMBERED_EVENT.SEAT_TAKEN
    const { seats } = await freeSeats(eventId, 2)
    const [taken, kept] = seats
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    const user = userEvent.setup()
    renderSeatsPage(eventId)
    for (const seat of seats) await user.click(await findFreeSeatButton(seat))
    await reserveAsAnotherPerson({ eventId, seatIds: [taken.seatId] })

    await user.click(screen.getByRole('button', { name: 'Reservar y pagar' }))

    expect(
      await screen.findByRole('alert', {
        name: `El asiento ${taken.row}${taken.number} lo acaba de reservar otra persona.`,
      }),
    ).toBeInTheDocument()
    expect(getCurrentUrl().pathname).toBe(ROUTES.seats(eventId))
    const summary = screen.getByRole('complementary', { name: 'Tu selección' })
    expect(
      within(summary)
        .getAllByRole('listitem')
        .map((line) => line.textContent),
    ).toEqual([expect.stringContaining(`fila ${kept.row}, asiento ${kept.number}`)])
  })
})

/** Ancla de "Datos de prueba" (`ticket-service.md`): en el 45 queda 1 lugar en Campo. */
const LAST_PLACE_EVENT = 45

describe('Lugares: CA3, alguien me ganó el último lugar', () => {
  afterEach(async () => {
    await cancelOtherPersonOrders()
    await cancelPendingOrders(LAST_PLACE_EVENT)
  })

  it('si otra persona reservó el último lugar del sector, sigo en Lugares con el aviso de agotado y el botón deshabilitado', async () => {
    const field = await unnumberedSectorOf(LAST_PLACE_EVENT)
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    const user = userEvent.setup()
    renderSeatsPage(LAST_PLACE_EVENT)
    const summary = await screen.findByRole('complementary', { name: 'Tu selección' })
    await reserveAsAnotherPerson({
      eventId: LAST_PLACE_EVENT,
      eventSectorId: field.eventSectorId,
      quantity: field.availablePlaces,
    })

    await user.click(within(summary).getByRole('button', { name: 'Reservar y pagar' }))

    expect(
      await screen.findByRole('alert', { name: `Se agotó ${field.sectorName}.` }),
    ).toBeInTheDocument()
    expect(getCurrentUrl().pathname).toBe(ROUTES.seats(LAST_PLACE_EVENT))
    expect(within(summary).getByRole('button', { name: 'Reservar y pagar' })).toBeDisabled()
  })
})

describe('Lugares: CA4, supero el límite por persona', () => {
  afterEach(async () => {
    await cancelPendingOrders(NUMBERED_EVENT.LIMIT_REACHED)
  })

  it('si ya tengo el límite reservado, sigo en Lugares con mi selección y veo cuántas entradas puedo tener', async () => {
    const eventId = NUMBERED_EVENT.LIMIT_REACHED
    const { maxTicketsPerCustomer } = await getEvent(eventId)
    if (maxTicketsPerCustomer === null) throw new Error(`El evento ${eventId} no tiene límite`)
    const { seats } = await freeSeats(eventId, maxTicketsPerCustomer + 1)
    const extra = seats[maxTicketsPerCustomer]
    await reserveAsClient({
      eventId,
      seatIds: seats.slice(0, maxTicketsPerCustomer).map((seat) => seat.seatId),
    })
    const user = userEvent.setup()
    renderSeatsPage(eventId)
    await user.click(await findFreeSeatButton(extra))

    await user.click(screen.getByRole('button', { name: 'Reservar y pagar' }))

    const summary = screen.getByRole('complementary', { name: 'Tu selección' })
    expect(await within(summary).findByRole('alert')).toHaveTextContent(
      `Podés tener hasta ${maxTicketsPerCustomer} entradas para este evento, contando las que ya compraste.`,
    )
    expect(getCurrentUrl().pathname).toBe(ROUTES.seats(eventId))
    expect(within(summary).getAllByRole('listitem')).toHaveLength(1)
  })
})

/**
 * Ancla de "Datos de prueba" (`ticket-service.md`): el 43 tiene Campo, Platea baja, Platea alta
 * agotada y Palco VIP. Se usa para cambiar de pestaña, sin reservar.
 */
const MULTI_SECTOR_EVENT = 43

describe('Lugares: CA1 borde, cambiar de pestaña', () => {
  it('con asientos elegidos, al abrir otro sector "Tu selección" queda vacío y el botón deshabilitado', async () => {
    const { sectors } = await getAvailability(MULTI_SECTOR_EVENT)
    const [platea, palco] = sectors.filter(
      (sector) => sector.numbered && sector.availablePlaces > 0,
    )
    const seat = platea.seats?.find((candidate) => candidate.available)
    if (!seat || !palco) throw new Error('El evento 43 no tiene dos sectores numerados con lugares')
    const user = userEvent.setup()
    renderSeatsPage(MULTI_SECTOR_EVENT)
    const tabs = await screen.findByRole('group', { name: 'Sectores' })
    await user.click(
      within(tabs).getByRole('button', { name: new RegExp(`^${platea.sectorName} `) }),
    )
    await user.click(await findFreeSeatButton(seat))
    const summary = screen.getByRole('complementary', { name: 'Tu selección' })
    expect(within(summary).getAllByRole('listitem')).toHaveLength(1)

    await user.click(
      within(tabs).getByRole('button', { name: new RegExp(`^${palco.sectorName} `) }),
    )

    expect(within(summary).queryAllByRole('listitem')).toHaveLength(0)
    expect(within(summary).getByRole('button', { name: 'Reservar y pagar' })).toBeDisabled()
  })
})

describe('Lugares: CA1 borde, el sector no numerado se agota', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    focusManager.setFocused(undefined)
  })

  it('si un refresco agota el sector y la cantidad queda en 0, "Reservar y pagar" se deshabilita', async () => {
    const eventId = UNNUMBERED_EVENT.SOLD_OUT_ON_REFRESH
    const sector = await unnumberedSectorOf(eventId)
    renderSeatsPage(eventId)
    const summary = await screen.findByRole('complementary', { name: 'Tu selección' })
    const reserve = within(summary).getByRole('button', { name: 'Reservar y pagar' })
    expect(reserve).toBeEnabled()

    setPlacesOnNextRefreshes(sector.sectorName, 0)
    refetchByRefocusing()

    await screen.findByRole('alert', { name: `Se agotó ${sector.sectorName}.` })
    expect(within(summary).queryAllByRole('listitem')).toHaveLength(0)
    expect(reserve).toBeDisabled()
  })
})

/** Los primeros libres en el orden del mapa: fila y número. */
async function freeSeats(eventId: number, count: number) {
  const { sectors } = await getAvailability(eventId)
  const sector = sectors.find((candidate) => candidate.numbered && candidate.availablePlaces > 0)
  if (!sector) throw new Error(`El evento ${eventId} no tiene un sector numerado con lugares`)
  const seats = (sector.seats ?? [])
    .filter((seat) => seat.available)
    .sort((first, second) => first.row.localeCompare(second.row) || first.number - second.number)
    .slice(0, count)
  if (seats.length < count) throw new Error(`El evento ${eventId} no tiene ${count} libres`)
  return { sector, seats }
}

async function unnumberedSectorOf(eventId: number) {
  const { sectors } = await getAvailability(eventId)
  const sector = sectors.find((candidate) => !candidate.numbered && candidate.availablePlaces > 0)
  if (!sector) throw new Error(`El evento ${eventId} no tiene un sector no numerado con lugares`)
  return sector
}

function findFreeSeatButton(seat: SeatAvailability) {
  return screen.findByRole('button', {
    name: `Fila ${seat.row}, asiento ${seat.number}, disponible`,
  })
}

function seatName(seat: SeatAvailability, status: string) {
  return `Fila ${seat.row}, asiento ${seat.number}, ${status}`
}

const AVAILABILITY_PATH = '/api/availability'

/** Desde acá, cada respuesta de la disponibilidad trae esos lugares libres en el sector. */
function setPlacesOnNextRefreshes(sectorName: string, availablePlaces: number) {
  const realFetch = globalThis.fetch
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const response = await realFetch(input, init)
    const url = input instanceof Request ? input.url : String(input)
    if (!url.includes(AVAILABILITY_PATH)) return response
    const availability = (await response.json()) as EventAvailability
    for (const sector of availability.sectors) {
      if (sector.sectorName === sectorName) sector.availablePlaces = availablePlaces
    }
    return Response.json(availability)
  })
}

const ORDERS_PATH = '/api/orders'

function isOrderRequest(input: Parameters<typeof fetch>[0], init?: RequestInit) {
  const url = input instanceof Request ? input.url : String(input)
  return new URL(url).pathname === ORDERS_PATH && init?.method === 'POST'
}

/** Desde acá, el `POST /api/orders` queda esperando para siempre: la reserva nunca termina. */
function holdOrderRequests() {
  const realFetch = globalThis.fetch
  return vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation((input, init) =>
      isOrderRequest(input, init) ? new Promise<Response>(() => {}) : realFetch(input, init),
    )
}

/** Deja como estaban los lugares: cancela las reservas en curso del cliente en esos eventos. */
async function cancelPendingOrders(...eventIds: number[]) {
  const headers = { Authorization: `Bearer ${await devLogin(SEEDER_USER.CLIENT)}` }
  const orders = (await (await fetch(`${GATEWAY_URL}${ORDERS_PATH}`, { headers })).json()) as {
    id: number
    eventId: number
    status: string
  }[]
  const pending = orders.filter(
    (order) => order.status === 'PENDING' && eventIds.includes(order.eventId),
  )
  for (const order of pending) {
    await fetch(`${GATEWAY_URL}${ORDERS_PATH}/${order.id}/cancel`, { method: 'POST', headers })
  }
}

const GATEWAY_URL = import.meta.env.TICKETYA_GATEWAY_URL

type ClientOrder = Pick<Order, 'id' | 'eventId' | 'status'> & {
  tickets: Pick<OrderTicket, 'seatId' | 'eventSectorId'>[]
}

type OtherPersonOrder = { id: number; token: string }

const otherPersonOrders: OtherPersonOrder[] = []

/**
 * Otra persona (el organizador del seeder: `POST /api/orders` no valida el rol) reserva esos
 * lugares por la API. La orden queda anotada para cancelarla al terminar.
 */
async function reserveAsAnotherPerson(
  request: { eventId: number } & (
    { seatIds: number[] } | { eventSectorId: number; quantity: number }
  ),
) {
  const token = await devLogin(SEEDER_USER.ORGANIZER)
  const response = await fetch(`${GATEWAY_URL}${ORDERS_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...request, idempotencyKey: crypto.randomUUID() }),
  })
  if (!response.ok) throw new Error(`La otra persona no pudo reservar: ${response.status}`)
  const { id } = (await response.json()) as { id: number }
  otherPersonOrders.push({ id, token })
}

async function cancelOtherPersonOrders() {
  for (const { id, token } of otherPersonOrders.splice(0)) {
    await fetch(`${GATEWAY_URL}${ORDERS_PATH}/${id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
  }
}

/**
 * El cliente del seeder reserva por la API, como desde otra pestaña, y deja su token en sesión
 * para la página. La orden la cancela `cancelPendingOrders`.
 */
async function reserveAsClient(request: { eventId: number; seatIds: number[] }) {
  const token = await devLogin(SEEDER_USER.CLIENT)
  saveAccessToken(token)
  const response = await fetch(`${GATEWAY_URL}${ORDERS_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...request, idempotencyKey: crypto.randomUUID() }),
  })
  if (!response.ok) throw new Error(`El cliente no pudo reservar: ${response.status}`)
}

/** Las órdenes del cliente del seeder, pedidas por fuera de la página. */
async function clientOrders() {
  const headers = { Authorization: `Bearer ${await devLogin(SEEDER_USER.CLIENT)}` }
  const response = await fetch(`${GATEWAY_URL}${ORDERS_PATH}`, { headers })
  return (await response.json()) as ClientOrder[]
}

/** La disponibilidad se vuelve a pedir al recuperar el foco, como al volver a la pestaña. */
function refetchByRefocusing() {
  act(() => focusManager.setFocused(false))
  act(() => focusManager.setFocused(true))
}
