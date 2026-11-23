# 21: Ver mi selección y reservar los lugares

**Tipo:** Story
**Estado:** borrador
**Funcionalidad:** Asientos (épica #10 Cliente, página #18)

## Historia

Como **cliente**,
quiero **ver lo que elegí con su precio y el total, y reservarlo con un toque**,
para **asegurarme los lugares mientras pago, sin que otra persona me los gane y sabiendo cuánto voy a pagar**.

## Contexto

En Lugares el cliente ya elige asientos (#19) o una cantidad en un sector no numerado (#20), pero no ve un resumen ni puede reservar: la compra se corta ahí. Esta story suma el panel "Tu selección" del mockup y el botón "Reservar y pagar", que crea la orden y lleva a Pago (#23), donde sigue el contador y "Abandonar la reserva". Consume `POST /api/orders` (US-TKT-03 `joaquinblock/TicketYa#45`, US-TKT-04 `#46`, US-TKT-05 `#47` y US-TKT-06 `#48`, cerradas).

## Criterios de aceptación

- **CA1: Ver mi selección y el total**
  Dado que elegí asientos o una cantidad en Lugares
  Entonces "Tu selección" muestra una línea por asiento ("Platea baja · fila F, asiento 7" y su precio), o una sola línea para el sector no numerado ("2 × Campo" y el precio por la cantidad), el total y el contador "N/M" (M es el límite por persona; sin límite, solo "N").
  Y sin nada elegido, "Reservar y pagar" está deshabilitado.
- **CA2: Reservar y seguir al pago**
  Dado que elegí lugares
  Cuando toco "Reservar y pagar"
  Entonces el botón se deshabilita y dice "Reservando…" mientras espera,
  Y cuando la reserva se crea, voy a Pago (`/eventos/:eventId/pago?orderId=<id>`).
- **CA3: Alguien me ganó un lugar**
  Dado que elegí lugares que otra persona reservó antes (409 `seat_unavailable` o `sector_sold_out`)
  Cuando toco "Reservar y pagar"
  Entonces sigo en Lugares, la disponibilidad se vuelve a pedir y veo el mismo aviso que con un refresco: el asiento sale de mi selección ("El asiento F7 lo acaba de reservar otra persona", #19) o la cantidad baja a los lugares libres ("Quedan N lugares en <sector>…", #20).
- **CA4: Supero el límite por persona**
  Dado que ya tengo entradas de este evento y lo que elijo supera el límite (409 `ticket_limit_exceeded`)
  Cuando toco "Reservar y pagar"
  Entonces sigo en Lugares, con mi selección, y veo "Podés tener hasta N entradas para este evento, contando las que ya compraste.", con N el límite del evento.
- **CA5: Sin sesión**
  Dado que no inicié sesión (401)
  Cuando toco "Reservar y pagar"
  Entonces sigo en Lugares, con mi selección, y veo "Iniciá sesión para reservar tus lugares." con el link "Iniciar sesión (falta login)".
- **CA6: Falla el servidor o la red**
  Dado que el pedido falla por la red o con 503
  Cuando toco "Reservar y pagar"
  Entonces veo "No pudimos reservar tus lugares." con "Reintentar", y reintentar no crea una segunda reserva (manda la misma clave de idempotencia).

## Requisitos no funcionales

- A 360 px de ancho, "Tu selección" va debajo del mapa o del panel de cantidad y la página no tiene scroll horizontal (`AsientosMobile`).
- "Reservar y pagar" es la única acción destacada de la página y mide 52 px de alto (Fitts, Von Restorff).
- Sin nada elegido el botón se deshabilita, en vez de explicar después que falta elegir (Nielsen 5).
- Mientras reserva, el botón muestra que está trabajando y no se puede tocar dos veces (Doherty, Nielsen 1).
- Cada aviso de error es un `role="alert"` que dice qué pasó y qué hacer, sin códigos (Nielsen 2 y 9).
- Debajo del botón, "Guardamos estos lugares 10 minutos mientras pagás.", para que el cliente sepa qué pasa al reservar (Nielsen 10).

## Fuera de alcance

- Abandonar la reserva: está en Pago (#23, CA6), donde la reserva ya existe. El mockup de Lugares no tiene ese botón.
- El login: es #8. El link de CA5 queda marcado "(falta login)" hasta entonces.
- Eventos de alta demanda (`X-Queue-Token`, 403 `invalid_queue_token`): se llega desde la fila virtual (#17).
- El aviso "Máximo 4 entradas por persona" del mockup al tocar de más: en #19 y #20 lo que no se puede elegir ya está deshabilitado.
- El botón "Prototipo: otra persona reservó F7" del mockup.

## Notas técnicas

- Feature `purchase`. Se construye sobre la rama de #20 (`feat/20-lugares-en-sector-no-numerado`), que todavía no está en `main`: usa su cantidad y su aviso.
- Asientos: `{ eventId, idempotencyKey, seatIds }`. No numerado: `{ eventId, idempotencyKey, eventSectorId, quantity }`. La clave se genera por intento y se conserva para "Reintentar".
- Mockup: `Asientos` y `AsientosMobile` (artifact de `MOCKUP.md`), panel "Tu selección".

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
