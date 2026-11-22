import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { LocationProbe } from '@/test/LocationProbe'
import { renderWithProviders } from '@/test/render'
import userEvent from '@testing-library/user-event'
import { getCurrentUrl } from '@/test/LocationProbe'

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
