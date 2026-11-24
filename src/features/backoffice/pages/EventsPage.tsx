import { AdminEventsSection } from '../components/AdminEventsSection/AdminEventsSection'
import { BackofficePageHeading } from '../components/BackofficePageHeading'
import { BackofficeSectionPage } from './BackofficeSectionPage'
import { useBackofficeOutlet } from '../components/BackofficeLayout/useBackofficeLayout'

/** Eventos: la del administrador ya está; la del organizador la hace otra persona del grupo. */
export function EventsPage() {
  const { role } = useBackofficeOutlet()

  if (role !== 'ADMIN') return <BackofficeSectionPage section="events" />

  return (
    <>
      <BackofficePageHeading section="events" />
      <AdminEventsSection />
    </>
  )
}
