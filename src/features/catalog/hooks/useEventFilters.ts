import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseEventFilters } from '../schemas/eventFilters.schema'

/** Los filtros de la cartelera viven en la URL (ADR 0002). */
export function useEventFilters() {
  const [searchParams] = useSearchParams()
  const filters = useMemo(() => parseEventFilters(searchParams), [searchParams])

  return { filters }
}
