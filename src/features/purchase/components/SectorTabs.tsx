import type { SectorAvailability } from '@/shared/types/event.types'
import { formatSectorTabLabel } from '../utils/seatFormat'

type SectorTabsProps = {
  sectors: SectorAvailability[]
  openSectorId: number | undefined
  onOpen: (eventSectorId: number) => void
}

export function SectorTabs({ sectors, openSectorId, onOpen }: SectorTabsProps) {
  return (
    <div role="group" aria-label="Sectores" className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {sectors.map((sector) => (
        <button
          key={sector.eventSectorId}
          type="button"
          aria-pressed={sector.eventSectorId === openSectorId}
          onClick={() => onOpen(sector.eventSectorId)}
        >
          <span>{sector.sectorName}</span> <span>{formatSectorTabLabel(sector)}</span>
        </button>
      ))}
    </div>
  )
}
