import { AdminEventsSection } from '../components/AdminEventsSection/AdminEventsSection'
import { BackofficePageHeading } from '../components/BackofficePageHeading'
import { OrganizerEventsSection } from '../components/OrganizerEventsSection/OrganizerEventsSection'
import { useBackofficeOutlet } from '../components/BackofficeLayout/useBackofficeLayout'

/** Eventos: la misma sección del diseño, con la lista y las acciones de cada rol. */
export function EventsPage() {
  const { role } = useBackofficeOutlet()

  return (
    <>
      <BackofficePageHeading section="events" />
      {role === 'ADMIN' ? <AdminEventsSection /> : <OrganizerEventsSection />}
    </>
  )
}
