import { screen } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

const LOCATION_TEST_ID = 'location'

/** Muestra la URL actual del `MemoryRouter`, para que un test vea adónde navegó. */
export function LocationProbe() {
  const { pathname, search } = useLocation()
  return <output data-testid={LOCATION_TEST_ID}>{`${pathname}${search}`}</output>
}

export function getCurrentUrl() {
  return new URL(screen.getByTestId(LOCATION_TEST_ID).textContent ?? '', 'http://localhost')
}
