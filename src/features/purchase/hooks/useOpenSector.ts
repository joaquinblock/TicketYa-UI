import { useState } from 'react'
import type { SectorAvailability } from '@/shared/types/event.types'
import { pickInitialSector } from '../domain/sectorChoice'

/**
 * Hasta que el cliente toca una pestaña, queda abierto el primer sector con lugares. Una vez
 * abierto queda fijo: si un refresco lo agota, el cliente ve el aviso en vez de saltar a otro.
 */
export function useOpenSector(sectors: SectorAvailability[]) {
  const [chosenSectorId, setChosenSectorId] = useState<number>()
  const openSector =
    sectors.find((sector) => sector.eventSectorId === chosenSectorId) ?? pickInitialSector(sectors)

  if (openSector && chosenSectorId === undefined) setChosenSectorId(openSector.eventSectorId)

  return { openSector, openSectorById: setChosenSectorId }
}
