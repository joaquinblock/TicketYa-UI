# 17: Fila virtual para eventos de alta demanda

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Fila virtual (épica #10 Cliente, página #17)

## Historia

Como **cliente**,
quiero **entrar a la fila virtual de un evento de alta demanda, ver mi posición y pasar a elegir lugares cuando llegue mi turno**,
para **esperar ordenado sin perder mi lugar ni competir a ciegas cuando hay mucha demanda**.

## Contexto

Desde el detalle de un evento de alta demanda con la venta abierta (story #16), "Entrar a la fila" lleva a `/eventos/:eventId/fila`, que hoy muestra solo el título. `queue-service` ya expone `POST /api/queue/{eventId}/join` y `GET /api/queue/{eventId}/me` (`US-QUE-01`, `US-QUE-02`), emitiendo un `queueToken` válido hasta `enabledUntil` cuando el turno queda habilitado.

## Criterios de aceptación

- **CA1: Entrar a la fila y ver mi posición**
  Dado que soy un cliente autenticado (o con `dev-login` en desarrollo) y entro a `/eventos/:eventId/fila` para un evento de alta demanda con venta abierta
  Cuando la página llama a `POST /api/queue/{eventId}/join`
  Entonces mientras carga veo un indicador de carga
  Y si responde `WAITING`, veo el nombre del evento, mi posición en la fila (`position`), la espera estimada, las 3 reglas de la fila y el botón deshabilitado "Esperando tu turno…".

- **CA2: Actualizar el estado hasta que llega el turno (`ENABLED`)**
  Dado que estoy esperando en la fila (`WAITING`)
  Cuando se consulta periódicamente `GET /api/queue/{eventId}/me` (y al recibir `ENABLED`)
  Entonces veo `00`, "¡Es tu turno!" y la hora límite (`enabledUntil` en hora local, ej. `21:42`) para reservar
  Y el `queueToken` junto con `enabledUntil` quedan guardados en `sessionStorage` para ese `eventId`, y se habilita el botón "Ya podés elegir tus lugares" hacia `/eventos/:eventId/lugares`.

- **CA3: Ventana vencida (`EXPIRED`) y volver a la fila**
  Dado que el estado recibido es `EXPIRED` o la hora actual supera `enabledUntil`
  Cuando vence la ventana
  Entonces veo `--:--`, "Se venció tu ventana", se limpia el turno guardado en `sessionStorage` para ese evento y aparece el botón "Volver a hacer la fila", que al tocarlo vuelve a llamar a `POST /api/queue/{eventId}/join`.

- **CA4: Evento no apto para fila o inexistente**
  Dado que entro a `/eventos/:eventId/fila` para un evento que no existe (`404 event_not_found`), no es de alta demanda (`409 event_not_high_demand`) o todavía no abrió su venta (`409 sale_not_started`)
  Cuando el backend responde con ese error
  Entonces veo un mensaje claro en español explicando el motivo y un link para volver al evento (`/eventos/:eventId`) o a explorar (`/`), sin botón "Reintentar".

- **CA5: Falla de red o servidor**
  Dado que falla la conexión o el servidor responde `503` al entrar o consultar la fila
  Cuando ocurre el error inicial
  Entonces veo un mensaje entendible en español con el botón "Reintentar" que vuelve a intentar el ingreso a la fila.

## Requisitos no funcionales

- A 360 px de ancho la tarjeta de la fila se usa sin scroll horizontal ni controles cortados, siguiendo `FilaMobile`.
- La posición de espera usa `aria-live="polite"` para anunciar avances sin interrumpir al lector de pantalla.
- El botón de avance a lugares permanece deshabilitado mientras el estado es `WAITING` (`aria-disabled="true"`).

## Fuera de alcance

- Leer y enviar `X-Queue-Token` en `POST /api/orders` desde Lugares (issue `#21`).
- WebSockets / SSE para la fila (se usa polling periódico con `GET /api/queue/{eventId}/me`).
- Botones de prototipo del mockup ("Prototipo: llegó mi turno", "Prototipo: se venció la ventana").

## Notas técnicas

- Feature: `queue` (`QueuePage`, ruta `/eventos/:eventId/fila`).
- Almacenamiento del turno: `sessionStorage` bajo una clave por `eventId` (ej. `ticketya.queueToken.<eventId>`), compartido luego con `purchase` (#21).
- Mockup: `Fila` y `FilaMobile` (`MOCKUP.md` / `project/Fila.dc.html`).

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
