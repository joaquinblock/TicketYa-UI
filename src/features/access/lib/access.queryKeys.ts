export const accessKeys = {
  all: ['access'] as const,
  user: () => [...accessKeys.all, 'user'] as const,
  assignments: () => [...accessKeys.all, 'assignments'] as const,
  event: (eventId: number) => [...accessKeys.all, 'event', eventId] as const,
}
