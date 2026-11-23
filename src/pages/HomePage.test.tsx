import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { setupApiClient } from '@/app/setupApiClient'
import { EVENTS_PAGE_SIZE } from '@/features/catalog/constants/catalog.constants'
import { searchEvents } from '@/features/catalog/services/events.service'
import type { EventFilters, EventSummary } from '@/features/catalog/types/catalog.types'
import { configureApiClient } from '@/shared/lib/http/apiClient'
import { getCurrentUrl, LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'

/**
 * Los datos los pone el seeder del backend y pueden cambiar: los tests verifican reglas o comparan con lo que la API
 * responde para los mismos filtros. Las únicas anclas son las de "Datos de prueba" (`event-service.md`).
 */
const SOLD_OUT_ANCHOR = 'Jazz en el puerto'
const NO_MATCH_TEXT = 'zzz-sin-resultados'
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function renderHome(route = '/') {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route },
  )
}

/** Lo que la API responde para los mismos filtros que la pantalla. */
function fetchFromApi(filters: Partial<EventFilters> = {}) {
  return searchEvents({ sort: 'DATE', page: 1, ...filters }, EVENTS_PAGE_SIZE)
}

async function findEventCards() {
  const list = await screen.findByRole('list', { name: 'Eventos' })
  return within(list).getAllByRole('listitem')
}

async function expectEventNames(events: EventSummary[]) {
  await waitFor(async () => {
    const cards = await findEventCards()
    const names = cards.map((card) => within(card).getByRole('heading').textContent)
    expect(names).toEqual(events.map((event) => event.name))
  })
}

async function expectEveryCardToShow(text: string) {
  await waitFor(async () => {
    const cards = await findEventCards()
    for (const card of cards) expect(card).toHaveTextContent(text)
  })
}

function expectResultCount(total: number) {
  const count = screen.getByText(/^eventos?$/).closest('p')
  expect(count).toHaveTextContent(new RegExp(`^${String(total).padStart(2, '0')}\\s*eventos?$`))
}

async function chooseType(label: string) {
  const user = userEvent.setup()
  const types = screen.getByRole('group', { name: 'Tipo de evento' })
  await user.click(within(types).getByRole('button', { name: label }))
  return user
}

describe('Cartelera en Inicio', () => {
  it('muestra la primera página de la API con tipo, nombre, fecha, hora, lugar, ciudad y precio', async () => {
    const { content } = await fetchFromApi()
    renderHome()

    await expectEventNames(content)
    const [first] = content
    const card = within((await findEventCards())[0])
    expect(card.getByText(MONTHS[Number(first.dateTime.slice(5, 7)) - 1])).toBeInTheDocument()
    expect(card.getByText(first.dateTime.slice(8, 10))).toBeInTheDocument()
    expect(card.getByText(`${first.dateTime.slice(11, 16)} HS`)).toBeInTheDocument()
    expect(card.getByText(new RegExp(first.venue.name))).toBeInTheDocument()
    expect(card.getByText(new RegExp(first.venue.city))).toBeInTheDocument()
    expect(card.getByText(`$${first.priceFrom.toLocaleString('es-AR')}`)).toBeInTheDocument()
  })

  it('marca como agotado al evento agotado del seeder', async () => {
    renderHome(`/?q=${encodeURIComponent(SOLD_OUT_ANCHOR)}`)

    const cards = await findEventCards()
    const jazz = cards.find((card) =>
      within(card).queryByRole('heading', { name: SOLD_OUT_ANCHOR }),
    )
    expect(jazz).toHaveTextContent('Agotado')
  })

  it('al tocar una card voy al detalle de ese evento', async () => {
    const {
      content: [first],
    } = await fetchFromApi()
    const user = userEvent.setup()
    renderHome()

    const [card] = await findEventCards()
    await user.click(within(card).getByRole('link'))

    expect(getCurrentUrl().pathname).toBe(`/eventos/${first.id}`)
  })
})

describe('Cartelera: filtros', () => {
  it('al elegir "Recitales" todas las cards son recitales, el contador coincide con la API y la URL tiene el tipo', async () => {
    const { totalElements } = await fetchFromApi({ type: 'CONCERT' })
    renderHome()
    await findEventCards()

    await chooseType('Recitales')

    await expectEveryCardToShow('Recital')
    expectResultCount(totalElements)
    expect(getCurrentUrl().searchParams.get('type')).toBe('CONCERT')
  })

  it('con "Recitales" y la ciudad Tandil todas las cards son recitales en Tandil', async () => {
    renderHome()
    await findEventCards()

    const user = await chooseType('Recitales')
    const city = screen.getByRole('combobox', { name: 'Ciudad' })
    await within(city).findByRole('option', { name: 'Tandil' })
    await user.selectOptions(city, 'Tandil')

    await expectEveryCardToShow('Recital')
    await expectEveryCardToShow('Tandil')
  })

  it('al entrar con el tipo en la URL el chip está marcado y todas las cards son de ese tipo', async () => {
    renderHome('/?type=CONCERT')

    await expectEveryCardToShow('Recital')
    const types = screen.getByRole('group', { name: 'Tipo de evento' })
    expect(within(types).getByRole('button', { name: 'Recitales' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('al elegir "Desde", "Hasta" no permite fechas anteriores', async () => {
    const user = userEvent.setup()
    renderHome()
    await findEventCards()

    await user.type(screen.getByLabelText('Desde'), '2026-12-10')

    expect(screen.getByLabelText('Hasta')).toHaveAttribute('min', '2026-12-10')
  })

  it('al entrar con parámetros inválidos veo la cartelera completa y la URL queda limpia', async () => {
    const { content } = await fetchFromApi()
    renderHome('/?type=FOO&page=-3')

    await expectEventNames(content)
    await waitFor(() => expect(getCurrentUrl().search).toBe(''))
  })
})

const LONGER_THAN_DEBOUNCE_MS = 400
const SUGGESTIONS_TIMEOUT = { timeout: 3000 }
/** Anclas del seeder que coinciden con "serr": no son las únicas (el backend busca también en participantes). */
const SERR_ANCHORS = ['Peña folklórica serrana', 'Los Serranos en vivo']

async function typeInSearchBox(text: string) {
  const user = userEvent.setup()
  await user.type(screen.getByRole('searchbox', { name: 'Buscar eventos' }), text)
  return user
}

async function findSuggestionLinks() {
  const list = await screen.findByRole('list', { name: 'Sugerencias' }, SUGGESTIONS_TIMEOUT)
  return within(list).getAllByRole('link')
}

describe('Buscador', () => {
  it('con una sola letra no muestra sugerencias', async () => {
    renderHome()

    await typeInSearchBox('s')
    await new Promise((resolve) => setTimeout(resolve, LONGER_THAN_DEBOUNCE_MS))

    expect(screen.queryByRole('list', { name: 'Sugerencias' })).not.toBeInTheDocument()
  })

  it('con "serr" sugiere hasta 5 eventos, entre ellos los del seeder que coinciden', async () => {
    renderHome()

    await typeInSearchBox('serr')
    const links = await findSuggestionLinks()

    expect(links.length).toBeLessThanOrEqual(5)
    expect(links.map((link) => link.textContent)).toEqual(
      expect.arrayContaining(SERR_ANCHORS.map((name) => expect.stringContaining(name))),
    )
  })

  it('al tocar una sugerencia voy al detalle de ese evento', async () => {
    const { content } = await fetchFromApi({ q: SERR_ANCHORS[0] })
    const peña = content.find((event) => event.name === SERR_ANCHORS[0])
    renderHome()

    const user = await typeInSearchBox('serr')
    const links = await findSuggestionLinks()
    await user.click(links.find((link) => link.textContent?.includes(SERR_ANCHORS[0]))!)

    expect(getCurrentUrl().pathname).toBe(`/eventos/${peña?.id}`)
  })

  it('con Enter la cartelera muestra lo que la API da por relevancia y la URL tiene el texto', async () => {
    const { content } = await fetchFromApi({ q: 'serr', sort: 'RELEVANCE' })
    renderHome()
    await findEventCards()

    await typeInSearchBox('serr{Enter}')

    await expectEventNames(content)
    expect(screen.getByRole('combobox', { name: 'Ordenar por' })).toHaveDisplayValue('Relevancia')
    expect(getCurrentUrl().searchParams.get('q')).toBe('serr')
  })

  it('sin texto buscado el orden no ofrece "Relevancia"', async () => {
    renderHome()
    await findEventCards()

    const sort = screen.getByRole('combobox', { name: 'Ordenar por' })
    const options = within(sort).getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(['Fecha', 'Precio'])
  })
})

describe('Cartelera: sin resultados', () => {
  it('con un texto que no coincide con nada avisa que no hay eventos y "Limpiar filtros" vuelve a la cartelera completa', async () => {
    const { content } = await fetchFromApi()
    const user = userEvent.setup()
    renderHome(`/?q=${NO_MATCH_TEXT}`)

    expect(
      await screen.findByRole('heading', { name: 'No encontramos eventos con esos filtros' }),
    ).toBeInTheDocument()
    const [clearInEmptyState] = screen.getAllByRole('button', { name: 'Limpiar filtros' }).reverse()
    await user.click(clearInEmptyState)

    await expectEventNames(content)
    expect(getCurrentUrl().search).toBe('')
  })

  it('sin filtros no ofrece "Limpiar filtros" y con un filtro activo sí', async () => {
    renderHome()
    await findEventCards()
    expect(screen.queryByRole('button', { name: 'Limpiar filtros' })).not.toBeInTheDocument()

    await chooseType('Recitales')

    expect(await screen.findByRole('button', { name: 'Limpiar filtros' })).toBeInTheDocument()
  })
})

/** Un puerto bloqueado para fetch: la llamada falla de verdad, sin mock. */
function pointApiClientToClosedPort() {
  configureApiClient({
    baseUrl: 'http://localhost:1',
    getAccessToken: () => undefined,
    onUnauthorized: () => {},
  })
}

const NETWORK_FAILURE_TIMEOUT = { timeout: 10_000 }

describe('Cartelera: cargando y error', () => {
  it('mientras carga anuncia "Cargando eventos" y no muestra cards', () => {
    renderHome()

    expect(screen.getByText('Cargando eventos')).toHaveAttribute('role', 'status')
    expect(screen.queryByRole('list', { name: 'Eventos' })).not.toBeInTheDocument()
  })

  it('si el gateway no responde avisa el error, y "Reintentar" con el gateway de vuelta muestra los eventos', async () => {
    pointApiClientToClosedPort()
    const user = userEvent.setup()
    renderHome()

    expect(
      await screen.findByRole(
        'heading',
        { name: 'No pudimos cargar los eventos' },
        NETWORK_FAILURE_TIMEOUT,
      ),
    ).toBeInTheDocument()

    setupApiClient()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect((await findEventCards()).length).toBeGreaterThan(0)
  })

  it('si fallan las ciudades el select de ciudad queda deshabilitado y dice "No disponible"', async () => {
    pointApiClientToClosedPort()
    renderHome()

    const city = screen.getByRole('combobox', { name: 'Ciudad' })
    await waitFor(() => expect(city).toBeDisabled(), NETWORK_FAILURE_TIMEOUT)
    expect(city).toHaveDisplayValue('No disponible')
  })
})

describe('Cartelera: paginación', () => {
  it('con más de una página "Siguiente" muestra la página 2 de la API y la URL la guarda', async () => {
    const { totalPages } = await fetchFromApi()
    const { content: secondPage } = await fetchFromApi({ page: 2 })
    expect(totalPages).toBeGreaterThan(1)
    const user = userEvent.setup()
    renderHome()
    await findEventCards()

    expect(screen.getByText(`Página 1 de ${totalPages}`)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    await expectEventNames(secondPage)
    expect(screen.getByText(`Página 2 de ${totalPages}`)).toBeInTheDocument()
    expect(getCurrentUrl().searchParams.get('page')).toBe('2')
  })

  it('con una sola página no muestra la paginación', async () => {
    renderHome(`/?q=${encodeURIComponent(SOLD_OUT_ANCHOR)}`)
    await findEventCards()

    expect(screen.queryByRole('navigation', { name: 'Paginación' })).not.toBeInTheDocument()
  })
})
