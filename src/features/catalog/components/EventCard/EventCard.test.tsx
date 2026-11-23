import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { EVENTS_PAGE_SIZE } from '../../constants/catalog.constants'
import { getEvent, searchEvents } from '../../services/events.service'
import { EventCard } from './EventCard'

/** Anclas de "Datos de prueba" (`event-service.md`): el resumen se trae de la búsqueda real. */
const SEEDER_EVENT = {
  HIGH_DEMAND_ON_SALE: 1,
  HIGH_DEMAND_SALE_NOT_STARTED: 4,
  SOLD_OUT: 6,
} as const

async function fetchSummary(eventId: number) {
  const { name } = await getEvent(eventId)
  const { content } = await searchEvents({ q: name, sort: 'DATE', page: 1 }, EVENTS_PAGE_SIZE)
  const summary = content.find((event) => event.id === eventId)
  if (!summary) throw new Error(`La búsqueda no trajo el evento ${eventId}`)
  return summary
}

describe('EventCard: CA6', () => {
  it('con la venta todavía cerrada y alta demanda muestra "Próximamente" y "Alta demanda"', async () => {
    renderWithProviders(
      <EventCard event={await fetchSummary(SEEDER_EVENT.HIGH_DEMAND_SALE_NOT_STARTED)} />,
    )

    expect(screen.getByText('Próximamente')).toBeInTheDocument()
    expect(screen.getByText('Alta demanda')).toBeInTheDocument()
  })
})
