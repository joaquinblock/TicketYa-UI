import { formatPrice } from '../../lib/eventFormat'
import type { SectorWithAvailability } from '../../types/catalog.types'
import { formatPlacesLeft, formatSectorKind } from '../../utils/sectorFormat'

type SectorRowProps = { sector: SectorWithAvailability }

/** Un sector con su tipo y su precio. Los lugares van solo si llegó su disponibilidad. */
export function SectorRow({ sector }: SectorRowProps) {
  const { availability } = sector

  return (
    <li>
      <div>
        <strong>{sector.name}</strong>
        <span>
          {formatSectorKind({ numbered: sector.numbered, seats: availability?.seats ?? null })}
        </span>
      </div>
      {availability && <span>{formatPlacesLeft(availability.availablePlaces)}</span>}
      <strong>{formatPrice(sector.price)}</strong>
    </li>
  )
}
