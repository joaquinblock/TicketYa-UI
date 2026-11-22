import { Chip } from '@/shared/components/atoms/Chip'
import { EVENT_TYPE_LABEL, EVENT_TYPES } from '../constants/catalog.constants'
import { useEventFilters } from '../hooks/useEventFilters'

export function EventFilters() {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface px-4 py-3.5">
      <EventTypeChips />
    </div>
  )
}

function EventTypeChips() {
  const { filters, updateFilters } = useEventFilters()

  return (
    <div role="group" aria-label="Tipo de evento" className="flex flex-wrap gap-1">
      <Chip isSelected={!filters.type} onClick={() => updateFilters({ type: undefined })}>
        Todos
      </Chip>
      {EVENT_TYPES.map((type) => (
        <Chip key={type} isSelected={filters.type === type} onClick={() => updateFilters({ type })}>
          {EVENT_TYPE_LABEL[type].plural}
        </Chip>
      ))}
    </div>
  )
}
