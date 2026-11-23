import { useQuery } from '@tanstack/react-query'
import { catalogKeys } from '../lib/catalog.queryKeys'
import { getCities } from '../services/venues.service'

export function useCities() {
  return useQuery({ queryKey: catalogKeys.cities(), queryFn: getCities })
}
