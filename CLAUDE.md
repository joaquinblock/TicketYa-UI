@AGENTS.md

# TicketYa UI

Frontend de TicketYa. Consume la API del backend a través del api-gateway (`http://localhost:8080`).

## UX

- Las decisiones de UX (ítems por página, opciones visibles, tamaño y posición de las acciones, agrupación, mensajes) se justifican con la skill `ux-psychology`, citando la ley, en `/ticket`, `/tracker` y `/rdd`. No se deciden por lo que trae el seeder.
- **Antes de crear la rama `feat/` de una página**, repasá su pantalla en el mockup (artifact y copia en `project/`, ver `MOCKUP.md`) con `ux-psychology`, en escritorio y mobile. Si algo está mal, se corrige primero el mockup y se trabaja desde la versión corregida: el mockup sigue siendo el contrato visual.

**Es un TP de facultad.** No hay que perderlo de vista: ante dos soluciones, va la más simple que cumple la consigna. Por ejemplo, las imágenes de los eventos son una URL de internet guardada como atributo del evento (el organizador la pega al publicar, no sube un archivo). Guardarlas en otra base o en un storage aparte sería lo correcto en producción, pero acá es sobreingeniería.

## Específico de Claude Code

- Los reviewers están en `~/.claude/agents/`. No los lances directamente: `/rdd` decide cuáles hacen falta.
- Si el contexto se llena a mitad de una tarea, actualizá el Log del tracker y sugerí `/clear`: el tracker conserva el estado.
- El hook `agent-guard.mjs` y `.githooks/commit-msg` bloquean firmas de IA, commits en `main`, mensajes mal formados y cambios a tests commiteados mientras exista `.work/tests.lock`. También bloquea escribir un `.tsx`, un `*.types.ts`, un `*.constants.ts`, un hook o un service sin haber cargado antes su skill en la sesión. Si un hook te bloquea, leé el mensaje y corregí; no intentes esquivarlo.
- **Se trabaja en paralelo con Antigravity (Gemini)**, que también sube cambios a `main`. Cada vez que abras un PR, hacé también un pull de `main` (`git fetch origin` y `git pull` en `main`), para tener lo que subió Gemini y ver si choca con tu rama.

## Fuente de verdad

- **Backend y consigna:** `C:\Projects\TicketYa` (repo https://github.com/joaquinblock/TicketYa). Fijate ahí siempre antes de decidir qué construir.
  - La consigna del TP está en el `README.md` principal de ese repo (sección _Trabajo Práctico Grupal: TicketYa_, y en particular _Interfaz gráfica_).
  - User stories del backend, con criterios de aceptación: `docs/user-stories.md`.
  - Endpoints: `docs/architecture/endpoints.md` y el Swagger del gateway (`http://localhost:8080/swagger-ui.html`).
  - Permisos por rol: `docs/architecture/permissions.md`. Errores y sus códigos: `docs/architecture/error-handling.md`.
- **Mockup (contrato visual):** `MOCKUP.md` de este repo. Online en https://claude.ai/artifact/3UPvqt8m5RRCCZ1pyau6H3 y copia local en `project/`.

## Links

| Qué                              | Dónde                                             |
| -------------------------------- | ------------------------------------------------- |
| Repo del frontend                | https://github.com/joaquinblock/TicketYa-UI       |
| Repo del backend                 | https://github.com/joaquinblock/TicketYa          |
| Issues del backend (US y épicas) | https://github.com/joaquinblock/TicketYa/issues   |
| Mockup                           | https://claude.ai/artifact/3UPvqt8m5RRCCZ1pyau6H3 |

## Estructura

Seguí siempre la skill `atomic-design`: features con Atomic Design en lo compartido, el hook propio en la carpeta del componente y controller solo cuando hay que coordinar. Las features de este proyecto:

| Feature       | Pantallas del mockup                   |
| ------------- | -------------------------------------- |
| `catalog`     | Inicio (cartelera) y Evento            |
| `queue`       | Fila virtual                           |
| `purchase`    | Asientos y Pago (comparten la reserva) |
| `tickets`     | Mis entradas y devoluciones            |
| `preferences` | Perfil y "Para vos"                    |
| `auth`        | Login y sesión                         |

Inicio combina `catalog` y `preferences`, así que vive en `src/pages/`.

- **Partir un componente** (inline, subcomponente en el mismo archivo o archivo propio): skill `react-components`, sección "Inline, mismo archivo o archivo propio". Se decide antes de escribir el JSX.

- **Cliente HTTP:** los services de cada feature usan `apiClient.get/post/put/patch/delete` de `src/shared/lib/http/apiClient.ts`.
- **Ruteo:** React Router con `BrowserRouter`, `<Routes>` en `src/app/AppRouter.tsx` y un `routes/<feature>.route.tsx` por feature. Los paths viven todos en `src/shared/lib/routes.ts`, porque el header, el footer y la compra enlazan entre features.

## Tests

**Sin MSW.** Los tests que tocan la red van contra el backend real a través del gateway, con el perfil `dev` del auth-service. Esto reemplaza lo que dice `workflow-ui` sobre MSW.

- **Los tests de red verifican reglas, no fotos de la base**, porque los datos cambian (otro seeder, un organizador que publica un evento). Por ejemplo, "todas las cards son recitales" en vez de "estos 3 recitales", o "el contador coincide con el total que el backend devuelve para esos filtros" en vez de "dice 03".
- **Del seeder solo se fijan las anclas** que están documentadas en _Datos de prueba_ del backend (`event-service.md` y sus pares): que "Jazz en el puerto" está agotado, que hay un recital en Tandil. Antes de escribir una, se consulta el backend y se mira la respuesta completa.
- Un estado vacío se provoca con algo que no puede coincidir con ningún dato (un texto absurdo), no con una combinación de filtros que hoy da vacío.

## Issues

- Cada issue del front enlaza la US del backend que consume (por ejemplo, `joaquinblock/TicketYa#43` para US-EVT-04).
- Si la US del backend está abierta, el issue del front queda bloqueado por ella.
