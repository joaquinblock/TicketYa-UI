import { Select } from '@/shared/components/atoms/Select'
import { EVENT_SORT_LABEL, EVENT_SORTS } from '../../constants/catalog.constants'
import { useEventFilters, useSanitizedFiltersUrl } from '../../hooks/useEventFilters'
import { useEventSearch } from '../../hooks/useEventSearch'
import type { EventSort, EventSummary } from '../../types/catalog.types'
import { EventCard } from '../EventCard/EventCard'
import { EventFilters } from '../EventFilters'

const COUNT_DIGITS = 2

/** La cartelera: filtros, contador, resultados y sus estados. */
export function EventBoard() {
  useSanitizedFiltersUrl()
  const { filters } = useEventFilters()
  const { data } = useEventSearch(filters)

  return (
    <section aria-labelledby="cartelera-titulo" className="flex flex-col gap-5">
      <BoardHeader />
      <EventFilters />
      {data && (
        <>
          <ResultCount total={data.totalElements} />
          <EventGrid events={data.content} />
        </>
      )}
    </section>
  )
}

function BoardHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="flex items-center gap-2 text-micro font-bold tracking-widest text-subtle uppercase">
          <span aria-hidden className="h-0.5 w-5 bg-accent" />
          Cartelera
        </p>
        <h2 id="cartelera-titulo" className="text-4xl font-extrabold">
          Próximos eventos
        </h2>
      </div>
      <SortSelect />
    </div>
  )
}

/** "Relevancia" solo tiene sentido con un texto buscado. */
function SortSelect() {
  const { filters, updateFilters } = useEventFilters()
  const sorts = EVENT_SORTS.filter((sort) => sort !== 'RELEVANCE' || filters.q)

  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-subtle">
      Ordenar por
      <Select
        value={filters.sort}
        onChange={(event) => updateFilters({ sort: event.target.value as EventSort })}
        className="w-auto"
      >
        {sorts.map((sort) => (
          <option key={sort} value={sort}>
            {EVENT_SORT_LABEL[sort]}
          </option>
        ))}
      </Select>
    </label>
  )
}

function ResultCount({ total }: { total: number }) {
  return (
    <p aria-live="polite" className="flex items-baseline gap-2">
      <span className="font-mono text-2xl font-medium">
        {String(total).padStart(COUNT_DIGITS, '0')}
      </span>
      <span className="text-subtle">{total === 1 ? 'evento' : 'eventos'}</span>
    </p>
  )
}

function EventGrid({ events }: { events: EventSummary[] }) {
  return (
    <ul
      aria-label="Eventos"
      className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4.5"
    >
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  )
}
