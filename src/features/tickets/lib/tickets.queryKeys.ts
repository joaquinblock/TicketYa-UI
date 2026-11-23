export const ticketsKeys = {
  all: ['tickets'] as const,
  orders: () => [...ticketsKeys.all, 'orders'] as const,
}
