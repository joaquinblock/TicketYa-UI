export const backofficeKeys = {
  all: ['backoffice'] as const,
  user: () => [...backofficeKeys.all, 'user'] as const,
  organization: (organizationId: number | null) =>
    [...backofficeKeys.all, 'organization', organizationId] as const,
}
