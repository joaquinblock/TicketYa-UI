import { useEventFilters } from '../../hooks/useEventFilters'
import { useEventSearch } from '../../hooks/useEventSearch'
import type { EventSummary } from '../../types/catalog.types'
import { EventCard } from '../EventCard/EventCard'

/** La cartelera: filtros, contador, resultados y sus estados. */
export function EventBoard() {
  const { filters } = useEventFilters()
  const { data } = useEventSearch(filters)

  return (
    <section aria-labelledby="cartelera-titulo" className="flex flex-col gap-5">
      <h2 id="cartelera-titulo" className="text-4xl font-extrabold">
        Próximos eventos
      </h2>
      {data && <EventGrid events={data.content} />}
    </section>
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
