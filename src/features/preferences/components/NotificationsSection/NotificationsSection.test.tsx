import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { saveAccessToken } from '@/shared/lib/session'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { renderWithProviders } from '@/test/render'
import * as notificationsService from '../../services/notifications.service'
import type { Notification } from '../../types/notification.types'

const GATEWAY_URL = import.meta.env.TICKETYA_GATEWAY_URL

async function notificationsOf(token: string): Promise<Notification[]> {
  const response = await fetch(`${GATEWAY_URL}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return (await response.json()) as Notification[]
}

function renderPreferences() {
  return renderWithProviders(<AppRouter />, { route: ROUTES.preferences })
}

async function findNotificationsSection() {
  return screen.findByRole('region', { name: 'Notificaciones' })
}

describe('Notificaciones en Preferencias', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('muestra un aviso por cada notificación que el backend tiene para el cliente, con las sin leer marcadas', async () => {
    const token = await devLogin(SEEDER_USER.CLIENT)
    saveAccessToken(token)
    const expected = await notificationsOf(token)
    renderPreferences()

    const section = await findNotificationsSection()
    const items = await within(section).findAllByRole('listitem')

    expect(items).toHaveLength(expected.length)
    expected.forEach((notification, index) => {
      expect(items[index]).toHaveTextContent(notification.title)
      expect(items[index]).toHaveAccessibleName(
        notification.read ? notification.title : `${notification.title}, sin leer`,
      )
    })
  })

  it('también la ve un organizador, que no tiene preferencias', async () => {
    saveAccessToken(await devLogin(SEEDER_USER.ORGANIZER))
    renderPreferences()

    expect(await findNotificationsSection()).toBeInTheDocument()
  })

  it('"Marcar todas como leídas" las marca en el backend y la sección queda al día', async () => {
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    const unread: Notification = {
      id: 1,
      title: 'Tu compra está confirmada',
      body: 'Tus entradas ya están en Mis entradas.',
      createdAt: new Date().toISOString(),
      read: false,
    }
    vi.spyOn(notificationsService, 'getMyNotifications')
      .mockResolvedValueOnce([unread])
      .mockResolvedValue([{ ...unread, read: true }])
    const markAllRead = vi
      .spyOn(notificationsService, 'markAllNotificationsRead')
      .mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderPreferences()

    const section = await findNotificationsSection()
    expect(await within(section).findByText('1 sin leer')).toBeInTheDocument()
    await user.click(within(section).getByRole('button', { name: 'Marcar todas como leídas' }))

    expect(markAllRead).toHaveBeenCalledOnce()
    await waitFor(() => expect(within(section).getByText('Estás al día')).toBeInTheDocument())
    expect(
      within(section).queryByRole('button', { name: 'Marcar todas como leídas' }),
    ).not.toBeInTheDocument()
  })

  it('sin notificaciones, avisa que todavía no hay', async () => {
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    vi.spyOn(notificationsService, 'getMyNotifications').mockResolvedValue([])
    renderPreferences()

    const section = await findNotificationsSection()
    expect(await within(section).findByText(/Todavía no tenés notificaciones/)).toBeInTheDocument()
  })
})
