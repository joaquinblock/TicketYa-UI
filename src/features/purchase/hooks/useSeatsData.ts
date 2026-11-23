import { useEvent } from '@/shared/hooks/useEvent'
import { useEventAvailability } from '@/shared/hooks/useEventAvailability'

/**
 * El evento y su disponibilidad, con un estado de carga para los dos. Sin precios, reintentar no
 * lo arregla y manda aunque el evento también falle. Si falla un refresco con los datos en
 * pantalla, quedan los últimos: el error de carga es solo sin datos.
 */
export function useSeatsData(eventId: number | undefined) {
  const eventQuery = useEvent(eventId)
  const availabilityQuery = useEventAvailability(eventId)
  const sectors = availabilityQuery.availability?.sectors
  const { isNotForSale } = availabilityQuery
  const hasLoadError =
    !isNotForSale &&
    ((eventQuery.isError && !eventQuery.event) || (availabilityQuery.isError && !sectors))

  const retryLoad = () => {
    void eventQuery.refetch()
    void availabilityQuery.refetch()
  }

  return { event: eventQuery.event, sectors, isNotForSale, hasLoadError, retryLoad }
}
