# 0002: Los filtros de una lista viven en la URL y se sanean con Zod

- **Fecha:** 2026-11-22
- **Estado:** aceptada
- **Origen:** #12

## Contexto

La cartelera de Inicio filtra por texto, tipo, ciudad, fechas y orden, y pagina. La story pide que los filtros se mantengan al recargar y al volver del detalle de un evento, y el buscador del hero y la cartelera tienen que mostrar el mismo estado. Una URL se puede escribir a mano o quedar vieja, así que puede traer valores que el backend rechaza (un tipo que no existe, `to` anterior a `from`).

## Decisión

- El estado de los filtros vive **solo en la URL** (`useSearchParams`), con los nombres de los parámetros del backend: `q`, `type`, `city`, `from`, `to`, `sort` y `page`. En la URL `page` empieza en 1; al backend se le manda `page - 1`.
- Un schema de Zod con `.catch()` por campo **sanea** la URL (ley de Postel): lo inválido se descarta y la URL se reemplaza (`replace`) por la que refleja lo que se muestra. Solo se escriben los parámetros que no son el valor por defecto.
- El schema es una función pura (`parseEventFilters` / `toSearchParams`), testeada sin React.

## Alternativas consideradas

- **Estado en React (`useState`) o en un store:** se pierde al recargar y obliga a sincronizarlo a mano con la URL.
- **Mostrar un error ante una URL inválida:** castiga al usuario por un link viejo; mostrar lo que sí se entiende es más útil.
- **Nombres de parámetros en español:** dos vocabularios para lo mismo y un mapeo extra hacia el backend.

## Consecuencias

- Se gana: recargar, compartir el link y el botón "atrás" funcionan sin código extra, y no hace falta un controller porque la URL es la única fuente de verdad.
- Se acepta: cada cambio de filtro es una navegación, y el texto del buscador se escribe en la URL recién con Enter o "Buscar", no letra por letra.
- Para quien escribe código: una lista nueva con filtros sigue este patrón (schema con `.catch()` + hook que lee y escribe `useSearchParams`).
