import type {
  QuantityStepper as QuantityStepperState,
  UnnumberedSector,
} from '../types/purchase.types'
import { formatUnnumberedPlaces } from '../utils/seatFormat'
import { Stage } from './Stage'

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
    </section>
  )
}

function QuantityStepper({ stepper }: { stepper: QuantityStepperState }) {
  return (
    <div role="group" aria-label="Cantidad de entradas">
      <button
        type="button"
        aria-label="Una menos"
        disabled={!stepper.canDecrease}
        onClick={stepper.decrease}
      >
        −
      </button>
      <span aria-live="polite">{stepper.quantity}</span>
      <button
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
