import { useState, type FormEvent } from 'react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { SEARCH_DEBOUNCE_MS } from '../../constants/catalog.constants'
import { useEventFilters } from '../../hooks/useEventFilters'
import { useEventSuggestions } from '../../hooks/useEventSuggestions'

export function useEventSearchBox() {
  const { filters, updateFilters } = useEventFilters()
  const appliedText = filters.q ?? ''
  const [text, setText] = useState(appliedText)
  const [lastAppliedText, setLastAppliedText] = useState(appliedText)
  const [isFocused, setIsFocused] = useState(false)
  const suggestionText = useDebouncedValue(text.trim(), SEARCH_DEBOUNCE_MS)
  const { data: suggestions = [] } = useEventSuggestions(suggestionText)

  // Si la URL cambia desde afuera ("Limpiar filtros"), el input la sigue (ajuste en el render).
  if (appliedText !== lastAppliedText) {
    setLastAppliedText(appliedText)
    setText(appliedText)
  }

  /** Buscar ordena por relevancia; sin texto, el schema descarta la relevancia. */
  const applySearch = () => {
    const query = text.trim()
    updateFilters({ q: query, sort: query ? 'RELEVANCE' : filters.sort })
    setIsFocused(false)
  }

  return {
    text,
    setText,
    trimmedText: text.trim(),
    suggestions,
    areSuggestionsOpen: isFocused && suggestions.length > 0,
    openSuggestions: () => setIsFocused(true),
    closeSuggestions: () => setIsFocused(false),
    applySearch,
    submitSearch: (event: FormEvent) => {
      event.preventDefault()
      applySearch()
    },
  }
}
