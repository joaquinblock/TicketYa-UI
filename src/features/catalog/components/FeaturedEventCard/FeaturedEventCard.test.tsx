import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ROUTES } from '@/shared/lib/routes'
import { renderWithProviders } from '@/test/render'
import * as eventsService from '../../services/events.service'
import type { EventSummary } from '../../types/catalog.types'
import { FeaturedEventCard } from './FeaturedEventCard'

const BASE_EVENT: EventSummary = {
  id: 1,
  name: 'Los Serranos en vivo',
  type: 'CONCERT',
  status: 'PUBLISHED',
  dateTime: '2026-12-26T21:00:00',
  highDemand: true,
  saleStart: null,
  venue: {
    name: 'Estadio del Sur',
    city: 'Buenos Aires',
  },
  priceFrom: 45000,
  photoUrl: null,
  participants: [],
}

describe('FeaturedEventCard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra el evento destacado con timer cuando saleStart es futuro', async () => {
    const futureSale = new Date(Date.now() + 2 * 3600_000 + 15 * 60_000).toISOString()
    vi.spyOn(eventsService, 'searchEvents').mockResolvedValueOnce({
      content: [{ ...BASE_EVENT, saleStart: futureSale }],
      page: 0,
      size: 8,
      totalElements: 1,
      totalPages: 1,
    })

    renderWithProviders(<FeaturedEventCard />)

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Los Serranos en vivo' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('timer', { name: 'Tiempo para que abra la fila' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver el evento' })).toHaveAttribute(
      'href',
      ROUTES.event(1),
    )
  })

  it('muestra precio desde cuando no hay apertura pendiente', async () => {
    vi.spyOn(eventsService, 'searchEvents').mockResolvedValueOnce({
      content: [BASE_EVENT],
      page: 0,
      size: 8,
      totalElements: 1,
      totalPages: 1,
    })

    renderWithProviders(<FeaturedEventCard />)

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Los Serranos en vivo' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('timer')).not.toBeInTheDocument()
    expect(screen.getByText('$45.000')).toBeInTheDocument()
  })
})
