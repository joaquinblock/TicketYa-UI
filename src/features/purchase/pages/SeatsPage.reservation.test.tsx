import { focusManager } from '@tanstack/react-query'
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getAvailability } from '@/shared/services/availability.service'
import { getEvent } from '@/shared/services/events.service'
import type { EventAvailability, SeatAvailability } from '@/shared/types/event.types'
import { formatPrice } from '@/shared/utils/eventFormat'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'

/**
 * Eventos de la cartelera (13 a 42 en "Datos de prueba" de `ticket-service.md`), hasta 4 por
 * persona y con un solo sector. Cada test usa el suyo, para que las reservas de uno no le cambien
 * los lugares libres a otro. Los asientos y los precios se toman de la respuesta.
 */
const NUMBERED_EVENT = {
  SUMMARY: 17,
  SEAT_LIMIT: 18,
} as const

const UNNUMBERED_EVENT = {
  SUMMARY: 13,
  SOLD_OUT_ON_REFRESH: 14,
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

/** La disponibilidad se vuelve a pedir al recuperar el foco, como al volver a la pestaña. */
function refetchByRefocusing() {
  act(() => focusManager.setFocused(false))
  act(() => focusManager.setFocused(true))
}
