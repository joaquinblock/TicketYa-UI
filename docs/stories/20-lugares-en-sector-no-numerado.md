# 20: Lugares en un sector no numerado

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Asientos (épica #10 Cliente, página #18)

## Historia

Como **cliente**,
quiero **elegir cuántas entradas llevo en un sector sin numerar, como el Campo**,
para **ir con mi grupo sin tener que buscar asientos que ese sector no tiene**.

## Contexto

En Lugares (story 19), el sector no numerado aparece solo como pestaña: al abrirlo no hay nada para elegir, así que el cliente no puede comprar en Campo. Esta story suma el panel de cantidad del mockup. Consume `GET /api/availability?eventId` (`availablePlaces` del sector) y `GET /api/events/{id}` (la `capacity` del sector y `maxTicketsPerCustomer`), que la página ya pide. Reservar con esa cantidad (`POST /api/orders`, US-TKT-04, `joaquinblock/TicketYa#46`, cerrada) va en #21.

## Criterios de aceptación

- **CA1: Ver el panel de cantidad**
  Dado un evento a la venta con un sector no numerado con lugares
  Cuando abro su pestaña en Lugares
  Entonces veo el escenario, el bloque con el nombre del sector, el selector de cantidad en 1 y "Sin numerar · X lugares libres de Y", con los lugares libres y la capacidad del sector.
- **CA2: Sumar y restar**
  Dado el panel de cantidad
  Cuando toco "Una más"
  Entonces la cantidad sube de a una.
  Y cuando toco "Una menos", baja de a una.
- **CA3: Topes**
  Dado el panel de cantidad
  Entonces "Una menos" está deshabilitado en 1, "Una más" está deshabilitado al llegar al mínimo entre el límite por persona y los lugares libres, y veo "Hasta N por persona".
  Por ejemplo, en Campo del _Festival de la Costanera_, que tiene un solo lugar libre, "Una más" está deshabilitado desde el principio.
- **CA4: Cambiar de pestaña**
  Dado que elegí una cantidad mayor a 1
  Cuando abro otro sector y vuelvo al no numerado
  Entonces la cantidad vuelve a 1, igual que la selección de asientos en #19.
- **CA5: Quedan menos lugares que los elegidos**
  Dado que elegí una cantidad
  Cuando la disponibilidad se vuelve a pedir (cada 30 s o al volver a la pestaña, como en #19) y quedan menos lugares libres que mi cantidad
  Entonces la cantidad baja a los lugares libres y veo "Quedan N lugares en <sector>: bajamos tu cantidad a N".

## Requisitos no funcionales

- A 360 px de ancho, la página no tiene scroll horizontal.
- Los botones "−" y "+" miden 44 × 44 px como mínimo (ley de Fitts, WCAG 2.5.5).
- La cantidad arranca en 1, para que el cliente que va solo no tenga que tocar nada (ley de Hick, Tesler).
- Lo imposible se deshabilita en vez de explicarse después: "+" llega solo hasta lo que se puede comprar (Nielsen 5).
- La cantidad se anuncia a los lectores de pantalla al cambiar (`aria-live`), y el aviso de CA5 es un `role="alert"` (Nielsen 1).
- Cargando, error con "Reintentar" y "sin lugares a la venta" son los estados de la página que ya resuelve #19: no se duplican.

## Fuera de alcance

- Reservar con la cantidad (`POST /api/orders`) y su 409 `sector_sold_out`: van con el botón "Reservar y pagar" en #21, junto con el 409 `seat_unavailable`.
- El resumen "Tu selección", el total, el contador "N/4" y el `ticket_limit_exceeded` del backend (compras anteriores del cliente): #21.
- Un sector no numerado agotado: ya se ve como pestaña "Agotado" deshabilitada (#19).

## Notas técnicas

- Feature `purchase`. La cantidad vive en un hook que coordina el controller de la página, como la selección de asientos.
- El rótulo del bloque es el nombre del sector, no "CAMPO · DE PIE" fijo: un sector no numerado puede no ser de pie.
- Mockup: `Asientos` y `AsientosMobile` (artifact de `MOCKUP.md`), bloque `general`. **El mockup no se corrige:** sus diferencias con esta story van al tracker, en la checklist visual, y ahí manda la story.

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
