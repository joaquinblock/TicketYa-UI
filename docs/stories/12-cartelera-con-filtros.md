# 12: Cartelera con filtros y búsqueda

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Inicio (épica #10 Cliente, página #11)

## Historia

Como **cliente**,
quiero **buscar eventos por texto y filtrarlos por tipo, ciudad y fecha**,
para **encontrar a qué ir sin recorrer toda la cartelera ni saber de antemano el nombre exacto del evento**.

## Contexto

Inicio hoy es solo un título. La cartelera es la puerta de entrada a la compra: sin ella, el cliente no llega al detalle de un evento. Consume `GET /api/events` (US-EVT-04, `joaquinblock/TicketYa#43`, cerrada) y `GET /api/venues` para las ciudades.

## Criterios de aceptación

- **CA1: Ver la cartelera**
  Dado que hay eventos publicados o agotados con fecha futura
  Cuando entro a Inicio
  Entonces veo hasta 8 eventos ordenados por fecha, cada uno con tipo, nombre, fecha y hora, lugar, ciudad y precio desde; los agotados dicen "Agotado"; y al tocar uno voy a su detalle.
- **CA2: Filtrar**
  Dado que estoy en la cartelera
  Cuando elijo un tipo, una ciudad o un rango de fechas
  Entonces veo solo los eventos que cumplen todos los filtros elegidos, con la cantidad encontrada; los filtros quedan en la URL, así que al recargar o al volver del detalle se mantienen; y "Hasta" no permite elegir una fecha anterior a "Desde".
- **CA3: Buscar por texto**
  Dado que escribo al menos 2 letras en el buscador
  Cuando dejo de escribir 300 ms
  Entonces veo hasta 5 sugerencias de eventos que coinciden, y cada una lleva a su detalle.
  Y cuando aprieto Enter o "Buscar", la cartelera muestra los resultados de ese texto ordenados por relevancia. "Relevancia" solo aparece en el orden cuando hay un texto buscado.
- **CA4: Sin resultados**
  Dado que ningún evento cumple los filtros
  Cuando se aplican
  Entonces veo "No encontramos eventos con esos filtros" y el botón "Limpiar filtros", que vuelve a la cartelera completa. "Limpiar filtros" también está a la vista siempre que haya algún filtro activo.
- **CA5: Cargando y error**
  Dado que la cartelera se está pidiendo
  Cuando todavía no llegó la respuesta
  Entonces veo 8 cards de carga en lugar de los eventos.
  Y si el backend falla o no responde, veo "No pudimos cargar los eventos" con "Reintentar", que vuelve a pedirlos.
- **CA6: Paginar**
  Dado que hay más de 8 eventos que cumplen los filtros
  Cuando toco "Siguiente" o "Anterior"
  Entonces veo la página correspondiente y "Página N de M". Con una sola página no se muestra la paginación.

## Requisitos no funcionales

- A 360 px de ancho se usa sin scroll horizontal. En mobile, ciudad y fechas quedan detrás de un botón "Filtros (n)" y los tipos siguen a la vista (revelación progresiva, ley de Hick).
- Todo objetivo táctil mide 44 × 44 px o más (ley de Fitts).
- 8 eventos por página: dentro del 7 ± 2 de Miller para comparar, y 2 filas de 4 en escritorio.
- Si una respuesta tarda más de 400 ms, ya se está mostrando el estado de carga (umbral de Doherty).

## Fuera de alcance

- Filtro por organizador y su nombre en la card: story aparte, bloqueada por la US del backend que lista las organizaciones.
- Imagen del evento en la card: story aparte, bloqueada por la US del backend que agrega `imageUrl` al evento. Mientras tanto, la card muestra un bloque de color con el tipo.
- Hero con el evento destacado y "Para vos": son de la página #11 y de la story #13.

## Notas técnicas

- Feature `catalog`; la página `src/pages/HomePage` compone la cartelera.
- Mockup: `Main` y `MainMobile` (artifact de `MOCKUP.md`, versión 25, revisada con `ux-psychology`).

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
