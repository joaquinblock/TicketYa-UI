import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getCurrentUrl, LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import { formatPrice } from '../lib/eventFormat'
import { getAvailability } from '../services/availability.service'
import { getEvent } from '../services/events.service'
import { formatPlacesLeft } from '../utils/sectorFormat'

/**
 * Anclas de "Datos de prueba" (`event-service.md` y `ticket-service.md`): el id fija el caso, y los
 * sectores y lugares se comparan con lo que responden los services, no con valores fijos.
 */
const SEEDER_EVENT = {
  HIGH_DEMAND_ON_SALE: 1,
  ON_SALE_WITHOUT_HIGH_DEMAND: 2,
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
})
