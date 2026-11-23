import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReturnRequestDialog } from './ReturnRequestDialog'

describe('ReturnRequestDialog', () => {
  it('muestra evento, ubicación y monto; "No, volver" cierra sin confirmar; deshabilita confirmación si está pendiente', async () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    const user = userEvent.setup()

    const { rerender } = render(
      <ReturnRequestDialog
        eventName="Los Serranos en vivo"
        ticketLocation="Platea · Fila A, asiento 1"
        priceLabel="$70.000"
        isPending={false}
        errorMessage={null}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    expect(
      screen.getByRole('dialog', { name: '¿Pedir la devolución?' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Los Serranos en vivo · Platea · Fila A, asiento 1'),
    ).toBeInTheDocument()
    expect(screen.getByText(/te reintegramos \$70\.000 al medio de pago original/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'No, volver' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Sí, pedir devolución' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    rerender(
      <ReturnRequestDialog
        eventName="Los Serranos en vivo"
        ticketLocation="Platea · Fila A, asiento 1"
        priceLabel="$70.000"
        isPending
        errorMessage={null}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.getByRole('button', { name: 'Sí, pedir devolución' })).toBeDisabled()
  })
})
