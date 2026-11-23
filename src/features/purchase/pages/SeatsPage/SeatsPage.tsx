import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { SeatMap } from '../../components/SeatMap'
import { SeatsHeader } from '../../components/SeatsHeader'
import { SectorTabs } from '../../components/SectorTabs'
import { useSeatsPageController } from './useSeatsPageController'

export function SeatsPage() {
  const { eventId = '' } = useParams()
  const { event, sectors, openSector, openSectorById, selection, toggleSeat } =
    useSeatsPageController(eventId)

  return (
    <PurchaseLayout step={PURCHASE_STEP.SEATS} eventId={eventId}>
      <SeatsHeader event={event} />
      {sectors && (
        <SectorTabs
          sectors={sectors}
          openSectorId={openSector?.eventSectorId}
          onOpen={openSectorById}
        />
      )}
      {openSector?.numbered && (
        <SeatMap sector={openSector} selection={selection} onToggle={toggleSeat} />
      )}
    </PurchaseLayout>
  )
}
