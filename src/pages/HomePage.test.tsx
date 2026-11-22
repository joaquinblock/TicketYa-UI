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
