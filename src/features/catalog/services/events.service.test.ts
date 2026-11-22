import { describe, expect, it } from 'vitest'
import { EVENTS_PAGE_SIZE } from '../constants/catalog.constants'
import { searchEvents } from './events.service'

describe('searchEvents', () => {
  it('sin filtros trae los 6 eventos del seeder ordenados por fecha, con lugar, ciudad y precio', async () => {
    const result = await searchEvents({ sort: 'DATE', page: 1 }, EVENTS_PAGE_SIZE)

    expect(result.totalElements).toBe(6)
    expect(result.content.map((event) => event.name)).toEqual([
      'Jazz en el puerto',
      'Central vs. Unión',
      'Peña folklórica serrana',
      'La casa de las sierras',
      'Los Serranos en vivo',
      'Festival de Verano',
    ])
    expect(result.content[0]).toMatchObject({
      venue: { name: 'Sala del Puerto', city: 'Mar del Plata' },
      priceFrom: 18000,
      status: 'SOLD_OUT',
    })
  })
})
