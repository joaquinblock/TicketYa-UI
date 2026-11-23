# 11: Evento destacado con cuenta regresiva en el hero

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Inicio (épica #10 Cliente)

## Historia

Como **cliente**,
quiero **ver en el hero de Inicio el próximo evento destacado con su cuenta regresiva hasta la apertura de la venta**,
para **enterarme al instante del próximo lanzamiento importante e ir directo a su detalle**.

## Criterios de aceptación

- **CA1: Mostrar evento destacado en el hero**
  Dado que entro a Inicio (`/`) y hay eventos publicados en la cartelera
  Cuando se carga la página
  Entonces veo a la derecha del hero (debajo en mobile) una tarjeta con el nombre del evento destacado, su fecha, hora, lugar y el botón "Ver el evento" hacia `/eventos/:id`.

- **CA2: Cuenta regresiva hasta apertura de venta**
  Dado que el evento destacado tiene `saleStart` en el futuro
  Cuando veo la tarjeta destacada
  Entonces muestra la cuenta regresiva en formato `HH:MM:SS` (`role="timer"`) que avanza cada segundo hasta que abre la venta.

- **CA3: Sin apertura pendiente o sin eventos**
  Dado que no hay eventos con `saleStart` futuro
  Cuando hay eventos publicados
  Entonces muestra el próximo evento publicado destacado sin reloj pendiente; y si no hay eventos publicados o falla la carga, el hero sigue usable sin tarjeta rota.

## Notas técnicas

- Mockup: `Main` y `MainMobile` (`project/Main.dc.html`, `.tk`).
