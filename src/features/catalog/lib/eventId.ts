const POSITIVE_INTEGER = /^[1-9]\d*$/

/** El `:eventId` de la URL como id del evento, o `undefined` si no puede ser uno. */
export function parseEventId(param: string): number | undefined {
  return POSITIVE_INTEGER.test(param) ? Number(param) : undefined
}
