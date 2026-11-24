import { useLocation, useOutletContext } from 'react-router-dom'
import { BACKOFFICE_ROLE_META, BACKOFFICE_SECTION_META } from '../../constants/backoffice.constants'
import { useBackofficeSession } from '../../hooks/useBackofficeSession'
import type { BackofficeRole, BackofficeSection } from '../../types/backoffice.types'

export type BackofficeOutletContext = {
  role: BackofficeRole
  organizationName: string
}

function findSectionByPath(pathname: string): BackofficeSection | undefined {
  const sections = Object.entries(BACKOFFICE_SECTION_META) as [
    BackofficeSection,
    (typeof BACKOFFICE_SECTION_META)[BackofficeSection],
  ][]
  return sections.find(([, meta]) => meta.path === pathname)?.[0]
}

/** Arma el marco: quién entra, en qué sección está y si su rol la puede ver. */
export function useBackofficeLayout() {
  const session = useBackofficeSession()
  const { pathname } = useLocation()
  const section = findSectionByPath(pathname.replace(/\/$/, '')) ?? 'home'
  const roleSections: readonly BackofficeSection[] = session.role
    ? BACKOFFICE_ROLE_META[session.role].sections
    : []
  const isSectionAllowed = section === 'settings' || roleSections.includes(section)

  return {
    ...session,
    section,
    isSectionAllowed,
    crumbLabel: BACKOFFICE_SECTION_META[section].label,
  }
}

export function useBackofficeOutlet() {
  return useOutletContext<BackofficeOutletContext>()
}
