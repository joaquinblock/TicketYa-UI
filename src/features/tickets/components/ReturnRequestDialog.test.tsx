import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReturnRequestDialog } from './ReturnRequestDialog'
import { getReturnRequestErrorMessage } from '../lib/ticketFormat'
import { ApiError } from '@/shared/lib/http/ApiError'

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

  it('muestra el mensaje de error en español con role="alert" y mantiene el botón habilitado al fallar', () => {
    const refundNotAllowed = new ApiError({
      error: 'refund_not_allowed',
      message: 'No admite devolución',
      status: 409,
    })
    const alreadyPending = new ApiError({
      error: 'return_request_already_pending',
      message: 'Ya pendiente',
      status: 409,
    })

    const { rerender } = render(
      <ReturnRequestDialog
        eventName="Los Serranos en vivo"
        ticketLocation="Platea · Fila A, asiento 1"
        priceLabel="$70.000"
        isPending={false}
        errorMessage={getReturnRequestErrorMessage(refundNotAllowed)}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Esta entrada ya no admite devolución.')
    expect(screen.getByRole('button', { name: 'Sí, pedir devolución' })).toBeEnabled()

    rerender(
      <ReturnRequestDialog
        eventName="Los Serranos en vivo"
        ticketLocation="Platea · Fila A, asiento 1"
        priceLabel="$70.000"
        isPending={false}
        errorMessage={getReturnRequestErrorMessage(alreadyPending)}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Ya hay una solicitud de devolución pendiente para esta entrada.',
    )

    rerender(
      <ReturnRequestDialog
        eventName="Los Serranos en vivo"
        ticketLocation="Platea · Fila A, asiento 1"
        priceLabel="$70.000"
        isPending={false}
        errorMessage={getReturnRequestErrorMessage(new Error('Network error'))}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'No pudimos enviar el pedido de devolución. Intentá de nuevo.',
    )
  })
})
