# 15: Detalle del evento y participantes

**Tipo:** Story
**Estado:** terminado
**Funcionalidad:** Evento (épica #10 Cliente, página #14)

## Historia

Como **cliente**,
quiero **ver los datos de un evento, quiénes participan y en qué estado está**,
para **decidir si voy antes de meterme en la fila o elegir lugares, y no enterarme recién al pagar de que está agotado, suspendido o ya pasó**.

## Contexto

Desde la cartelera (story 12) cada card lleva al detalle, pero hoy esa página es solo un título dentro de `PurchaseLayout`. Consume `GET /api/events/{id}` (US-EVT-04, `joaquinblock/TicketYa#43`, cerrada). Los sectores y el botón para seguir son de la story 16.

## Criterios de aceptación

- **CA1: Ver el detalle**
  Dado un evento que existe y no es un borrador
  Cuando entro a su detalle
  Entonces veo su tipo, nombre, descripción, fecha y hora, lugar y ciudad; en "El evento", los participantes, la fecha de apertura de la venta si tiene, y la dirección con un link "Ver en el mapa" que abre Google Maps en sus coordenadas en otra pestaña. Si es de alta demanda, lo dice ("Alta demanda · fila virtual").
- **CA2: Estado del evento**
  Dado un evento en cualquier estado
  Cuando veo su detalle
  Entonces veo un aviso con el estado en palabras, nunca el código del backend:
  - a la venta y de alta demanda: "Alta demanda · fila virtual", que explica que se entra a la fila por tandas;
  - a la venta, con la apertura todavía en el futuro: "La venta todavía no empezó", con el día y la hora de apertura;
  - agotado: badge "Agotado" y aviso "Entradas agotadas";
  - suspendido: badge "Suspendido" y aviso "Evento suspendido";
  - cancelado: badge "Cancelado" y aviso "Evento cancelado";
  - ya pasó: badge "Finalizado" y aviso "Este evento ya pasó".
    Un evento a la venta, sin alta demanda y con la venta abierta no muestra aviso.
- **CA3: El evento no existe**
  Dado un id que no corresponde a ningún evento visible (404 `event_not_found`, un borrador, o un id que no es un número)
  Cuando entro a su detalle
  Entonces veo "No encontramos este evento" y un link "Volver a explorar" que lleva a Inicio.
- **CA4: Cargando y error**
  Dado que el evento se está pidiendo
  Cuando todavía no llegó la respuesta
  Entonces veo un esqueleto de carga en lugar de los datos.
  Y si el backend falla o no responde, veo "No pudimos cargar el evento" con "Reintentar", que lo vuelve a pedir.

## Requisitos no funcionales

- A 360 px de ancho se usa sin scroll horizontal.
- Todo objetivo táctil (links, "Reintentar") mide 44 × 44 px o más (ley de Fitts).
- Si la respuesta tarda más de 400 ms, ya se está mostrando el esqueleto (umbral de Doherty).
- El estado se comunica con texto además del color del aviso y del badge (Von Restorff, accesibilidad), y siempre en lenguaje del usuario (Nielsen 2: `SOLD_OUT` → "Agotado").
- Hay un solo aviso por evento: una sola cosa destacada en la sección (atención selectiva).

## Fuera de alcance

- **Nombre del organizador** ("Organiza Producciones del Sur" en el mockup): el backend solo devuelve `organizationId`. Queda para un próximo ticket, cuando el backend libere la US que lista las organizaciones (anotado en `docs/TODO.md`).
- **Imagen del evento en el hero:** el backend todavía no tiene `imageUrl`. Queda para un próximo ticket, cuando se libere esa US (anotado en `docs/TODO.md`). Mientras tanto, el hero usa un bloque de color con el tipo, como la card de la cartelera.
- Mapa embebido: alcanza con el link a Google Maps (navaja de Ockham, ley de Jakob).
- Sectores, precios, disponibilidad y el botón para seguir: story 16.

## Notas técnicas

- Feature `catalog`; la página `src/features/catalog/pages/EventPage` ya existe dentro de `PurchaseLayout`.
- Mockup: `Evento` y `EventoMobile` (artifact de `MOCKUP.md`). **El mockup no se corrige:** sus diferencias con esta story van al tracker, en la checklist visual, y ahí manda la story. Son el estado "Este evento ya pasó" (`FINISHED`), que el mockup no tiene; el link "Ver en el mapa" en lugar del mapa decorativo; y el organizador, que no se muestra.

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
