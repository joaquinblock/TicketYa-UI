import { Bell } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { Notification } from '../../types/notification.types'
import { formatNotificationTime } from '../../utils/notificationFormat'
import { useNotificationsSection } from './useNotificationsSection'

/** La bandeja del usuario: lo sin leer resalta con fondo y punto, no solo con color (Von Restorff). */
export function NotificationsSection() {
  const {
    isHidden,
    notifications,
    unreadCount,
    isLoading,
    loadError,
    markAllRead,
    isMarkingAllRead,
  } = useNotificationsSection()

  // Sin sesión, la página ya pide ingresar: la bandeja no suma un segundo aviso
  if (isHidden) return null

  return (
    <section aria-labelledby="notifications-title" className="flex flex-col gap-3.5 pt-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="notifications-title" className="text-[28px]">
            Notificaciones
          </h2>
          <p className="text-sm text-muted">
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Estás al día'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={isMarkingAllRead}
            className="min-h-11 cursor-pointer text-sm font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMarkingAllRead ? 'Marcando…' : 'Marcar todas como leídas'}
          </button>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted">Cargando notificaciones…</p>}

      {loadError && (
        <p role="alert" className="text-sm font-medium text-error-ink">
          {loadError}
        </p>
      )}

      {!isLoading && !loadError && notifications.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface px-5 py-6 text-sm text-muted">
          Todavía no tenés notificaciones. Te avisamos acá y por mail cuando compres o cambie un
          evento.
        </p>
      )}

      {notifications.length > 0 && (
        <ul className="overflow-hidden rounded-2xl border border-line bg-surface">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </section>
  )
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { title, body, createdAt, read } = notification

  return (
    <li
      aria-label={read ? title : `${title}, sin leer`}
      className={cn(
        'flex items-start gap-3.5 border-b border-line px-4 py-4 last:border-b-0 md:px-6',
        !read && 'bg-background',
      )}
    >
      <span
        aria-hidden="true"
        className="relative grid size-9 flex-none place-items-center rounded-full bg-surface-hover"
      >
        <Bell className="size-4" />
        {!read && <span className="absolute top-0 right-0 size-2.5 rounded-full bg-accent" />}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.75">
        <strong className="text-[15px]">{title}</strong>
        <span className="text-sm leading-normal text-muted">{body}</span>
      </div>
      <time dateTime={createdAt} className="text-xs whitespace-nowrap text-subtle">
        {formatNotificationTime(createdAt)}
      </time>
    </li>
  )
}
