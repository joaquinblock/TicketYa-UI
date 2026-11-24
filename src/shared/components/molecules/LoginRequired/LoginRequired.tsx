import { LogIn } from 'lucide-react'
import { Button } from '@/shared/components/atoms/Button'
import { useRequestLoginOnMount } from './useRequestLoginOnMount'

/** Lo que queda detrás del login en una pantalla que pide sesión, con una salida si se cierra. */
export function LoginRequired({ message }: { message: string }) {
  const { openLogin } = useRequestLoginOnMount()

  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-12 text-center">
      <LogIn aria-hidden="true" className="size-11 text-line-strong" />
      <h2 className="text-2xl font-bold text-ink">{message}</h2>
      <Button variant="accent" onClick={openLogin} className="mt-1">
        Ingresar
      </Button>
    </section>
  )
}
