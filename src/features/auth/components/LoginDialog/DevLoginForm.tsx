import { type FormEvent, useId } from 'react'
import { Button } from '@/shared/components/atoms/Button'
import { Select } from '@/shared/components/atoms/Select'
import { DEFAULT_DEV_LOGIN_USER_ID, DEV_LOGIN_USERS } from '../../constants/auth.constants'

type DevLoginFormProps = {
  isLoggingIn: boolean
  onLogin: (userId: number) => void
}

const USER_FIELD = 'userId'

/** Solo en desarrollo: entra con un usuario del seeder, sin Google. Va debajo y en segundo plano. */
export function DevLoginForm({ isLoggingIn, onLogin }: DevLoginFormProps) {
  const selectId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onLogin(Number(new FormData(event.currentTarget).get(USER_FIELD)))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-t border-line pt-3.5 text-left"
    >
      <label htmlFor={selectId} className="text-label font-semibold text-muted">
        Usuario de prueba (solo en desarrollo)
      </label>
      <Select
        id={selectId}
        name={USER_FIELD}
        defaultValue={DEFAULT_DEV_LOGIN_USER_ID}
        disabled={isLoggingIn}
      >
        {DEV_LOGIN_USERS.map(({ userId, label }) => (
          <option key={userId} value={userId}>
            {label}
          </option>
        ))}
      </Select>
      <Button type="submit" variant="ghost" disabled={isLoggingIn}>
        {isLoggingIn ? 'Ingresando…' : 'Entrar como usuario de prueba'}
      </Button>
    </form>
  )
}
