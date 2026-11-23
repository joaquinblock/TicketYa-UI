import type { SectorAvailability } from '@/shared/types/event.types'

/** Abre el primer sector con lugares, numerado o no; con todos agotados, ninguno. */
export function pickInitialSector(sectors: SectorAvailability[]) {
  return sectors.find((sector) => sector.availablePlaces > 0)
}
