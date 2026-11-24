import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ROUTES } from '@/shared/lib/routes'
import { getAccessToken, saveAccessToken } from '@/shared/lib/session'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { getCurrentUrl, LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import * as authService from '../../services/auth.service'
import type { CurrentUser } from '../../types/auth.types'

const GATEWAY_URL = import.meta.env.TICKETYA_GATEWAY_URL
const LOGIN_DIALOG = { name: 'Ingresá a TicketYa' }

function renderApp(route: string = ROUTES.home) {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route },
  )
}

/** Lo que el backend dice del usuario de ese token: el header tiene que mostrar eso. */
async function currentUserOf(token: string): Promise<CurrentUser> {
  const response = await fetch(`${GATEWAY_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return (await response.json()) as CurrentUser
}

describe('Login: CA1, entrar desde el header', () => {
  it('con el usuario de prueba, el modal se cierra, el header muestra mi nombre y queda el token', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByRole('dialog', LOGIN_DIALOG)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuar con Google' }))
    await user.click(screen.getByRole('button', { name: /client@ticketya.com/ }))

    await waitFor(() => expect(screen.queryByRole('dialog', LOGIN_DIALOG)).not.toBeInTheDocument())
    const token = getAccessToken()
    expect(token).toBeDefined()
    const { firstName, lastName } = await currentUserOf(token!)
    expect(
      await screen.findByRole('button', { name: `${firstName} ${lastName}, salir` }),
    ).toBeInTheDocument()
  })
})

describe('Login: CA2, mientras se canjea el token', () => {
  afterEach(() => vi.restoreAllMocks())

  it('se ve "Ingresando…" y las cuentas no se pueden tocar', async () => {
    // El canje no termina: así se ve el estado intermedio, que contra el gateway dura milisegundos.
    vi.spyOn(authService, 'devLogin').mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar con Google' }))
    await user.click(screen.getByRole('button', { name: /client@ticketya.com/ }))

    expect(screen.getByText('Ingresando…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /client@ticketya.com/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeDisabled()
  })
})

describe('Login: cerrar el modal', () => {
  it('Escape lo cierra, sigo sin sesión y el foco vuelve a "Ingresar"', async () => {
    const user = userEvent.setup()
    renderApp()
    const loginButton = screen.getByRole('button', { name: 'Ingresar' })

    await user.click(loginButton)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', LOGIN_DIALOG)).not.toBeInTheDocument()
    expect(loginButton).toHaveFocus()
    expect(getAccessToken()).toBeUndefined()
  })
})

describe('Login: CA6, cerrar sesión', () => {
  it('al tocar mi nombre vuelvo a Inicio, el header dice "Ingresar" y no queda token', async () => {
    const token = await devLogin(SEEDER_USER.CLIENT)
    saveAccessToken(token)
    const { firstName, lastName } = await currentUserOf(token)
    const user = userEvent.setup()
    renderApp(ROUTES.preferences)

    await user.click(await screen.findByRole('button', { name: `${firstName} ${lastName}, salir` }))

    expect(getCurrentUrl().pathname).toBe(ROUTES.home)
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
    expect(getAccessToken()).toBeUndefined()
  })
})

describe('Login: cuentas de prueba en el botón de Google', () => {
  it('ofrece un email del seeder por rol: cliente, organizador, administrador y personal de acceso', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar con Google' }))

    for (const email of [
      'client@ticketya.com',
      'organizer@ticketya.com',
      'admin@ticketya.com',
      'staff@ticketya.com',
    ]) {
      expect(screen.getByRole('button', { name: (name) => name.includes(email) })).toBeEnabled()
    }
  })

  it('al elegir el organizador, el header muestra el nombre del usuario 2 del seeder', async () => {
    const { firstName, lastName } = await currentUserOf(await devLogin(SEEDER_USER.ORGANIZER))
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'Ingresar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar con Google' }))
    await user.click(screen.getByRole('button', { name: /organizer@ticketya\.com/ }))

    expect(
      await screen.findByRole('button', { name: `${firstName} ${lastName}, salir` }),
    ).toBeInTheDocument()
  })
})
