import type { ReactNode } from 'react'
import { Chip } from '@/shared/components/atoms/Chip'
import { Input } from '@/shared/components/atoms/Input'
import { Select } from '@/shared/components/atoms/Select'
import { EVENT_TYPE_LABEL, EVENT_TYPES } from '../constants/catalog.constants'
import { useCities } from '../hooks/useCities'
import { useEventFilters } from '../hooks/useEventFilters'

export function EventFilters() {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface px-4 py-3.5">
      <EventTypeChips />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5 border-t border-line pt-3">
        <CityFilter />
        <DateRangeFilter />
      </div>
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

function CityFilter() {
  const { filters, updateFilters } = useEventFilters()
  const { data: cities = [] } = useCities()

  return (
    <FilterField label="Ciudad">
      <Select
        value={filters.city ?? ''}
        onChange={(event) => updateFilters({ city: event.target.value })}
      >
        <option value="">Todas</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </Select>
    </FilterField>
  )
}

/** "Hasta" arranca en "Desde": el backend rechaza un rango invertido. */
function DateRangeFilter() {
  const { filters, updateFilters } = useEventFilters()

  return (
    <>
      <FilterField label="Desde">
        <Input
          type="date"
          value={filters.from ?? ''}
          onChange={(event) => updateFilters({ from: event.target.value })}
        />
      </FilterField>
      <FilterField label="Hasta">
        <Input
          type="date"
          min={filters.from}
          value={filters.to ?? ''}
          onChange={(event) => updateFilters({ to: event.target.value })}
        />
      </FilterField>
    </>
  )
}

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-subtle">
      {label}
      {children}
    </label>
  )
}
