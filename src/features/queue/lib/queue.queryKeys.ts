export const queueKeys = {
  all: ['queue'] as const,
  entry: (eventId: number) => [...queueKeys.all, 'entry', eventId] as const,
}
