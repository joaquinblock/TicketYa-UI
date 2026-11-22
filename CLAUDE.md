@AGENTS.md

# TicketYa UI

Frontend de TicketYa. Consume la API del backend a través del api-gateway (`http://localhost:8080`).

## Específico de Claude Code

- Los reviewers están en `~/.claude/agents/`. No los lances directamente: `/rdd` decide cuáles hacen falta.
- Si el contexto se llena a mitad de una tarea, actualizá el Log del tracker y sugerí `/clear`: el tracker conserva el estado.
- El hook `agent-guard.mjs` y `.githooks/commit-msg` bloquean firmas de IA, commits en `main`, mensajes mal formados y cambios a tests commiteados mientras exista `.work/tests.lock`. Si un hook te bloquea, leé el mensaje y corregí; no intentes esquivarlo.

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

- **Cliente HTTP:** los services de cada feature usan `apiClient.get/post/put/patch/delete` de `src/shared/lib/http/apiClient.ts`.
- **Ruteo:** React Router con `BrowserRouter`, `<Routes>` en `src/app/AppRouter.tsx` y un `routes/<feature>.route.tsx` por feature. Los paths viven todos en `src/shared/lib/routes.ts`, porque el header, el footer y la compra enlazan entre features.

## Tests

**Sin MSW.** Los tests que tocan la red van contra el backend real a través del gateway, con el perfil `dev` del auth-service. La fuente de verdad son los datos que devuelven los seeders del backend. Esto reemplaza lo que dice `workflow-ui` sobre MSW.

## Issues

- Cada issue del front enlaza la US del backend que consume (por ejemplo, `joaquinblock/TicketYa#43` para US-EVT-04).
- Si la US del backend está abierta, el issue del front queda bloqueado por ella.
