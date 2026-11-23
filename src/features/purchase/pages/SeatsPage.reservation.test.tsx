import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getAvailability } from '@/shared/services/availability.service'
import { getEvent } from '@/shared/services/events.service'
import type { SeatAvailability } from '@/shared/types/event.types'
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
} as const

const UNNUMBERED_EVENT = {
  SUMMARY: 13,
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
