import type { UnnumberedSector } from '../types/purchase.types'
import { formatUnnumberedPlaces } from '../utils/seatFormat'
import { Stage } from './Stage'

type QuantityPanelProps = { sector: UnnumberedSector; quantity: number }

export function QuantityPanel({ sector, quantity }: QuantityPanelProps) {
  return (
    <section aria-label={`Cantidad en ${sector.sectorName}`}>
      <Stage />
      <div role="img" aria-label={`${sector.sectorName} frente al escenario`}>
        {sector.sectorName}
      </div>
      <div role="group" aria-label="Cantidad de entradas">
        <span aria-live="polite">{quantity}</span>
      </div>
      <span>{formatUnnumberedPlaces(sector)}</span>
    </section>
  )
}
