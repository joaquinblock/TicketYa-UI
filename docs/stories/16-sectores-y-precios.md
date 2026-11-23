# 16: Sectores y precios con disponibilidad

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Evento (épica #10 Cliente, página #14)

## Historia

Como **cliente**,
quiero **ver los sectores de un evento con su precio y cuántos lugares quedan, y seguir desde ahí a la compra**,
para **elegir dónde ir según lo que puedo pagar y no hacer la fila por un sector que ya se agotó**.

## Contexto

El detalle del evento (story 15) dice qué es y en qué estado está, pero no cuánto sale ni si quedan lugares. Esta sección es la que lleva a la compra. Consume `GET /api/availability?eventId` (US-TKT-02, `joaquinblock/TicketYa#44`, cerrada) y la capacidad de cada sector de `GET /api/events/{id}`.

## Criterios de aceptación

- **CA1: Ver los sectores**
  Dado un evento a la venta o agotado
  Cuando entro a su detalle
  Entonces veo cada sector con su nombre, "Numerado · filas A a D" (de la primera a la última fila de sus asientos) o "No numerado", su precio, una barra con la ocupación y cuántos lugares quedan: "N disponibles", "Últimos N lugares" si quedan menos de 10, o "Agotado" si no queda ninguno.
- **CA2: Seguir a la compra**
  Dado un evento a la venta con la venta abierta
  Cuando toco el botón de la sección
  Entonces, si es de alta demanda, el botón dice "Entrar a la fila" y voy a la fila virtual; si no, dice "Elegir lugares" y voy a elegir mis lugares.
  Y debajo del botón veo "Hasta N entradas por persona · Devoluciones hasta 72 horas antes del evento" (la primera parte, solo si el evento tiene un máximo).
- **CA3: Sin venta**
  Dado un evento agotado o con la venta todavía cerrada
  Cuando veo los sectores
  Entonces no hay botón para seguir.
  Y dado un evento suspendido, cancelado o que ya pasó, veo los sectores solo con su nombre y precio, sin barra ni lugares disponibles, y sin botón.
- **CA4: Disponibilidad al día**
  Dado que estoy mirando los sectores con la pestaña abierta
  Cuando pasan 30 segundos, o vuelvo a la pestaña
  Entonces la disponibilidad se vuelve a pedir y se actualiza sin recargar la página.
- **CA5: Cargando y error**
  Dado que la disponibilidad se está pidiendo
  Cuando todavía no llegó la respuesta
  Entonces veo filas de carga en lugar de los sectores.
  Y si el backend falla o no responde, veo "No pudimos cargar los sectores" con "Reintentar", que la vuelve a pedir, mientras el resto del detalle sigue a la vista.
- **CA6: La cartelera avisa la venta futura**
  Dado un evento de la cartelera cuya venta todavía no empezó
  Cuando veo su card
  Entonces veo el badge "Próximamente", junto con "Alta demanda" si lo es.
  Y la card muestra todos los badges que le corresponden ("Agotado" o "Próximamente", y "Alta demanda"), con uno solo destacado: el de la venta si lo hay, y si no "Alta demanda" (Von Restorff).

## Requisitos no funcionales

- A 360 px de ancho se usa sin scroll horizontal; en mobile la barra de ocupación pasa debajo del nombre y el precio queda a la derecha, como en `EventoMobile`.
- El botón para seguir mide 52 px de alto y ocupa el ancho de la sección: es la única acción principal de la página (ley de Hick, ley de Fitts).
- "Últimos N lugares" con menos de 10 y "Agotado" se distinguen con texto y no solo con color (Von Restorff, accesibilidad).
- Con la venta cerrada o el evento sin venta no se muestran lugares libres que no se pueden comprar (Nielsen 2 y 5).
- Si la respuesta tarda más de 400 ms, ya se están mostrando las filas de carga (umbral de Doherty).

## Fuera de alcance

- Elegir el sector o los asientos: se hace en Lugares (página de `purchase`). Acá los sectores no se seleccionan.
- La fila virtual en sí: página Fila (`queue`).
- Actualizar en tiempo real con WebSocket o SSE: alcanza con el refresco cada 30 s.

## Notas técnicas

- Feature `catalog`. Las rutas de la fila y de Lugares ya están en `src/shared/lib/routes.ts`.
- El texto de las devoluciones (72 h) es una regla del backend (ticket-service); va como constante con nombre.
- Mockup: `Evento` y `EventoMobile` (artifact de `MOCKUP.md`). **El mockup no se corrige:** sus diferencias con esta story van al tracker, en la checklist visual, y ahí manda la story. Son el botón "Elegir lugares" para un evento sin alta demanda y los sectores sin disponibilidad para suspendido, cancelado y finalizado, que el mockup no tiene.

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
