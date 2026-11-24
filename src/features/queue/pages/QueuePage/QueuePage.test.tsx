import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { ApiError } from '@/shared/lib/http/ApiError'
import { getQueueTurn, saveQueueTurn } from '@/shared/lib/queueToken'
import { ROUTES } from '@/shared/lib/routes'
import { saveAccessToken } from '@/shared/lib/session'
import { devLogin, SEEDER_USER } from '@/test/gateway'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import * as queueService from '../../services/queue.service'

const HIGH_DEMAND_EVENT_ID = 1

function renderQueuePage(eventId: number = HIGH_DEMAND_EVENT_ID) {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route: ROUTES.queue(eventId) },
  )
}

describe('Fila virtual: CA1 a CA5', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('CA1 (integración real): ingresa a la fila del evento de alta demanda y muestra estado o turno', async () => {
    saveAccessToken(await devLogin(SEEDER_USER.CLIENT))
    renderQueuePage(HIGH_DEMAND_EVENT_ID)

    expect(screen.getByRole('status', { name: /Ingresando a la fila/i })).toBeInTheDocument()
    expect(
      await screen.findByText(/Los Serranos en vivo/i, undefined, { timeout: 5000 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Si volvés a entrar, conservás tu lugar.')).toBeInTheDocument()
  })

  it('CA1 espera y CA2 habilitado: guarda el queueToken en sessionStorage y habilita el avance a lugares', async () => {
    vi.spyOn(queueService, 'joinQueue').mockResolvedValue({
      status: 'WAITING',
      position: 42,
      queueToken: null,
      enabledUntil: null,
    })

    renderQueuePage(HIGH_DEMAND_EVENT_ID)

    expect(await screen.findByText('42')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'personas delante tuyo' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Esperando tu turno…' })).toBeDisabled()

    vi.restoreAllMocks()
    const enabledUntil = new Date(Date.now() + 10 * 60_000).toISOString()
    vi.spyOn(queueService, 'joinQueue').mockResolvedValue({
      status: 'ENABLED',
      position: 0,
      queueToken: 'jwt-turno-ok',
      enabledUntil,
    })

    renderQueuePage(HIGH_DEMAND_EVENT_ID)

    expect(
      await screen.findByRole('heading', { level: 1, name: '¡Es tu turno!' }),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(getQueueTurn(HIGH_DEMAND_EVENT_ID)).toEqual({
        queueToken: 'jwt-turno-ok',
        enabledUntil,
      }),
    )
    expect(screen.getByRole('link', { name: 'Ya podés elegir tus lugares' })).toHaveAttribute(
      'href',
      ROUTES.seats(HIGH_DEMAND_EVENT_ID),
    )
  })

  it('CA3 vencimiento: limpia el turno guardado y permite volver a hacer la fila', async () => {
    const user = userEvent.setup()
    saveQueueTurn(HIGH_DEMAND_EVENT_ID, {
      queueToken: 'jwt-viejo',
      enabledUntil: new Date(Date.now() + 60_000).toISOString(),
    })

    const joinSpy = vi
      .spyOn(queueService, 'joinQueue')
      .mockResolvedValueOnce({
        status: 'EXPIRED',
        position: null,
        queueToken: null,
        enabledUntil: null,
      })
      .mockResolvedValueOnce({
        status: 'WAITING',
        position: 120,
        queueToken: null,
        enabledUntil: null,
      })

    renderQueuePage(HIGH_DEMAND_EVENT_ID)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Se venció tu ventana' }),
    ).toBeInTheDocument()
    await waitFor(() => expect(getQueueTurn(HIGH_DEMAND_EVENT_ID)).toBeNull())

    await user.click(screen.getByRole('button', { name: 'Volver a hacer la fila' }))
    expect(await screen.findByText('120')).toBeInTheDocument()
    expect(joinSpy).toHaveBeenCalledTimes(2)
  })

  it('CA4 y CA5: muestra error de negocio sin Reintentar y error de red/503 con Reintentar', async () => {
    const user = userEvent.setup()
    vi.spyOn(queueService, 'joinQueue').mockRejectedValueOnce(
      new ApiError({ error: 'event_not_high_demand', message: 'No es alta demanda', status: 409 }),
    )

    renderQueuePage(2)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Este evento no tiene fila virtual' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument()
    const backLinks = screen.getAllByRole('link', { name: 'Volver al evento' })
    expect(backLinks.length).toBeGreaterThanOrEqual(2)
    for (const link of backLinks) {
      expect(link).toHaveAttribute('href', ROUTES.event(2))
    }

    vi.spyOn(queueService, 'joinQueue')
      .mockRejectedValueOnce(
        new ApiError({ error: 'service_unavailable', message: 'Caído', status: 503 }),
      )
      .mockResolvedValueOnce({
        status: 'WAITING',
        position: 15,
        queueToken: null,
        enabledUntil: null,
      })

    renderQueuePage(HIGH_DEMAND_EVENT_ID)
    const retryBtn = await screen.findByRole('button', { name: 'Reintentar' })
    await user.click(retryBtn)
    expect(await screen.findByText('15')).toBeInTheDocument()
  })
})

describe('Fila virtual: #8 CA5, sin sesión', () => {
  afterEach(() => vi.restoreAllMocks())

  it('ante 401 se abre el login y detrás dice que inicie sesión para hacer la fila', async () => {
    vi.spyOn(queueService, 'joinQueue').mockRejectedValue(
      new ApiError({ error: 'unauthorized', message: 'Sin token', status: 401 }),
    )
    renderQueuePage(HIGH_DEMAND_EVENT_ID)

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Iniciá sesión para hacer la fila.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Ingresá a TicketYa' })).toBeInTheDocument()
  })
})

describe('Fila virtual: reiniciar en desarrollo', () => {
  it('"Reiniciar la fila" vacía la fila, olvida el turno guardado y vuelve a entrar', async () => {
    saveQueueTurn(HIGH_DEMAND_EVENT_ID, {
      queueToken: 'jwt-turno-viejo',
      enabledUntil: new Date(Date.now() + 60_000).toISOString(),
    })
    vi.spyOn(queueService, 'joinQueue')
      .mockResolvedValueOnce({
        status: 'ENABLED',
        position: null,
        queueToken: 'jwt-turno-viejo',
        enabledUntil: new Date(Date.now() + 60_000).toISOString(),
      })
      .mockResolvedValue({ status: 'WAITING', position: 3, queueToken: null, enabledUntil: null })
    const reset = vi.spyOn(queueService, 'resetQueue').mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderQueuePage(HIGH_DEMAND_EVENT_ID)

    await user.click(
      await screen.findByRole('button', { name: 'Reiniciar la fila (solo en desarrollo)' }),
    )

    expect(reset).toHaveBeenCalledWith(HIGH_DEMAND_EVENT_ID)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'personas delante tuyo' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 }).previousElementSibling).toHaveTextContent('3')
    expect(getQueueTurn(HIGH_DEMAND_EVENT_ID)).toBeNull()
    vi.restoreAllMocks()
  })
})
