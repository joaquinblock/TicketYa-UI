import { CircleAlert, SearchX } from 'lucide-react'
import { Button } from '@/shared/components/atoms/Button'
import { Select } from '@/shared/components/atoms/Select'
import { Pagination } from '@/shared/components/molecules/Pagination'
import { EVENT_SORT_LABEL, EVENT_SORTS, EVENTS_PAGE_SIZE } from '../../constants/catalog.constants'
import { useEventFilters, useSanitizedFiltersUrl } from '../../hooks/useEventFilters'
import { useEventSearch } from '../../hooks/useEventSearch'
import type { EventSort, EventSummary } from '../../types/catalog.types'
import { EventCard } from '../EventCard/EventCard'
import { EventCardSkeleton } from '../EventCard/EventCardSkeleton'
import { EventFilters } from '../EventFilters'

const COUNT_DIGITS = 2
/** Las cards y su skeleton comparten la grilla: 4 columnas en escritorio, 1 a 360 px. */
const GRID_CLASS = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4.5'

/** La cartelera: filtros, contador, resultados y sus estados. */
export function EventBoard() {
  useSanitizedFiltersUrl()

  return (
    <section aria-labelledby="cartelera-titulo" className="flex flex-col gap-5">
      <BoardHeader />
      <EventFilters />
      <BoardResults />
    </section>
  )
}

function BoardResults() {
  const { filters, updateFilters } = useEventFilters()
  const { data, isPending, isError, refetch } = useEventSearch(filters)

  if (isPending) return <LoadingGrid />
  if (isError) return <LoadError onRetry={() => refetch()} />
  if (data.totalElements === 0)
    return (
      <>
        <ResultSummary total={0} />
        <NoResults />
      </>
    )
  return (
    <>
      <ResultSummary total={data.totalElements} />
      <EventGrid events={data.content} />
      {data.totalPages > 1 && (
        <Pagination
          page={filters.page}
          totalPages={data.totalPages}
          onPageChange={(page) => updateFilters({ page })}
        />
      )}
    </>
  )
}

function LoadingGrid() {
  return (
    <>
      <p role="status" className="sr-only">
        Cargando eventos
      </p>
      <div aria-hidden className={GRID_CLASS}>
        {Array.from({ length: EVENTS_PAGE_SIZE }, (_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    </>
  )
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2.5 rounded-card border border-line bg-surface px-5 py-12 text-center text-muted"
    >
      <CircleAlert aria-hidden className="size-11 text-error-ink" />
      <h3 className="text-2xl text-ink">No pudimos cargar los eventos</h3>
      <p>Revisá tu conexión y probá de nuevo. Si sigue pasando, el problema es nuestro.</p>
      <Button onClick={onRetry}>Reintentar</Button>
    </div>
  )
}

/** "Limpiar filtros" queda a la vista siempre que haya algo que limpiar. */
function ResultSummary({ total }: { total: number }) {
  const { hasActiveFilters, clearFilters } = useEventFilters()

  return (
    <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
      <ResultCount total={total} />
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}

function NoResults() {
  const { clearFilters } = useEventFilters()

  return (
    <div className="flex flex-col items-center gap-2.5 rounded-card border border-dashed border-line-strong px-5 py-12 text-center text-subtle">
      <SearchX aria-hidden className="size-11 text-line-strong" />
      <h3 className="text-2xl text-ink">No encontramos eventos con esos filtros</h3>
      <p>Probá con otra ciudad, otro tipo o un rango de fechas más amplio.</p>
      <Button variant="ghost" onClick={clearFilters}>
        Limpiar filtros
      </Button>
    </div>
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
    <ul aria-label="Eventos" className={GRID_CLASS}>
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  )
}
