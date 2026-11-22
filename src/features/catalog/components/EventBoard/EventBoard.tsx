import { useEventFilters } from '../../hooks/useEventFilters'
import { useEventSearch } from '../../hooks/useEventSearch'
import type { EventSummary } from '../../types/catalog.types'
import { EventCard } from '../EventCard/EventCard'
import { EventFilters } from '../EventFilters'

const COUNT_DIGITS = 2

/** La cartelera: filtros, contador, resultados y sus estados. */
export function EventBoard() {
  const { filters } = useEventFilters()
  const { data } = useEventSearch(filters)

  return (
    <section aria-labelledby="cartelera-titulo" className="flex flex-col gap-5">
      <h2 id="cartelera-titulo" className="text-4xl font-extrabold">
        Próximos eventos
      </h2>
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
