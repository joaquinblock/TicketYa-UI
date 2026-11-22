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

  return { filters, updateFilters }
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
