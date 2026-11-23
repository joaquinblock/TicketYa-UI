import type { ComponentProps } from 'react'
import type {
  QuantityStepper as QuantityStepperState,
  UnnumberedSector,
} from '../../types/purchase.types'
import { formatTicketLimit, formatUnnumberedPlaces } from '../../utils/seatFormat'
import { Stage } from '../Stage'
import { useStepperFocus } from './useStepperFocus'

type QuantityPanelProps = { sector: UnnumberedSector; stepper: QuantityStepperState }

/** Las "personitas" del bloque del sector, como en el mockup. */
const FIELD_FIGURES = Array.from({ length: 5 }, (_, index) => index)

export function QuantityPanel({ sector, stepper }: QuantityPanelProps) {
  return (
    <section
      aria-label={`Cantidad en ${sector.sectorName}`}
      className="flex flex-col gap-4 rounded-xl border border-line p-5"
    >
      <Stage className="max-w-none" />
      <FieldBlock sectorName={sector.sectorName} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <QuantityStepper stepper={stepper} />
        <div className="flex flex-col gap-0.5 text-label text-muted">
          <span>{formatUnnumberedPlaces(sector)}</span>
          {sector.maxTicketsPerCustomer !== null && (
            <span>{formatTicketLimit(sector.maxTicketsPerCustomer)}</span>
          )}
        </div>
      </div>
    </section>
  )
}

function FieldBlock({ sectorName }: { sectorName: string }) {
  return (
    <div
      role="img"
      aria-label={`${sectorName} frente al escenario`}
      className="flex h-42.5 flex-col items-center justify-center gap-3.5 rounded-control bg-seat-free text-xs font-bold tracking-[0.18em] text-seat-free-ink uppercase"
    >
      <span aria-hidden className="flex gap-2">
        {FIELD_FIGURES.map((figure) => (
          <i key={figure} className="block h-6.5 w-3.5 rounded-full bg-seat-free-line" />
        ))}
      </span>
      {sectorName}
    </div>
  )
}

/** Sin `overflow-hidden` en el grupo: recortaría el contorno del foco de los botones. */
function QuantityStepper({ stepper }: { stepper: QuantityStepperState }) {
  const { decreaseRef, increaseRef } = useStepperFocus(stepper)

  return (
    <div
      role="group"
      aria-label="Cantidad de entradas"
      className="inline-flex items-center rounded-control border border-line-strong bg-surface"
    >
      <StepperButton
        ref={decreaseRef}
        label="Una menos"
        disabled={!stepper.canDecrease}
        onClick={stepper.decrease}
      >
        −
      </StepperButton>
      <span
        aria-live="polite"
        className="min-w-12 text-center font-mono text-lg font-medium tabular-nums"
      >
        {stepper.quantity}
      </span>
      <StepperButton
        ref={increaseRef}
        label="Una más"
        disabled={!stepper.canIncrease}
        onClick={stepper.increase}
      >
        +
      </StepperButton>
    </div>
  )
}

type StepperButtonProps = Omit<ComponentProps<'button'>, 'aria-label' | 'type'> & {
  label: string
}

/** 46 px, como en el mockup (Fitts, WCAG 2.5.5). Deshabilitado cambia el fondo y el signo. */
function StepperButton({ label, ...props }: StepperButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="size-11.5 cursor-pointer rounded-control bg-surface text-xl font-semibold text-ink hover:bg-surface-hover disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-sold-out"
      {...props}
    />
  )
}
