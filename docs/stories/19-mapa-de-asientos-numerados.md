# 19: Mapa de asientos numerados

**Tipo:** Story
**Estado:** borrador
**Funcionalidad:** Asientos (épica #10 Cliente, página #18)

## Historia

Como **cliente**,
quiero **elegir mis asientos en el mapa del sector, viendo cuáles están libres**,
para **sentarme donde quiero y no perder tiempo eligiendo uno que ya está ocupado**.

## Contexto

Desde el detalle del evento (story 16), "Elegir lugares" lleva a Lugares, que hoy solo muestra el título. Esta story arma la elección de asientos. Consume `GET /api/availability?eventId` (US-TKT-03, `joaquinblock/TicketYa#45`, cerrada), que trae cada asiento con su fila, su número y si está libre, y `GET /api/events/{id}` para el encabezado.

## Criterios de aceptación

- **CA1: Ver el mapa**
  Dado un evento a la venta con un sector numerado
  Cuando entro a Lugares
  Entonces veo "Nombre del evento · fecha · lugar" arriba del título, el escenario y los asientos del sector agrupados por fila, con la letra de la fila a cada lado, y cada asiento marcado como "disponible" u "ocupado" (también en su nombre accesible: "Fila A, asiento 3, disponible").
- **CA2: Elegir el sector**
  Dado un evento con varios sectores
  Cuando entro a Lugares
  Entonces veo una pestaña por sector con su nombre y su precio, o "Agotado" (deshabilitada) si no le quedan lugares, y queda abierto el primer sector con lugares.
  Y cuando toco otra pestaña, veo ese sector y mi selección se vacía.
- **CA3: Elegir y soltar un asiento**
  Dado un asiento disponible
  Cuando lo toco
  Entonces queda "elegido".
  Y cuando lo toco de nuevo, vuelve a "disponible".
- **CA4: Un asiento ocupado no se elige**
  Dado un asiento ocupado
  Cuando intento tocarlo
  Entonces no cambia: está deshabilitado.
- **CA5: Disponibilidad al día**
  Dado que estoy eligiendo con la pestaña abierta
  Cuando pasan 30 segundos, o vuelvo a la pestaña
  Entonces la disponibilidad se vuelve a pedir y el mapa se actualiza sin recargar la página.
  Y si un asiento que había elegido ahora está ocupado, sale de mi selección y veo "El asiento F7 lo acaba de reservar otra persona. Lo sacamos de tu elección: elegí otro."
- **CA6: Cargando, error y sin venta**
  Dado que la disponibilidad se está pidiendo
  Cuando todavía no llegó la respuesta
  Entonces veo el mapa en carga en lugar de los asientos.
  Y si el backend falla o no responde, veo "No pudimos cargar los lugares" con "Reintentar", que la vuelve a pedir.
  Y si el evento no tiene lugares a la venta (404 `resource_not_found`), veo "Este evento no tiene lugares a la venta" con un link para volver al evento, sin "Reintentar".

## Requisitos no funcionales

- A 360 px de ancho, la página no tiene scroll horizontal. Si las filas no entran, el mapa se desliza dentro de su panel, como en `AsientosMobile`: los asientos no bajan de 30 px, por encima de los 24 px de WCAG 2.5.8 (ley de Fitts).
- Disponible, ocupado y elegido se distinguen por algo más que el color: el ocupado está deshabilitado y el elegido tiene borde. La leyenda "Disponible / Ocupado / Elegido" está debajo del mapa (Von Restorff, accesibilidad).
- Se abre el primer sector con lugares para que el cliente no tenga que elegir para empezar (ley de Hick).
- El encabezado con el evento, la fecha y el lugar evita tener que recordar qué se está comprando (Nielsen 6).
- Si la respuesta tarda más de 400 ms, ya se está mostrando el mapa en carga (umbral de Doherty).
- El 404 no ofrece "Reintentar", porque reintentar no lo arregla, y da una salida al evento (Nielsen 3 y 9).

## Fuera de alcance

- Reservar (`POST /api/orders`) y su 409 `seat_unavailable`: van con el botón "Reservar y pagar" en #21.
- El resumen "Tu selección", el total, el contador "N/4" y el límite por persona (`ticket_limit_exceeded`): #21.
- El panel de cantidad de un sector no numerado: #20. Acá ese sector solo aparece como pestaña.
- El aviso "Tu turno vence" de la fila virtual.
- Actualizar en tiempo real con WebSocket o SSE: alcanza con el refresco cada 30 s.

## Notas técnicas

- Feature `purchase`. La selección vive en el hook, no en el `.tsx`. La página tiene un controller (#18), porque #20 y #21 comparten la selección.
- El mapa se arma con los `seats` de `GET /api/availability`. `GET /api/venues/{venueId}/sectors/{sectorId}/seats` no sirve, porque no dice qué asientos están ocupados.
- Mockup: `Asientos` y `AsientosMobile` (artifact de `MOCKUP.md`). **El mockup no se corrige:** sus diferencias con esta story van al tracker, en la checklist visual, y ahí manda la story.

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
