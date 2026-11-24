import { BackofficePageHeading } from '../components/BackofficePageHeading'
import { RefundsSection } from '../components/RefundsSection/RefundsSection'

export function RefundsPage() {
  return (
    <>
      <BackofficePageHeading section="refunds" />
      <RefundsSection />
    </>
  )
}
