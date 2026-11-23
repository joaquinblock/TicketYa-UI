import type { EventDetail } from '../../types/catalog.types'
import { SectorRow } from './SectorRow'
import { useEventSectors } from './useEventSectors'

type EventSectorsProps = { event: EventDetail }

/** "Sectores y precios": cada sector con su precio y, si se puede comprar, cuántos lugares quedan. */
export function EventSectors({ event }: EventSectorsProps) {
  const { sectors, isLoading } = useEventSectors(event)

  return (
    <section aria-labelledby="sectores">
      <p>Encontrá tu lugar</p>
      <h2 id="sectores">Sectores y precios</h2>
      {!isLoading && (
        <ul>
          {sectors.map((sector) => (
            <SectorRow key={sector.sectorId} sector={sector} />
          ))}
        </ul>
      )}
    </section>
  )
}
