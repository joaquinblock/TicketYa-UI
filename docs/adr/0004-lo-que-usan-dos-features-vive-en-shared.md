# 0004: Lo que usan dos features vive en `shared/`, con las mismas carpetas que una feature

- **Fecha:** 2026-11-23
- **Estado:** aceptada
- **Origen:** #19

## Contexto

Lugares (`purchase`, story 19) necesita el evento y su disponibilidad, que hasta ahora eran de `catalog`: los services `getEvent` y `getAvailability`, sus tipos, sus query keys, los hooks `useEvent` y `useEventAvailability` (con el refresco cada 30 s) y el formato del precio y la fecha. Las features no se importan entre sí (skill `atomic-design`), y copiarlo daría dos fuentes de verdad y dos caches de la misma query.

## Decisión

- Lo que usan dos o más features pasa a `src/shared/` con `git mv`, junto con su test. Solo cambian las rutas de los imports.
- Dentro de `shared/` se usan las mismas carpetas que en una feature (ADR 0003): `services/`, `hooks/`, `types/`, `constants/`, `utils/` y `lib/` (las query keys).
- Las query keys compartidas son `eventKeys` (`shared/lib/event.queryKeys.ts`): catalog y purchase piden el evento y la disponibilidad con la misma key, así que comparten el cache.
- Lo que solo usa una feature se queda en ella, aunque esté en el mismo archivo: `searchEvents` sigue en catalog y `getEvent` pasa a shared.

## Alternativas consideradas

- **Que purchase importe de catalog:** acopla las features; un cambio en catalog rompe la compra.
- **Copiar el service y el hook en purchase:** dos fuentes de verdad, y la misma disponibilidad se pide dos veces con keys distintas.
- **Mover `catalog.types.ts` entero a shared:** arrastra tipos que solo son de la cartelera (filtros, paginación, avisos).

## Consecuencias

- Se gana: una sola fuente de verdad del evento y la disponibilidad, y el cache compartido entre el detalle y Lugares.
- Se acepta: `events.service.test.ts` queda en catalog aunque también pruebe `getEvent`, porque un test commiteado no se parte. Y `useEventAvailability.test.ts` importa `eventKeys as catalogKeys` para no tocar su cuerpo.
- Para quien escribe código: antes de importar algo de otra feature, se mueve a `shared/` con este criterio.
