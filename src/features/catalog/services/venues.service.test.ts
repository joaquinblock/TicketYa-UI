import { describe, expect, it } from 'vitest'
import { getCities } from './venues.service'

describe('getCities', () => {
  it('trae las 5 ciudades únicas de los lugares, ordenadas', async () => {
    expect(await getCities()).toEqual([
      'Buenos Aires',
      'Córdoba',
      'Mar del Plata',
      'Rosario',
      'Tandil',
    ])
  })
})
