import { Clock3 } from 'lucide-react'
import { BackofficePageHeading } from '../components/BackofficePageHeading'
import { BackofficeStateView } from '../components/BackofficeStateView'
import type { BackofficeSection } from '../types/backoffice.types'

/** Una sección del backoffice con su encabezado y todavía sin contenido. */
export function BackofficeSectionPage({ section }: { section: BackofficeSection }) {
  return (
    <>
      <BackofficePageHeading section={section} />
      <BackofficeStateView
        icon={Clock3}
        title="Próximamente"
        text="Esta sección todavía no está lista."
      />
    </>
  )
}
