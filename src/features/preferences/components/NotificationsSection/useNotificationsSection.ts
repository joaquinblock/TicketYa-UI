import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isUnauthorizedError } from '@/shared/lib/http/ApiError'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'
import { preferencesKeys } from '../../lib/preferences.queryKeys'
import { getMyNotifications, markAllNotificationsRead } from '../../services/notifications.service'

const LOAD_ERROR_MESSAGE = 'No pudimos cargar tus notificaciones.'

export function useNotificationsSection() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: preferencesKeys.notifications(),
    queryFn: getMyNotifications,
  })
  const readAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSettled: () => queryClient.invalidateQueries({ queryKey: preferencesKeys.notifications() }),
  })

  const notifications = query.data ?? []
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return {
    isHidden: isUnauthorizedError(query.error),
    notifications,
    unreadCount,
    isLoading: query.isPending,
    loadError: query.error ? getErrorMessage(query.error, LOAD_ERROR_MESSAGE) : undefined,
    markAllRead: () => readAll.mutate(),
    isMarkingAllRead: readAll.isPending,
  }
}
