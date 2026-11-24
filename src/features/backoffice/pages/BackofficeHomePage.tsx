import { useBackofficeOutlet } from '../components/BackofficeLayout/useBackofficeLayout'

const WELCOME_BY_ROLE = {
  ADMIN: 'Welcome Admin',
  ORGANIZER: 'Welcome Organizador',
} as const

/** Inicio provisorio: solo distingue en qué backoffice entraste, hasta que se haga cada inicio. */
export function BackofficeHomePage() {
  const { role } = useBackofficeOutlet()

  return (
    <h1 className="font-display text-[25px] leading-[1.2] font-bold tracking-[-1px] sm:text-[30px]">
      {WELCOME_BY_ROLE[role]}
      <span className="text-backoffice-title-dot">.</span>
    </h1>
  )
}
