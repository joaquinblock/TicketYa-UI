# 23: Pagar la reserva y recibir las entradas

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Compra (épica #10 Cliente, página #22)

## Historia

Como **cliente**,
quiero **pagar mi reserva eligiendo un medio de pago, reintentar si falla o abandonarla si cambio de idea**,
para **confirmar mis entradas antes de que venza el tiempo sin perder mis lugares ni pagar dos veces**.

## Contexto

Después de reservar sus lugares en Lugares, el cliente llega a `/eventos/:eventId/pago` con su orden en `PENDING` y 10 minutos para completar el pago. Hoy la página muestra solo el título. Consume `GET /api/orders/{id}` (y `GET /api/orders` como respaldo si no llega `orderId` en la URL), `POST /api/orders/{id}/pay` (`US-TKT-09`, `US-TKT-10`, `US-TKT-11`) y `POST /api/orders/{id}/cancel` (`US-TKT-28`).

## Criterios de aceptación

- **CA1: Ver la reserva activa y el tiempo restante**
  Dado que tengo una orden `PENDING` para el evento (identificada por `?orderId=` o, si falta, la orden `PENDING` del evento en `GET /api/orders`)
  Cuando entro a `/eventos/:eventId/pago`
  Entonces veo el banner con el contador en tiempo real hasta `expiresAt` (`MM:SS`), los medios de pago (`Tarjeta de crédito`, `Tarjeta de débito`, `Dinero en cuenta` sin saldo inventado) y el resumen lateral de la orden (número de orden, evento, fecha, lugar, entradas/sector, total).
  Y si la orden todavía está cargando veo un indicador de carga; si no hay una orden `PENDING` o responde `404 order_not_found`, veo el estado correspondiente con un link para volver a elegir lugares.

- **CA2: Pagar con éxito y recibir confirmación**
  Dado que elegí un medio de pago y toco `Pagar $total`
  Cuando el pago se está procesando
  Entonces el botón queda deshabilitado con el texto "Procesando el pago…" para evitar envíos duplicados
  Y cuando `POST /api/orders/{id}/pay` responde `200` (`PAID`), veo la pantalla "¡Listo! Ya tenés tus entradas." con el monto, el medio de pago, la cantidad de QR emitidos y los links "Ver mis entradas" (`/mis-entradas`) y "Seguir explorando" (`/`).

- **CA3: Pago rechazado y reintentos con otro medio**
  Dado que intento pagar y el servidor responde `422 payment_rejected`
  Cuando los rechazos son menos de 3
  Entonces veo la alerta con el motivo del rechazo y el contador "Intento N de 3", la orden sigue activa y puedo elegir otro medio de pago y volver a intentar (con una nueva clave de idempotencia).
  Y al tercer rechazo (`rejectedAttempts >= 3` o `409 order_not_payable`), la pantalla pasa al estado finalizado "El pago se rechazó 3 veces" con el botón "Elegir lugares de nuevo" hacia `/eventos/:eventId/lugares`.

- **CA4: Pasarela sin respuesta y reintento seguro**
  Dado que el pedido de pago falla con `503 service_unavailable` o error de red sin respuesta
  Cuando ocurre el fallo
  Entonces veo la alerta "No pudimos confirmar el pago" indicando que puede reintentar sin que se cobre dos veces, y el botón cambia a "Reintentar el pago"
  Y al tocar "Reintentar el pago", se reenvía el pedido con la **misma** `idempotencyKey` del intento anterior (sin permitir cambiar de intento distinto mientras esté en curso).

- **CA5: Vencimiento de la reserva y ventana de pago**
  Dado que estoy en la pantalla de pago con una reserva activa
  Cuando el contador llega a `00:00` o el servidor responde `409 reservation_expired` / `409 payment_window_closed`
  Entonces la pantalla pasa al estado finalizado "Se venció tu reserva" (o el aviso de ventana cerrada) con el botón "Elegir lugares de nuevo" hacia `/eventos/:eventId/lugares`.

- **CA6: Abandonar la reserva**
  Dado que tengo una orden `PENDING`
  Cuando toco "Abandonar la reserva" y `POST /api/orders/{id}/cancel` responde `200`
  Entonces la pantalla pasa al estado finalizado "Abandonaste la reserva" con el botón "Elegir lugares de nuevo" hacia `/eventos/:eventId/lugares`.
  Y si responde `409 payment_in_progress`, veo un aviso indicando que hay un pago en curso y la reserva sigue vigente.

## Requisitos no funcionales

- A 360 px de ancho la página se usa sin scroll horizontal ni controles cortados, con el resumen de la orden apilado debajo del formulario de pago, siguiendo `PagoMobile`.
- Mientras el pago o la cancelación están en curso, los botones de acción permanecen deshabilitados para evitar envíos duplicados.
- Las alertas de rechazo, error de pasarela y timer usan texto y rol accesible (`role="alert"` / `role="timer"`), no solo color.

## Fuera de alcance

- Crear la reserva desde Lugares (`POST /api/orders`, issue `#21`).
- Banner de "Compra confirmada" en `/mis-entradas`.
- Botones de prototipo del mockup ("Prototipo: pasarela sin respuesta", "Prototipo: venció la reserva").

## Notas técnicas

- Feature: `purchase` (`PaymentPage`, ruta `/eventos/:eventId/pago`).
- Cada intento nuevo genera un UUID para `idempotencyKey`; si falla con `503` o error de red, se conserva la misma clave para el reintento. Si falla con `422 payment_rejected`, se genera una nueva clave para el próximo intento.
- Mockup: `Pago` y `PagoMobile` (`MOCKUP.md` / `project/Pago.dc.html` y `project/PagoMobile.dc.html`).

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
