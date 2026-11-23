/** El evento y su disponibilidad los piden catalog y purchase: con la misma key comparten el cache. */
export const eventKeys = {
  all: ['event'] as const,
  detail: (id: number | undefined) => [...eventKeys.all, 'detail', id] as const,
  availability: (eventId: number | undefined) =>
    [...eventKeys.all, 'availability', eventId] as const,
}
