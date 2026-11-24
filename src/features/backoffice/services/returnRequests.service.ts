import { apiClient } from '@/shared/lib/http/apiClient'
import type {
  ReturnRequest,
  ReturnRequestFilter,
  ReturnRequestPage,
  ReturnRequestResolution,
} from '../types/returnRequest.types'

const RETURN_REQUESTS_ENDPOINT = '/api/return-requests'

/** Las solicitudes de devolución de todos los clientes. Solo para el administrador (`REFUND_RESOLVE`). */
export function getReturnRequests(
  filter: ReturnRequestFilter,
  page: number,
): Promise<ReturnRequestPage> {
  const params = filter === 'ALL' ? { page } : { status: filter, page }
  return apiClient.get<ReturnRequestPage>(RETURN_REQUESTS_ENDPOINT, { params })
}

/** Aprobar reintegra el dinero y libera el lugar; rechazar deja la entrada vigente. */
export function resolveReturnRequest(
  id: number,
  resolution: ReturnRequestResolution,
): Promise<ReturnRequest> {
  return apiClient.post<ReturnRequest>(`${RETURN_REQUESTS_ENDPOINT}/${id}/${resolution}`)
}
