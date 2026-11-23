import { ListFilter } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Button } from '@/shared/components/atoms/Button'
import { Chip } from '@/shared/components/atoms/Chip'
import { Input } from '@/shared/components/atoms/Input'
import { Select } from '@/shared/components/atoms/Select'
import { cn } from '@/shared/lib/cn'
import { EVENT_TYPES } from '@/shared/constants/event.constants'
import { EVENT_TYPE_LABEL } from '../constants/catalog.constants'
import { useCities } from '../hooks/useCities'
import { useEventFilters } from '../hooks/useEventFilters'

const MORE_FILTERS_ID = 'mas-filtros'

/** En mobile, ciudad y fechas se pliegan detrás de "Filtros (n)" para que los chips queden a la vista. */
export function EventFilters() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <EventTypeChips />
        <MoreFiltersToggle isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
      </div>
      <div
        id={MORE_FILTERS_ID}
        className={cn(
          'grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5 border-t border-line pt-3 md:grid',
          isExpanded ? 'grid' : 'hidden',
        )}
      >
        <CityFilter />
        <DateRangeFilter />
      </div>
    </div>
  )
}

function MoreFiltersToggle({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean
  onToggle: () => void
}) {
  const { filters } = useEventFilters()
  const activeCount = [filters.city, filters.from, filters.to].filter(Boolean).length

  return (
    <Button
      variant="ghost"
      aria-expanded={isExpanded}
      aria-controls={MORE_FILTERS_ID}
      onClick={onToggle}
      className="md:hidden"
    >
      <ListFilter aria-hidden className="size-4.5" />
      {activeCount > 0 ? `Filtros (${activeCount})` : 'Filtros'}
    </Button>
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

/** Si las ciudades no cargan, el resto de la cartelera sigue andando: solo este filtro queda sin usar. */
function CityFilter() {
  const { filters, updateFilters } = useEventFilters()
  const { data: cities = [], isError } = useCities()

  return (
    <FilterField label="Ciudad">
      <Select
        disabled={isError}
        value={isError ? '' : (filters.city ?? '')}
        onChange={(event) => updateFilters({ city: event.target.value })}
      >
        <option value="">{isError ? 'No disponible' : 'Todas'}</option>
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
