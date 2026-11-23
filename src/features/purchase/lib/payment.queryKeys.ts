export const paymentKeys = {
  all: ['payment'] as const,
  order: (eventId: number, orderId?: number) =>
    [...paymentKeys.all, 'order', eventId, orderId] as const,
}
