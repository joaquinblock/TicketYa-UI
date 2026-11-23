import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { SeatMap } from '../../components/SeatMap'
import { SeatMapSkeleton } from '../../components/SeatMapSkeleton'
import { SeatsHeader } from '../../components/SeatsHeader'
import { SeatsLoadError } from '../../components/SeatsLoadError'
import { SeatsNotForSale } from '../../components/SeatsNotForSale'
import { SectorTabs } from '../../components/SectorTabs'
import { TakenSeatsAlert } from '../../components/TakenSeatsAlert'
import { useSeatsPageController } from './useSeatsPageController'

export function SeatsPage() {
  const { eventId = '' } = useParams()
  const {
    event,
    sectors,
    isNotForSale,
    hasLoadError,
    retryLoad,
    openSector,
    openSectorById,
    selection,
    takenSeats,
    toggleSeat,
  } = useSeatsPageController(eventId)

  let content: ReactNode
  if (isNotForSale) content = <SeatsNotForSale eventId={eventId} />
  else if (hasLoadError) content = <SeatsLoadError onRetry={retryLoad} />
  else if (sectors) {
    content = (
      <SeatsPanel>
        <SectorTabs
          sectors={sectors}
          openSectorId={openSector?.eventSectorId}
          onOpen={openSectorById}
        />
        {openSector?.numbered && (
          <SeatMap sector={openSector} selection={selection} onToggle={toggleSeat} />
        )}
        {takenSeats.length > 0 && <TakenSeatsAlert seats={takenSeats} />}
      </SeatsPanel>
    )
  } else {
    content = (
      <SeatsPanel>
        <SeatMapSkeleton />
      </SeatsPanel>
    )
  }

  return (
    <PurchaseLayout step={PURCHASE_STEP.SEATS} eventId={eventId}>
      <SeatsHeader event={event} />
      {content}
    </PurchaseLayout>
  )
}

function SeatsPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-5.5 rounded-2xl border border-line bg-surface p-5">
      {children}
    </div>
  )
}
