import { MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'

/** Las queries muestran su error en pantalla; las mutations, en un toast. */
export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => toast.error(getErrorMessage(error)),
  }),
})
