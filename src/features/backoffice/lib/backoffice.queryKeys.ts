export const backofficeKeys = {
  all: ['backoffice'] as const,
  user: () => [...backofficeKeys.all, 'user'] as const,
  organization: (organizationId: number | null) =>
    [...backofficeKeys.all, 'organization', organizationId] as const,
  returnRequests: () => [...backofficeKeys.all, 'return-requests'] as const,
  returnRequestPage: (filter: string, page: number) =>
    [...backofficeKeys.returnRequests(), filter, page] as const,
  adminEvents: () => [...backofficeKeys.all, 'admin-events'] as const,
}
