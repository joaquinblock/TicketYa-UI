import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { AppRouter } from './AppRouter'

describe('AppRouter', () => {
  it('marca en el header la sección en la que estoy', () => {
    renderWithProviders(<AppRouter />, { route: '/mis-entradas' })

    const mainNav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(mainNav).getByRole('link', { name: 'Mis entradas' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(mainNav).getByRole('link', { name: 'Explorar' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('muestra "Volver" y el paso actual en una pantalla de la compra', () => {
    renderWithProviders(<AppRouter />, { route: '/eventos/1/lugares' })

    expect(screen.getByRole('link', { name: 'Volver al evento' })).toHaveAttribute(
      'href',
      '/eventos/1',
    )
    const steps = screen.getByRole('navigation', { name: 'Pasos de la compra' })
    expect(within(steps).getByText('Lugares').closest('li')).toHaveAttribute('aria-current', 'step')
  })

  it('muestra la página de no encontrado con un link a Inicio en una ruta que no existe', () => {
    renderWithProviders(<AppRouter />, { route: '/no-existe' })

    expect(screen.getByRole('heading', { name: /no encontramos esta página/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir a Inicio' })).toHaveAttribute('href', '/')
  })
})
