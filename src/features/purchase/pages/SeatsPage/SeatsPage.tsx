import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { PurchaseLayout } from '@/shared/components/templates/PurchaseLayout/PurchaseLayout'
import { PURCHASE_STEP } from '@/shared/components/templates/PurchaseLayout/purchaseSteps.constants'
import { SeatMap } from '../../components/SeatMap'
import { SeatMapSkeleton } from '../../components/SeatMapSkeleton'
import { SeatsHeader } from '../../components/SeatsHeader'
import { SeatsLoadError } from '../../components/SeatsLoadError'
import { QuantityPanel } from '../../components/QuantityPanel/QuantityPanel'
import { SeatsNotForSale } from '../../components/SeatsNotForSale'
import { SectorTabs } from '../../components/SectorTabs'
import { SelectionChangedAlert } from '../../components/SelectionChangedAlert'
import { SelectionSummary } from '../../components/SelectionSummary'
import { formatQuantityChangeMessage, formatTakenSeatsMessage } from '../../utils/seatFormat'
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
    unnumberedSector,
    quantityStepper,
    quantityChange,
    selectionSummary,
    maxTicketsPerCustomer,
    reservation,
  } = useSeatsPageController(eventId)

  let content: ReactNode
  if (isNotForSale) content = <SeatsNotForSale eventId={eventId} />
  else if (hasLoadError) content = <SeatsLoadError onRetry={retryLoad} />
  else if (sectors && event) {
    content = (
      <div className="flex flex-wrap items-start gap-5">
        <SeatsPanel>
          <SectorTabs
            sectors={sectors}
            openSectorId={openSector?.eventSectorId}
            onOpen={openSectorById}
          />
          {openSector?.numbered && (
            <SeatMap
              sector={openSector}
              selection={selection}
              onToggle={toggleSeat}
              maxTicketsPerCustomer={maxTicketsPerCustomer}
            />
          )}
          {unnumberedSector && (
            <QuantityPanel sector={unnumberedSector} stepper={quantityStepper} />
          )}
          {takenSeats.length > 0 && (
            <SelectionChangedAlert message={formatTakenSeatsMessage(takenSeats)} />
          )}
          {unnumberedSector && quantityChange !== 'NONE' && (
            <SelectionChangedAlert
              message={formatQuantityChangeMessage(quantityChange, {
                sectorName: unnumberedSector.sectorName,
                quantity: quantityStepper.quantity,
              })}
            />
          )}
        </SeatsPanel>
        <SelectionSummary
          summary={selectionSummary}
          maxTicketsPerCustomer={maxTicketsPerCustomer}
          reservation={reservation}
        />
      </div>
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
    <div className="flex min-w-0 flex-[999_1_620px] flex-col gap-5.5 rounded-2xl border border-line bg-surface p-5">
      {children}
    </div>
  )
}
