import { describe, expect, it } from 'vitest'
import { parseEventFilters } from './eventFilters.schema'

const parse = (query: string) => parseEventFilters(new URLSearchParams(query))

describe('parseEventFilters', () => {
  it('sin parámetros no filtra, ordena por fecha y está en la página 1', () => {
    expect(parse('')).toEqual({ sort: 'DATE', page: 1 })
  })
})

describe('parseEventFilters descarta lo inválido', () => {
  it('conserva un tipo que existe e ignora uno que no', () => {
    expect(parse('type=CONCERT')).toEqual({ type: 'CONCERT', sort: 'DATE', page: 1 })
    expect(parse('type=FOO')).toEqual({ sort: 'DATE', page: 1 })
  })
})

describe('parseEventFilters con fechas', () => {
  it('conserva fechas válidas e ignora las que no son fechas', () => {
    expect(parse('from=2026-12-01&to=2026-12-31')).toEqual({
      from: '2026-12-01',
      to: '2026-12-31',
      sort: 'DATE',
      page: 1,
    })
    expect(parse('from=mañana&to=2026-13-45')).toEqual({ sort: 'DATE', page: 1 })
  })
})
