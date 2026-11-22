import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '@/app/AppRouter'
import { renderWithProviders } from '@/test/render'

describe('MobileNav', () => {
  it('despliega la navegación al tocar la hamburguesa', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AppRouter />)

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }))

    const menu = screen.getByRole('navigation', { name: 'Menú' })
    expect(menu).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('se cierra y navega al elegir una sección', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AppRouter />)

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }))
    const menu = screen.getByRole('navigation', { name: 'Menú' })
    await user.click(within(menu).getByRole('link', { name: 'Mis entradas' }))

    expect(screen.queryByRole('navigation', { name: 'Menú' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /mis entradas/i })).toBeInTheDocument()
  })

  it('se cierra con Escape', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AppRouter />)

    await user.click(screen.getByRole('button', { name: 'Abrir menú' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('navigation', { name: 'Menú' })).not.toBeInTheDocument()
  })
})
