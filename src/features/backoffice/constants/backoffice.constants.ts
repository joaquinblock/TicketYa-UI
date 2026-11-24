import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  LayoutDashboard,
  MapPin,
  Plus,
  ScanLine,
  Settings2,
  Shield,
  Users,
  Wallet,
} from 'lucide-react'
import { ROUTES } from '@/shared/lib/routes'
import type { SessionRole } from '@/shared/lib/session'
import type {
  BackofficeRole,
  BackofficeRoleMeta,
  BackofficeSection,
  BackofficeSectionMeta,
} from '../types/backoffice.types'

export const BACKOFFICE_ROLES = ['ADMIN', 'ORGANIZER'] as const satisfies readonly SessionRole[]

const DEFAULT_SECTION_DESCRIPTION = 'Administrá la información de TicketYa.'

/** Cada sección del diseño, con su ícono y la bajada del encabezado (`ticketya-backoffice.tsx`). */
export const BACKOFFICE_SECTION_META = {
  home: { label: 'Inicio', path: ROUTES.backoffice.home, icon: LayoutDashboard, description: '' },
  refunds: {
    label: 'Devoluciones',
    path: ROUTES.backoffice.refunds,
    icon: Wallet,
    description: 'Revisá cada solicitud antes de resolverla.',
  },
  events: {
    label: 'Eventos',
    path: ROUTES.backoffice.events,
    icon: CalendarDays,
    description: 'Gestioná tus eventos y seguí cada venta.',
  },
  createEvent: {
    label: 'Crear evento',
    path: ROUTES.backoffice.createEvent,
    icon: Plus,
    description: DEFAULT_SECTION_DESCRIPTION,
  },
  report: {
    label: 'Reporte',
    path: ROUTES.backoffice.report,
    icon: ChartNoAxesColumnIncreasing,
    description: 'Ventas, ocupación y recaudación al detalle.',
  },
  accessStaff: {
    label: 'Personal de acceso',
    path: ROUTES.backoffice.accessStaff,
    icon: ScanLine,
    description: DEFAULT_SECTION_DESCRIPTION,
  },
  venues: {
    label: 'Lugares',
    path: ROUTES.backoffice.venues,
    icon: MapPin,
    description: DEFAULT_SECTION_DESCRIPTION,
  },
  participants: {
    label: 'Participantes',
    path: ROUTES.backoffice.participants,
    icon: Users,
    description: DEFAULT_SECTION_DESCRIPTION,
  },
  usersAndOrganizations: {
    label: 'Usuarios y organizaciones',
    path: ROUTES.backoffice.usersAndOrganizations,
    icon: Shield,
    description: DEFAULT_SECTION_DESCRIPTION,
  },
  settings: {
    label: 'Configuración',
    path: ROUTES.backoffice.settings,
    icon: Settings2,
    description: DEFAULT_SECTION_DESCRIPTION,
  },
} as const satisfies Record<BackofficeSection, BackofficeSectionMeta>

/** La navegación de cada rol, en el orden del sidebar del diseño (`navByRole`). */
export const BACKOFFICE_ROLE_META = {
  ORGANIZER: {
    label: 'Organizador',
    kicker: 'TU ESPACIO DE TRABAJO',
    homeDescription: 'Tus eventos, tu gente y todo lo que está pasando.',
    sections: ['home', 'events', 'createEvent', 'report', 'accessStaff', 'participants'],
  },
  ADMIN: {
    label: 'Administrador',
    kicker: 'CENTRO DE OPERACIONES',
    homeTitle: 'Panel de administración',
    homeDescription: 'Todo lo que pasa en TicketYa, en un solo lugar.',
    sections: ['home', 'refunds', 'events', 'venues', 'participants', 'usersAndOrganizations'],
  },
} as const satisfies Record<BackofficeRole, BackofficeRoleMeta>

/** El administrador no pertenece a una organización: el sidebar muestra esto en su lugar. */
export const ADMIN_ORGANIZATION_NAME = 'Administración TicketYa'
