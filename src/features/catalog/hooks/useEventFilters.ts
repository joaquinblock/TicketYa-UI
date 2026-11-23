import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FIRST_PAGE } from '../constants/catalog.constants'
import { parseEventFilters, toSearchParams } from '../schemas/eventFilters.schema'
import type { EventFilters } from '../types/catalog.types'

/** Los filtros de la cartelera viven en la URL (ADR 0002). */
export function useEventFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseEventFilters(searchParams), [searchParams])

  /** Cambiar un filtro vuelve a la primera página: la anterior puede no existir. */
  const updateFilters = (changes: Partial<EventFilters>) => {
    setSearchParams(toSearchParams({ ...filters, page: FIRST_PAGE, ...changes }))
  }

  /** Conserva el orden elegido: no es un filtro. Sin texto, el schema descarta la relevancia. */
  const clearFilters = () => {
    setSearchParams(toSearchParams({ sort: filters.sort, page: FIRST_PAGE }))
  }

  const { q, type, city, from, to } = filters
  const hasActiveFilters = [q, type, city, from, to].some(Boolean)

  return { filters, hasActiveFilters, updateFilters, clearFilters }
}

/**
 * Reemplaza la URL por la que refleja lo que se muestra, sin lo inválido (ley de Postel).
 * Va una sola vez, en la cartelera: con `replace` no suma una entrada al historial.
 */
export function useSanitizedFiltersUrl() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSearch = searchParams.toString()
  const sanitizedSearch = toSearchParams(parseEventFilters(searchParams)).toString()

  useEffect(() => {
    if (sanitizedSearch !== currentSearch) setSearchParams(sanitizedSearch, { replace: true })
  }, [currentSearch, sanitizedSearch, setSearchParams])
}

/** Una página mayor que la última pasa a la última, con `replace`: la URL refleja lo que se muestra. */
export function useLastPageWhenOutOfRange(totalPages = 0) {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseEventFilters(searchParams), [searchParams])
  const isOutOfRange = totalPages > 0 && filters.page > totalPages

  useEffect(() => {
    if (isOutOfRange) {
      setSearchParams(toSearchParams({ ...filters, page: totalPages }), { replace: true })
    }
  }, [isOutOfRange, filters, totalPages, setSearchParams])
}
