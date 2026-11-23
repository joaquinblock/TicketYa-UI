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

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** La pantalla muestra el error al lado de la acción: el toast lo repetiría (ADR 0005). */
      handlesErrorInline?: boolean
    }
  }
}

/**
 * Las queries muestran su error en pantalla y solo avisan con toast si falla la conexión o el
 * servidor. Las mutations avisan con toast, salvo las que muestran el error en pantalla.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isConnectionOrServerError(error)) toast.error(getErrorMessage(error))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      if (!mutation.meta?.handlesErrorInline) toast.error(getErrorMessage(error))
    },
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
