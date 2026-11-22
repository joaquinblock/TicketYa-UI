import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError } from '@/shared/lib/http/ApiError'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'

const MAX_QUERY_RETRIES = 3
const STALE_TIME_MS = 5 * 60 * 1000

function isClientError(error: unknown) {
  return error instanceof ApiError && error.status >= 400 && error.status < 500
}

function isConnectionOrServerError(error: unknown) {
  return error instanceof ApiError && (error.status === 0 || error.status >= 500)
}

/**
 * Las queries muestran su error en pantalla y solo avisan con toast si falla la conexión o el
 * servidor. Las mutations siempre avisan con toast.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isConnectionOrServerError(error)) toast.error(getErrorMessage(error))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => toast.error(getErrorMessage(error)),
  }),
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      refetchOnWindowFocus: false,
      // Un 4xx no se arregla reintentando.
      retry: (failureCount, error) => !isClientError(error) && failureCount < MAX_QUERY_RETRIES,
    },
  },
})
