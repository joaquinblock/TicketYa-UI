import { Chip } from '@/shared/components/atoms/Chip'
import { cn } from '@/shared/lib/cn'
import { EVENT_TYPE_LABEL, EVENT_TYPES } from '../constants/catalog.constants'
import { useEventFilters } from '../hooks/useEventFilters'

/** Accesos rápidos del hero: escriben el mismo filtro de tipo que los chips de la cartelera. */
export function QuickTypeFilter() {
  const { filters, updateFilters } = useEventFilters()

  return (
    <div role="group" aria-label="Accesos rápidos por tipo" className="flex flex-wrap gap-2">
      {EVENT_TYPES.map((type) => {
        const isSelected = filters.type === type
        return (
          <Chip
            key={type}
            isSelected={isSelected}
            onClick={() => updateFilters({ type: isSelected ? undefined : type })}
            className={cn(
              'border border-surface/35 bg-ink/35 text-surface hover:bg-ink/60 hover:text-surface',
              isSelected && 'border-accent bg-accent text-ink hover:bg-accent hover:text-ink',
            )}
          >
            {EVENT_TYPE_LABEL[type].plural}
          </Chip>
        )
      })}
    </div>
  )
}
