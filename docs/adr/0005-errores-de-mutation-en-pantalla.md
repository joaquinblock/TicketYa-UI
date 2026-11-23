# 0005: Una mutation que muestra su error en pantalla apaga el toast global con `meta`

- **Fecha:** 2026-11-23
- **Estado:** aceptada
- **Origen:** #21

## Contexto

El `MutationCache.onError` de `src/app/queryClient.ts` muestra un toast en cada error de mutation. Hasta ahora alcanzaba, porque la única mutation (pedir una devolución) no tenía otro aviso. "Reservar y pagar" (story 21) necesita otra cosa: cada error dice qué pasó y qué hacer al lado del botón, con `role="alert"`, y a veces con una acción ("Reintentar", "Iniciar sesión"). Si además saliera el toast, el mismo error se avisaría dos veces y en dos lugares (Nielsen 8, diseño minimalista).

## Decisión

- Una mutation que muestra su error en pantalla lo declara con `meta: { handlesErrorInline: true }`, y el `MutationCache.onError` no muestra el toast cuando lo trae.
- El tipo de `meta` se declara una sola vez con `Register` de TanStack Query (`mutationMeta`), en `queryClient.ts`, así que un typo en la clave no compila.
- Las demás mutations siguen igual: sin `meta`, avisan con toast.

## Alternativas consideradas

- **Sacar el toast global y que cada mutation avise el suyo:** obliga a tocar las mutations que hoy están bien con el toast, y una mutation nueva sin aviso fallaría en silencio.
- **Un `onError` por mutation que "consuma" el error:** TanStack Query llama igual al `onError` del cache, así que no evita el toast.
- **Una lista de mutation keys sin toast en `queryClient.ts`:** el dato queda lejos de la mutation, y `app/` pasa a saber de cada feature.

## Consecuencias

- Se gana: cada error se avisa una sola vez, en el lugar donde pasó, y el default sigue siendo avisar.
- Se acepta: el toast global depende de un dato que pone cada mutation. Si una mutation con aviso propio se olvida el `meta`, el error sale dos veces. Los tests no lo ven, porque `test/render.tsx` arma su propio `QueryClient`: se revisa a mano en el dev server.
- Para quien escribe código: si la mutation muestra su error en pantalla, poné `meta: { handlesErrorInline: true }`. Si no, no pongas nada.
