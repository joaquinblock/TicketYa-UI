import { useState } from 'react'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { SEARCH_DEBOUNCE_MS } from '../../constants/catalog.constants'
import { useEventSuggestions } from '../../hooks/useEventSuggestions'

export function useEventSearchBox() {
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const suggestionText = useDebouncedValue(text.trim(), SEARCH_DEBOUNCE_MS)
  const { data: suggestions = [] } = useEventSuggestions(suggestionText)

  return {
    text,
    setText,
    suggestions,
    areSuggestionsOpen: isFocused && suggestions.length > 0,
    openSuggestions: () => setIsFocused(true),
    closeSuggestions: () => setIsFocused(false),
  }
}
