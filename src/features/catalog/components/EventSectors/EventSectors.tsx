import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/atoms/Button'
import type { EventDetail, PurchaseAction } from '../../types/catalog.types'
import { formatPurchaseTerms } from '../../utils/sectorFormat'
import { EventSectorsSkeleton } from './EventSectorsSkeleton'
import { SectorRow } from './SectorRow'
import { SectorsLoadError } from './SectorsLoadError'
import { useEventSectors } from './useEventSectors'

type EventSectorsProps = { event: EventDetail }

/** "Sectores y precios": cada sector con su precio y, si se puede comprar, cuántos lugares quedan. */
export function EventSectors({ event }: EventSectorsProps) {
  const { sectors, isLoading, isError, retry, purchaseAction } = useEventSectors(event)

  let content: ReactNode
  if (isLoading) content = <EventSectorsSkeleton rowCount={sectors.length} />
  else if (isError) content = <SectorsLoadError onRetry={retry} />
  else
    content = (
      <ul>
        {sectors.map((sector) => (
          <SectorRow key={sector.sectorId} sector={sector} />
        ))}
      </ul>
    )

  return (
    <section aria-labelledby="sectores">
      <p>Encontrá tu lugar</p>
      <h2 id="sectores">Sectores y precios</h2>
      {content}
      {purchaseAction && (
        <PurchaseButton action={purchaseAction} maxTickets={event.maxTicketsPerCustomer} />
      )}
    </section>
  )
}

type PurchaseButtonProps = { action: PurchaseAction; maxTickets: number | null }

/** El texto de límite y devoluciones va solo junto al botón: sin compra, no hay nada que avisar. */
function PurchaseButton({ action, maxTickets }: PurchaseButtonProps) {
  return (
    <>
      <Button asChild>
        <Link to={action.to}>
          {action.label}
          <ArrowUpRight aria-hidden className="size-4.5" />
        </Link>
      </Button>
      <p>{formatPurchaseTerms(maxTickets)}</p>
    </>
  )
}
