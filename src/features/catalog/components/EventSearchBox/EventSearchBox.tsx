import { Search } from 'lucide-react'
import type { FocusEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import { ROUTES } from '@/shared/lib/routes'
import { getEventDateParts } from '../../lib/eventFormat'
import type { EventSummary } from '../../types/catalog.types'
import { useEventSearchBox } from './useEventSearchBox'

const SUGGESTIONS_ID = 'sugerencias'

export function EventSearchBox() {
  const searchBox = useEventSearchBox()

  /** Se cierra solo si el foco sale del buscador entero, no si pasa a una sugerencia. */
  const closeWhenFocusLeaves = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) searchBox.closeSuggestions()
  }

  return (
    <div className="relative max-w-155" onBlur={closeWhenFocusLeaves}>
      <form
        role="search"
        onSubmit={searchBox.submitSearch}
        className="flex gap-2 rounded-card bg-surface p-2 shadow-2xl"
      >
        <label className="flex min-h-13 flex-1 items-center gap-2.5 rounded-control px-3 text-subtle has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-link">
          <Search aria-hidden className="size-5" />
          <span className="sr-only">Buscar eventos</span>
          <input
            type="search"
            autoComplete="off"
            placeholder="Artista, equipo, obra o disertante"
            aria-controls={SUGGESTIONS_ID}
            value={searchBox.text}
            onChange={(event) => searchBox.setText(event.target.value)}
            onFocus={searchBox.openSuggestions}
            onKeyDown={(event) => {
              if (event.key === 'Escape') searchBox.closeSuggestions()
            }}
            className="w-full min-w-0 bg-transparent text-control text-ink outline-none"
          />
        </label>
        <Button type="submit" variant="accent" className="min-h-13 px-6">
          Buscar
        </Button>
      </form>
      {searchBox.areSuggestionsOpen && (
        <SuggestionList
          suggestions={searchBox.suggestions}
          searchText={searchBox.trimmedText}
          onShowAll={searchBox.applySearch}
        />
      )}
    </div>
  )
}

type SuggestionListProps = {
  suggestions: EventSummary[]
  searchText: string
  onShowAll: () => void
}

function SuggestionList({ suggestions, searchText, onShowAll }: SuggestionListProps) {
  return (
    <ul
      id={SUGGESTIONS_ID}
      aria-label="Sugerencias"
      // Que el input no pierda el foco al tocar una sugerencia: si no, la lista se cierra antes del click.
      onMouseDown={(event) => event.preventDefault()}
      className="absolute inset-x-0 top-[calc(100%+6px)] z-15 flex flex-col rounded-xl border border-line-strong bg-surface p-1.5 text-ink shadow-2xl"
    >
      {suggestions.map((event) => (
        <li key={event.id}>
          <SuggestionLink event={event} />
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onShowAll}
          className="mt-1 min-h-11 w-full cursor-pointer border-t border-line px-3 text-left text-sm font-semibold text-link"
        >
          Ver todos los resultados para «{searchText}» · Enter
        </button>
      </li>
    </ul>
  )
}

function SuggestionLink({ event }: { event: EventSummary }) {
  const { day, month } = getEventDateParts(event.dateTime)
  return (
    <Link
      to={ROUTES.event(event.id)}
      className="flex min-h-11 flex-col justify-center gap-0.5 rounded-lg px-3 py-1.5 text-control text-ink no-underline hover:bg-surface-hover hover:text-ink"
    >
      <strong>{event.name}</strong>
      <span className="text-label text-muted">
        {Number(day)} {month.toLowerCase()} · {event.venue.city}
      </span>
    </Link>
  )
}
