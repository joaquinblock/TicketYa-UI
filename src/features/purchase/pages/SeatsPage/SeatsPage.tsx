import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { SeatMap } from '../../components/SeatMap'
import { SeatMapSkeleton } from '../../components/SeatMapSkeleton'
import { SeatsHeader } from '../../components/SeatsHeader'
import { SeatsLoadError } from '../../components/SeatsLoadError'
import { SectorTabs } from '../../components/SectorTabs'
import { TakenSeatsAlert } from '../../components/TakenSeatsAlert'
import { useSeatsPageController } from './useSeatsPageController'

export function SeatsPage() {
  const { eventId = '' } = useParams()
  const {
    event,
    sectors,
    hasLoadError,
    retryLoad,
    openSector,
    openSectorById,
    selection,
    takenSeats,
    toggleSeat,
  } = useSeatsPageController(eventId)

  let content: ReactNode
  if (hasLoadError) content = <SeatsLoadError onRetry={retryLoad} />
  else if (sectors) {
    content = (
      <>
        <SectorTabs
          sectors={sectors}
          openSectorId={openSector?.eventSectorId}
          onOpen={openSectorById}
        />
        {openSector?.numbered && (
          <SeatMap sector={openSector} selection={selection} onToggle={toggleSeat} />
        )}
      </>
    )
  } else content = <SeatMapSkeleton />

  return (
    <PurchaseLayout step={PURCHASE_STEP.SEATS} eventId={eventId}>
      <SeatsHeader event={event} />
      {takenSeats.length > 0 && <TakenSeatsAlert seats={takenSeats} />}
      {content}
    </PurchaseLayout>
  )
}
