import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { SeatAvailability } from '@/shared/types/event.types'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getAvailability } from '@/shared/services/availability.service'
import { getEvent } from '@/shared/services/events.service'
import { formatEventDateTime } from '@/shared/utils/eventFormat'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import { formatSectorTabLabel } from '../utils/seatFormat'

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
