# 0003: Reglas en `domain/`, formato en `utils/` y librerías en `lib/`

- **Fecha:** 2026-11-23
- **Estado:** aceptada
- **Origen:** #16

## Contexto

Hasta ahora, en cada feature, `lib/` juntaba tres cosas que cambian por motivos distintos:

- las query keys;
- el formato de los datos para mostrarlos (`formatPrice`);
- las reglas del negocio (`eventNotice.ts`).

La story 16 suma reglas del sector, como unir la disponibilidad por nombre o decidir qué botón va, y textos de lugares. Si comparten archivo, cambiar una redacción toca el mismo archivo que una regla, y el nombre de la carpeta no dice qué hay adentro.

## Decisión

Dentro de cada feature hay tres carpetas:

| Carpeta   | Qué guarda                                                                               | Ejemplo                                                                                      |
| --------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `domain/` | Reglas del negocio de la feature, puras y con su test unitario                           | `domain/sectorAvailability.ts`: unir sectores, cuándo se ve la disponibilidad y qué botón va |
| `utils/`  | Funciones puras y genéricas, sin reglas del negocio: formatear fechas, moneda y textos   | `utils/sectorFormat.ts`: "N disponibles" y porcentaje de ocupación                           |
| `lib/`    | Configuración y wrappers de librerías de terceros, para que el resto no dependa de ellas | Query keys de TanStack Query                                                                 |

El formato y las reglas nunca comparten archivo.

## Alternativas consideradas

- **Todo en `lib/`, como hasta ahora:** mezcla motivos de cambio, y `lib/` ya es la carpeta de las librerías de terceros.
- **`utils/` con dos archivos separados, sin `domain/`:** separa los archivos, pero la carpeta no distingue una regla de un formato.

## Consecuencias

- Se gana: al cambiar una regla se va a `domain/` y al cambiar un texto a `utils/`. Los tests de reglas no se rompen por un cambio de redacción.
- Se acepta: una carpeta más por feature. Hasta que se migre lo de antes, el repo queda mezclado: `eventFormat.ts`, `eventNotice.ts`, `eventId.ts` y `venueMap.ts` siguen en `lib/` (ver `docs/TODO.md`).
- Para quien escribe código: esto reemplaza lo que dice la skill `atomic-design` sobre poner el formateo en `lib/`.
