import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('en la página 1 de 2 deshabilita "Anterior" y "Siguiente" pasa a la página 2', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={2} onPageChange={onPageChange} />)

    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('en la última página deshabilita "Siguiente"', () => {
    render(<Pagination page={2} totalPages={2} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeEnabled()
  })
})
