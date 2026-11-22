import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import userEvent from '@testing-library/user-event'
import { getCurrentUrl } from '@/test/LocationProbe'
import { waitFor } from '@testing-library/react'

function renderHome(route = '/') {
  return renderWithProviders(
    <>
      <AppRouter />
      <LocationProbe />
    </>,
    { route },
  )
}

async function findEventCards() {
  const list = await screen.findByRole('list', { name: 'Eventos' })
  return within(list).getAllByRole('listitem')
}

describe('Cartelera en Inicio', () => {
  it('muestra los 6 eventos con tipo, nombre, fecha, lugar, ciudad y precio, y marca el agotado', async () => {
    renderHome()

    const cards = await findEventCards()

    expect(cards).toHaveLength(6)
    const jazz = within(cards[0])
    expect(jazz.getByRole('heading', { name: 'Jazz en el puerto' })).toBeInTheDocument()
    expect(jazz.getByText('Agotado')).toBeInTheDocument()
    expect(jazz.getByText('Recital')).toBeInTheDocument()
    expect(jazz.getByText('22:00 HS')).toBeInTheDocument()
    expect(jazz.getByText('DIC')).toBeInTheDocument()
    expect(jazz.getByText('02')).toBeInTheDocument()
    expect(jazz.getByText(/Sala del Puerto/)).toBeInTheDocument()
    expect(jazz.getByText(/Mar del Plata/)).toBeInTheDocument()
    expect(jazz.getByText('$18.000')).toBeInTheDocument()
  })
})

describe('Cartelera: ir al detalle', () => {
  it('al tocar una card voy al detalle de ese evento', async () => {
    const user = userEvent.setup()
    renderHome()

    const [jazz] = await findEventCards()
    await user.click(within(jazz).getByRole('link'))

    expect(getCurrentUrl().pathname).toBe('/eventos/6')
  })
})

async function expectEventNames(names: string[]) {
  await waitFor(async () => {
    const cards = await findEventCards()
    expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual(names)
  })
}

const CONCERTS = ['Jazz en el puerto', 'Peña folklórica serrana', 'Los Serranos en vivo']

describe('Cartelera: filtrar por tipo', () => {
  it('al elegir "Recitales" veo los 3 recitales, el contador dice 03 y la URL tiene el tipo', async () => {
    const user = userEvent.setup()
    renderHome()
    await findEventCards()

    const types = screen.getByRole('group', { name: 'Tipo de evento' })
    await user.click(within(types).getByRole('button', { name: 'Recitales' }))

    await expectEventNames(CONCERTS)
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(getCurrentUrl().searchParams.get('type')).toBe('CONCERT')
  })
})

describe('Cartelera: combinar filtros', () => {
  it('con "Recitales" y la ciudad Tandil veo solo la peña folklórica', async () => {
    const user = userEvent.setup()
    renderHome()
    await findEventCards()

    const types = screen.getByRole('group', { name: 'Tipo de evento' })
    await user.click(within(types).getByRole('button', { name: 'Recitales' }))
    const city = screen.getByRole('combobox', { name: 'Ciudad' })
    await within(city).findByRole('option', { name: 'Tandil' })
    await user.selectOptions(city, 'Tandil')

    await expectEventNames(['Peña folklórica serrana'])
  })
})

describe('Cartelera: filtros desde la URL', () => {
  it('al entrar con el tipo en la URL el chip está marcado y veo los recitales', async () => {
    renderHome('/?type=CONCERT')

    await expectEventNames(CONCERTS)
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
    renderHome('/?type=FOO&page=-3')

    expect(await findEventCards()).toHaveLength(6)
    await waitFor(() => expect(getCurrentUrl().search).toBe(''))
  })
})

const LONGER_THAN_DEBOUNCE_MS = 400

describe('Buscador: sugerencias', () => {
  it('con una sola letra no muestra sugerencias', async () => {
    const user = userEvent.setup()
    renderHome()

    await user.type(screen.getByRole('searchbox', { name: 'Buscar eventos' }), 's')
    await new Promise((resolve) => setTimeout(resolve, LONGER_THAN_DEBOUNCE_MS))

    expect(screen.queryByRole('list', { name: 'Sugerencias' })).not.toBeInTheDocument()
  })
})

const SUGGESTIONS_TIMEOUT = { timeout: 3000 }

async function typeInSearchBox(text: string) {
  const user = userEvent.setup()
  await user.type(screen.getByRole('searchbox', { name: 'Buscar eventos' }), text)
  return user
}

async function findSuggestionLinks() {
  const list = await screen.findByRole('list', { name: 'Sugerencias' }, SUGGESTIONS_TIMEOUT)
  return within(list).getAllByRole('link')
}

describe('Buscador: sugerencias que coinciden', () => {
  it('con "serr" sugiere hasta 5 eventos, entre ellos la peña y Los Serranos', async () => {
    renderHome()

    await typeInSearchBox('serr')
    const links = await findSuggestionLinks()

    expect(links.length).toBeLessThanOrEqual(5)
    const names = links.map((link) => link.textContent)
    expect(names).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Peña folklórica serrana'),
        expect.stringContaining('Los Serranos en vivo'),
      ]),
    )
  })

  it('al tocar una sugerencia voy al detalle de ese evento', async () => {
    renderHome()

    const user = await typeInSearchBox('serr')
    const links = await findSuggestionLinks()
    const peña = links.find((link) => link.textContent?.includes('Peña folklórica serrana'))
    await user.click(peña!)

    expect(getCurrentUrl().pathname).toBe('/eventos/11')
  })
})
