import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import type { EventDetail, PurchaseAction } from '../../types/catalog.types'
import { SectorRow } from './SectorRow'
import { useEventSectors } from './useEventSectors'

type EventSectorsProps = { event: EventDetail }

/** "Sectores y precios": cada sector con su precio y, si se puede comprar, cuántos lugares quedan. */
export function EventSectors({ event }: EventSectorsProps) {
  const { sectors, isLoading, purchaseAction } = useEventSectors(event)

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
      {purchaseAction && <PurchaseButton action={purchaseAction} />}
    </section>
  )
}

function PurchaseButton({ action }: { action: PurchaseAction }) {
  return (
    <Button asChild>
      <Link to={action.to}>
        {action.label}
        <ArrowUpRight aria-hidden className="size-4.5" />
      </Link>
    </Button>
  )
}
