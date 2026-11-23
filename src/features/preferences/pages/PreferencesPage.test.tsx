import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import * as venuesService from '@/features/catalog/services/venues.service'
import { ApiError } from '@/shared/lib/http/ApiError'
import { ROUTES } from '@/shared/lib/routes'
import type { Participant } from '@/shared/types/event.types'
import { renderWithProviders } from '@/test/render'
import * as preferencesService from '../services/preferences.service'

const PARTICIPANTS_FIXTURE: Participant[] = [
  { id: 1, name: 'Los Serranos', type: 'ARTIST' },
  { id: 2, name: 'Compañía Teatro del Centro', type: 'ARTIST' },
  { id: 3, name: 'Club Atlético Central', type: 'TEAM' },
  { id: 4, name: 'Dra. Paula Ríos', type: 'SPEAKER' },
]

function renderPreferencesPage() {
  return renderWithProviders(<AppRouter />, { route: ROUTES.preferences })
}

describe('Preferencias y favoritos: CA1 a CA5', () => {
  beforeEach(() => {
    vi.spyOn(preferencesService, 'ensureDevClientSession').mockResolvedValue()
    vi.spyOn(preferencesService, 'getParticipants').mockResolvedValue(PARTICIPANTS_FIXTURE)
    vi.spyOn(venuesService, 'getCities').mockResolvedValue(['Buenos Aires', 'Córdoba', 'Tandil'])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('CA1: muestra indicador de carga y luego las preferencias guardadas', async () => {
    let resolvePrefs!: (value: {
      eventTypes: ['CONCERT']
      participantIds: [1]
      city: 'Tandil'
    }) => void
    vi.spyOn(preferencesService, 'getMyPreferences').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePrefs = resolve
        }),
    )

    renderPreferencesPage()

    expect(screen.getByRole('status', { name: 'Cargando tus preferencias' })).toBeInTheDocument()

    resolvePrefs({ eventTypes: ['CONCERT'], participantIds: [1], city: 'Tandil' })

    expect(await screen.findByRole('button', { name: 'Recitales' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Teatro' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Quitar Los Serranos de favoritos' })).toBeVisible()
    expect(screen.getByLabelText('Tu ciudad')).toHaveValue('Tandil')
  })

  it('CA2: guarda cambios, deshabilita mientras envía y oculta el mensaje al volver a editar', async () => {
    const user = userEvent.setup()
    vi.spyOn(preferencesService, 'getMyPreferences').mockResolvedValueOnce({
      eventTypes: ['CONCERT'],
      participantIds: [1],
      city: 'Tandil',
    })
    let resolveSave!: (value: {
      eventTypes: ('CONCERT' | 'THEATER')[]
      participantIds: number[]
      city: string | null
    }) => void
    const updateSpy = vi.spyOn(preferencesService, 'updateMyPreferences').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSave = resolve
        }),
    )

    renderPreferencesPage()

    await user.click(await screen.findByRole('button', { name: 'Teatro' }))
    await user.click(screen.getByRole('button', { name: 'Quitar Los Serranos de favoritos' }))
    await user.selectOptions(screen.getByLabelText('Tu ciudad'), '')

    await user.click(screen.getByRole('button', { name: 'Guardar preferencias' }))

    const savingBtn = screen.getByRole('button', { name: 'Guardando…' })
    expect(savingBtn).toBeDisabled()
    expect(updateSpy).toHaveBeenCalledWith({
      eventTypes: ['CONCERT', 'THEATER'],
      participantIds: [],
      city: null,
    })

    resolveSave({ eventTypes: ['CONCERT', 'THEATER'], participantIds: [], city: null })

    expect(await screen.findByRole('status')).toHaveTextContent('Guardamos tus preferencias')

    await user.click(screen.getByRole('button', { name: 'Deportes' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('CA3: al abrir Agregar favorito filtra por nombre y muestra aviso sin coincidencias', async () => {
    const user = userEvent.setup()
    vi.spyOn(preferencesService, 'getMyPreferences').mockResolvedValueOnce({
      eventTypes: [],
      participantIds: [1],
      city: null,
    })

    renderPreferencesPage()

    await user.click(await screen.findByRole('button', { name: 'Agregar favorito' }))

    expect(screen.queryByRole('button', { name: '+ Los Serranos' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Dra. Paula Ríos' })).toBeInTheDocument()

    const searchInput = screen.getByLabelText('Buscá un artista, equipo o disertante')
    await user.type(searchInput, 'paula')
    expect(screen.getByRole('button', { name: '+ Dra. Paula Ríos' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '+ Dra. Paula Ríos' }))
    expect(
      screen.getByRole('button', { name: 'Quitar Dra. Paula Ríos de favoritos' }),
    ).toBeVisible()

    await user.type(searchInput, 'zzzzzz')
    expect(screen.getByText('No encontramos a nadie con ese nombre.')).toBeInTheDocument()
  })

  it('CA4: ante error de carga permite reintentar y ante error de guardado conserva los cambios', async () => {
    const user = userEvent.setup()
    vi.spyOn(preferencesService, 'getMyPreferences')
      .mockRejectedValueOnce(
        new ApiError({ error: 'service_unavailable', message: 'Caído', status: 503 }),
      )
      .mockResolvedValueOnce({ eventTypes: [], participantIds: [], city: null })
    vi.spyOn(preferencesService, 'updateMyPreferences').mockRejectedValueOnce(
      new ApiError({ error: 'service_unavailable', message: 'No disponible', status: 503 }),
    )

    renderPreferencesPage()

    const retryBtn = await screen.findByRole('button', { name: 'Reintentar' })
    await user.click(retryBtn)

    await user.click(await screen.findByRole('button', { name: 'Recitales' }))
    await user.click(screen.getByRole('button', { name: 'Guardar preferencias' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('No disponible')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Guardar preferencias' })).toBeEnabled(),
    )
    expect(screen.getByRole('button', { name: 'Recitales' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('CA5: ante 403 muestra aviso de solo clientes autenticados', async () => {
    vi.spyOn(preferencesService, 'getMyPreferences').mockRejectedValueOnce(
      new ApiError({ error: 'forbidden', message: 'Solo clientes', status: 403 }),
    )

    renderPreferencesPage()

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Solo para clientes autenticados' }),
    ).toBeInTheDocument()
  })
})
