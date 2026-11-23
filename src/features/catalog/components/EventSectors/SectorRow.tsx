import { formatPrice } from '@/shared/utils/eventFormat'
import type { SectorAvailability, SectorWithAvailability } from '@/shared/types/event.types'
import { formatPlacesLeft, formatSectorKind, getOccupancyPercent } from '../../utils/sectorFormat'

type SectorRowProps = { sector: SectorWithAvailability }

/**
 * Un sector con su tipo y su precio. Los lugares van solo si llegó su disponibilidad. En mobile la
 * barra pasa debajo del nombre y el precio queda a la derecha.
 */
export function SectorRow({ sector }: SectorRowProps) {
  const { availability } = sector

  return (
    <li className="grid min-h-19 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-b border-line py-3 sm:grid-cols-[minmax(0,1fr)_minmax(140px,1.2fr)_auto] sm:gap-5 sm:py-0">
      <div className="flex flex-col gap-1">
        <strong className="text-base">{sector.name}</strong>
        <span className="text-label text-subtle">
          {formatSectorKind({ numbered: sector.numbered, seats: availability?.seats ?? null })}
        </span>
      </div>
      {availability && <OccupancyBar sector={sector} availability={availability} />}
      <strong className="col-start-2 row-span-2 row-start-1 text-lg sm:col-start-3 sm:row-span-1">
        {formatPrice(sector.price)}
      </strong>
    </li>
  )
}

type OccupancyBarProps = { sector: SectorWithAvailability; availability: SectorAvailability }

/** La barra es decorativa: el que informa es el texto de lugares. */
function OccupancyBar({ sector, availability }: OccupancyBarProps) {
  const occupancy = getOccupancyPercent({
    capacity: sector.capacity,
    availablePlaces: availability.availablePlaces,
  })

  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden className="h-1.5 flex-1 overflow-hidden rounded-md bg-line">
        <span
          className="block h-full rounded-md bg-accent-hover"
          style={{ width: `${occupancy}%` }}
        />
      </span>
      <span className="text-xs whitespace-nowrap text-muted">
        {formatPlacesLeft(availability.availablePlaces)}
      </span>
    </div>
  )
}
