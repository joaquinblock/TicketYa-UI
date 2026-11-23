import { useEffect, useRef } from 'react'

type StepperLimits = { canDecrease: boolean; canIncrease: boolean }

/**
 * Un botón que llega a su tope se deshabilita y, si tenía el foco, el navegador lo manda al
 * `body`: el foco pasa al otro botón para que el próximo Tab no arranque desde el principio.
 */
export function useStepperFocus({ canDecrease, canIncrease }: StepperLimits) {
  const decreaseRef = useRef<HTMLButtonElement>(null)
  const increaseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!canIncrease && document.activeElement === increaseRef.current) decreaseRef.current?.focus()
  }, [canIncrease])

  useEffect(() => {
    if (!canDecrease && document.activeElement === decreaseRef.current) increaseRef.current?.focus()
  }, [canDecrease])

  return { decreaseRef, increaseRef }
}
