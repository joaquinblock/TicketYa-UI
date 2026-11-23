import { useQuery } from '@tanstack/react-query'
import { MIN_SUGGESTION_LENGTH, SUGGESTIONS_SIZE } from '../constants/catalog.constants'
import { catalogKeys } from '../lib/catalog.queryKeys'
import { searchEvents } from '../services/events.service'

/** Sugerencias por relevancia mientras se escribe, desde `MIN_SUGGESTION_LENGTH` letras. */
export function useEventSuggestions(text: string) {
  return useQuery({
    queryKey: catalogKeys.suggestions(text),
    queryFn: () => searchEvents({ q: text, sort: 'RELEVANCE', page: 1 }, SUGGESTIONS_SIZE),
    enabled: text.length >= MIN_SUGGESTION_LENGTH,
    select: (page) => page.content,
  })
}
