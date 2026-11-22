import { describe, expect, it } from 'vitest'
import { parseEventFilters } from './eventFilters.schema'

const parse = (query: string) => parseEventFilters(new URLSearchParams(query))

describe('parseEventFilters', () => {
  it('sin parámetros no filtra, ordena por fecha y está en la página 1', () => {
    expect(parse('')).toEqual({ sort: 'DATE', page: 1 })
  })
})
