import { useBackofficeOutlet } from './BackofficeLayout/useBackofficeLayout'
import { BACKOFFICE_ROLE_META, BACKOFFICE_SECTION_META } from '../constants/backoffice.constants'
import type { BackofficeSection } from '../types/backoffice.types'

/** `.bo-heading-row` del diseño: kicker del rol, título con punto y la bajada de la sección. */
export function BackofficePageHeading({ section }: { section: BackofficeSection }) {
  const { role } = useBackofficeOutlet()
  const { label, description } = BACKOFFICE_SECTION_META[section]

  return (
    <div className="mb-4.5 flex items-start justify-between gap-5 sm:mb-6.25 sm:items-end">
      <div>
        <div className="text-[9px] font-bold tracking-[1.05px] text-backoffice-faint">
          {BACKOFFICE_ROLE_META[role].kicker}
        </div>
        <h1 className="mt-2 mb-1.5 font-display text-[25px] leading-[1.2] font-bold tracking-[-1px] sm:text-[30px]">
          {label}
          <span className="text-backoffice-title-dot">.</span>
        </h1>
        <p className="m-0 max-w-57.5 text-[10px] leading-normal text-[#716e66] sm:max-w-none sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  )
}
