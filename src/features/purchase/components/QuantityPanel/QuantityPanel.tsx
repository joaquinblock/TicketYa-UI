import type {
  QuantityStepper as QuantityStepperState,
  UnnumberedSector,
} from '../../types/purchase.types'
import { formatTicketLimit, formatUnnumberedPlaces } from '../../utils/seatFormat'
import { Stage } from '../Stage'
import { useStepperFocus } from './useStepperFocus'

type QuantityPanelProps = { sector: UnnumberedSector; stepper: QuantityStepperState }

export function QuantityPanel({ sector, stepper }: QuantityPanelProps) {
  return (
    <section aria-label={`Cantidad en ${sector.sectorName}`}>
      <Stage />
      <div role="img" aria-label={`${sector.sectorName} frente al escenario`}>
        {sector.sectorName}
      </div>
      <QuantityStepper stepper={stepper} />
      <span>{formatUnnumberedPlaces(sector)}</span>
      {sector.maxTicketsPerCustomer !== null && (
        <span>{formatTicketLimit(sector.maxTicketsPerCustomer)}</span>
      )}
    </section>
  )
}

function QuantityStepper({ stepper }: { stepper: QuantityStepperState }) {
  const { decreaseRef, increaseRef } = useStepperFocus(stepper)

  return (
    <div role="group" aria-label="Cantidad de entradas">
      <button
        ref={decreaseRef}
        type="button"
        aria-label="Una menos"
        disabled={!stepper.canDecrease}
        onClick={stepper.decrease}
      >
        −
      </button>
      <span aria-live="polite">{stepper.quantity}</span>
      <button
        ref={increaseRef}
        type="button"
        aria-label="Una más"
        disabled={!stepper.canIncrease}
        onClick={stepper.increase}
      >
        +
      </button>
    </div>
  )
}
