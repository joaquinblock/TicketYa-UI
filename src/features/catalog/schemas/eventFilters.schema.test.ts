import { describe, expect, it } from 'vitest'
import { parseEventFilters } from './eventFilters.schema'
import { toSearchParams } from './eventFilters.schema'

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

describe('parseEventFilters con un rango invertido', () => {
  it('descarta "hasta" si es anterior a "desde" y mantiene "desde"', () => {
    expect(parse('from=2026-12-20&to=2026-12-10')).toEqual({
      from: '2026-12-20',
      sort: 'DATE',
      page: 1,
    })
  })
})

describe('parseEventFilters con la página', () => {
  it('conserva una página válida', () => {
    expect(parse('page=3')).toEqual({ sort: 'DATE', page: 3 })
  })

  it.each(['dos', '0', '-3', '1.5'])('con page=%s vuelve a la página 1', (page) => {
    expect(parse(`page=${page}`)).toEqual({ sort: 'DATE', page: 1 })
  })
})

describe('parseEventFilters con el orden por relevancia', () => {
  it('ordena por relevancia si hay un texto buscado', () => {
    expect(parse('q=serr&sort=RELEVANCE')).toEqual({ q: 'serr', sort: 'RELEVANCE', page: 1 })
  })

  it('sin texto buscado pasa a ordenar por fecha', () => {
    expect(parse('sort=RELEVANCE')).toEqual({ sort: 'DATE', page: 1 })
  })
})

describe('parseEventFilters con el texto buscado', () => {
  it('recorta los espacios alrededor del texto', () => {
    expect(parse('q=%20%20serr%20')).toEqual({ q: 'serr', sort: 'DATE', page: 1 })
  })

  it('un texto vacío o de solo espacios es como no buscar nada', () => {
    expect(parse('q=%20%20')).toEqual({ sort: 'DATE', page: 1 })
  })

  it('recorta a 100 caracteres, el máximo del backend', () => {
    expect(parse(`q=${'a'.repeat(101)}`).q).toBe('a'.repeat(100))
  })
})

describe('parseEventFilters con la ciudad', () => {
  it('conserva la ciudad elegida', () => {
    expect(parse('city=Mar%20del%20Plata')).toEqual({
      city: 'Mar del Plata',
      sort: 'DATE',
      page: 1,
    })
  })

  it('una ciudad vacía es como no filtrar', () => {
    expect(parse('city=')).toEqual({ sort: 'DATE', page: 1 })
  })
})

describe('toSearchParams', () => {
  it('con los filtros por defecto deja la URL sin parámetros', () => {
    expect(toSearchParams({ sort: 'DATE', page: 1 }).toString()).toBe('')
  })

  it('solo escribe los filtros que no son el valor por defecto', () => {
    const params = toSearchParams({ q: 'serr', type: 'CONCERT', sort: 'RELEVANCE', page: 2 })

    expect(Object.fromEntries(params)).toEqual({
      q: 'serr',
      type: 'CONCERT',
      sort: 'RELEVANCE',
      page: '2',
    })
  })
})
