import { useState } from 'react'
import type { SectorAvailability } from '@/shared/types/event.types'
import { pickInitialSector } from '../domain/sectorChoice'

/** Hasta que el cliente toca una pestaña, queda abierto el primer sector con lugares. */
export function useOpenSector(sectors: SectorAvailability[]) {
  const [chosenSectorId, setChosenSectorId] = useState<number>()
  const openSector =
    sectors.find((sector) => sector.eventSectorId === chosenSectorId) ?? pickInitialSector(sectors)

  return { openSector, openSectorById: setChosenSectorId }
}
