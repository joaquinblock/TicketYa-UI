# 27: Mis compras y el QR de cada entrada

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Mis entradas (épica #10 Cliente, página #26)

## Historia

Como **cliente**,
quiero **ver mis compras pagadas con el detalle de cada entrada y su código QR**,
para **tener mis entradas a mano y mostrarlas en la puerta del evento sin depender de mails ni impresiones**.

## Contexto

Después de comprar, el cliente necesita un lugar donde consultar sus entradas y mostrar el QR en el ingreso. Consume `GET /api/orders` y `GET /api/orders/{id}` (`US-TKT-12`, `joaquinblock/TicketYa#54`, cerrada). Como el login (#8) está postergado al final, en desarrollo se obtiene automáticamente el token de `dev-login` del cliente del seeder (user `1`) si no hay sesión.

## Criterios de aceptación

- **CA1: Ver mis compras pagadas**
  Dado que tengo compras pagadas
  Cuando entro a Mis entradas (`/mis-entradas`)
  Entonces veo mis órdenes `PAID` ordenadas de la más nueva a la más vieja, con fecha y hora del evento, nombre, lugar, número de orden, medio de pago, fecha de compra, total y la lista de entradas con ubicación, código, precio y estado (`Emitida`, `Usada`, `Devolución pendiente` o `Reintegrada`).

- **CA2: Ver el QR de una entrada**
  Dado una orden con entradas
  Cuando toco una entrada para expandirla
  Entonces veo su código QR generado a partir del `qrCode` de la entrada (atenuado si su estado no es `Emitida`), su código legible y el mensaje explicativo de su estado.
  Y cuando vuelvo a tocar la entrada expandida, se cierra.

- **CA3: Sin compras**
  Dado que no tengo compras pagadas
  Cuando entro a Mis entradas
  Entonces veo un estado vacío con un link para ir a explorar eventos (`/`).

- **CA4: Cargando y error**
  Dado que se están pidiendo mis compras
  Cuando todavía no llegó la respuesta
  Entonces veo un indicador de carga.
  Y si el backend falla o no responde, veo un mensaje entendible con un botón "Reintentar" que vuelve a pedir las compras.

## Requisitos no funcionales

- A 360 px de ancho se usa sin scroll horizontal; en mobile se ocultan el número de orden del encabezado y el nombre junto al avatar, como en `EntradasMobile`.
- Si la respuesta tarda más de 400 ms, ya se está mostrando el indicador de carga (umbral de Doherty).
- Los estados de cada entrada se distinguen con texto, no solo con color (accesibilidad, Von Restorff).

## Fuera de alcance

- Pedir la devolución de una entrada, el modal de confirmación y el aviso de 72 horas (story #28).
- El banner de "Compra confirmada" al volver desde el pago (story #23).
- El flujo de inicio de sesión con Google (story #8).

## Notas técnicas

- Feature: `tickets`. Ruta `/mis-entradas` (`ROUTES.myTickets` en `src/shared/lib/routes.ts`).
- Generación de QR con la librería `qrcode`.
- Mockup: `Entradas` y `EntradasMobile` (`MOCKUP.md` / `project/Entradas.dc.html`).

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
