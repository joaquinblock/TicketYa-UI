import type { SectorAvailability } from '@/shared/types/event.types'
import { formatSectorTabLabel } from '../utils/seatFormat'

type SectorTabsProps = {
  sectors: SectorAvailability[]
  openSectorId: number | undefined
  onOpen: (eventSectorId: number) => void
}

/** El estado de cada pestaña sale de `aria-pressed` y `disabled`: el estilo sigue a la accesibilidad. */
export function SectorTabs({ sectors, openSectorId, onOpen }: SectorTabsProps) {
  return (
    <div role="group" aria-label="Sectores" className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {sectors.map((sector) => (
        <button
          key={sector.eventSectorId}
          type="button"
          aria-pressed={sector.eventSectorId === openSectorId}
          disabled={sector.availablePlaces === 0}
          onClick={() => onOpen(sector.eventSectorId)}
          className="flex min-h-14.5 cursor-pointer flex-col items-center justify-center gap-0.75 rounded-control border border-line bg-surface text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:text-sold-out aria-pressed:border-ink aria-pressed:bg-tab-open aria-pressed:shadow-[inset_0_0_0_1px_var(--color-ink)]"
        >
          {sector.sectorName}{' '}
          <small className="text-xs font-medium text-subtle in-disabled:text-sold-out">
            {formatSectorTabLabel(sector)}
          </small>
        </button>
      ))}
    </div>
  )
}
