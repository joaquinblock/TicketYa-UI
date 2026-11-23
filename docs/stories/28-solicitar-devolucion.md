# 28: Solicitar la devolución de una entrada

**Tipo:** Story
**Estado:** borrador
**Funcionalidad:** Mis entradas (épica #10 Cliente, página #26)

## Historia

Como **cliente**,
quiero **pedir la devolución de una entrada emitida desde Mis entradas**,
para **recuperar mi dinero si no puedo asistir al evento, dentro del plazo permitido**.

## Contexto

Después de comprar, el cliente puede necesitar cancelar una entrada individual y solicitar su reintegro (`US-TKT-14` del backend, `POST /api/tickets/{ticketId}/return-requests`). Hoy `TicketResponse` en el backend no informa si una entrada `ISSUED` ya tiene una solicitud de devolución `PENDING`, por lo que este ticket contempla exponer ese dato en el backend para que el estado `Devolución pendiente` sea consistente incluso al recargar la página.

## Criterios de aceptación

- **CA1: Solicitar la devolución de una entrada emitida**
  Dado que tengo una entrada en estado `Emitida` (sin devolución pendiente) para un evento al que le faltan 72 horas o más
  Cuando la expando y toco "Pedir la devolución"
  Entonces se abre el diálogo "¿Pedir la devolución?" con la ubicación de la entrada, el texto explicativo con el monto a reintegrar al medio de pago original y los botones "No, volver" y "Sí, pedir devolución".
  Y cuando confirmo con "Sí, pedir devolución", el botón queda deshabilitado mientras se envía el pedido y, al confirmarse, el diálogo se cierra, la entrada pasa a mostrar `Devolución pendiente` con su QR atenuado y ese estado persiste al recargar `/mis-entradas`.

- **CA2: Cancelar el pedido desde el diálogo**
  Dado que abrí el diálogo "¿Pedir la devolución?"
  Cuando toco "No, volver"
  Entonces el diálogo se cierra sin enviar ningún pedido y la entrada sigue en estado `Emitida`.

- **CA3: Plazo vencido (menos de 72 horas o evento pasado)**
  Dado una orden cuyo evento comienza en menos de 72 horas o ya pasó
  Cuando la veo en `/mis-entradas`
  Entonces muestra el aviso "Faltan menos de 72 horas para este evento: ya no se pueden pedir devoluciones."
  Y al expandir una entrada `Emitida` de esa orden, el botón "Pedir la devolución" está deshabilitado y no abre el diálogo.

- **CA4: Entradas no elegibles**
  Dado una entrada en estado `Devolución pendiente`, `Usada` o `Reintegrada`
  Cuando la expando
  Entonces veo el mensaje explicativo de su estado y no tengo disponible la acción para pedir devolución.

- **CA5: Error del servidor o de regla de negocio**
  Dado que confirmé "Sí, pedir devolución"
  Cuando el servidor responde con error (por ejemplo `409 refund_not_allowed`, `409 return_request_already_pending` o falla de red/servidor)
  Entonces veo un mensaje entendible en español sin cerrar abruptamente la pantalla, el botón vuelve a habilitarse y la entrada mantiene su estado real.

## Requisitos no funcionales

- A 360 px de ancho el diálogo y el aviso de 72 horas se usan sin scroll horizontal ni botones cortados, siguiendo `EntradasMobile`.
- Mientras el pedido de devolución está en curso, se deshabilita el botón de confirmación para evitar envíos duplicados.
- Los estados (`Emitida`, `Devolución pendiente`, `Usada`, `Reintegrada`) se distinguen con texto, no solo con color.

## Fuera de alcance

- Panel de administrador para listar, aprobar o rechazar devoluciones (`US-TKT-15`, `US-TKT-16`, `US-TKT-17`).
- Campo de motivo libre al solicitar la devolución.
- Banner de "Compra confirmada" al volver del pago (story #23).

## Notas técnicas

- Feature: `tickets` (`MyTicketsPage`, ruta `/mis-entradas`).
- Backend (`C:\Projects\TicketYa`): `POST /api/tickets/{ticketId}/return-requests` (`US-TKT-14`) y sumar el indicador de devolución pendiente en `TicketResponse` (`GET /api/orders`).
- Mockup: `Entradas` y `EntradasMobile` (`MOCKUP.md` / `project/Entradas.dc.html` y `project/EntradasMobile.dc.html`).

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
