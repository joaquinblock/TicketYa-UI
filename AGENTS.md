# AGENTS.md

> Mapa del proyecto para cualquier agente. Corto a propósito: se carga en cada sesión.

## Comandos

- Tests: `pnpm run test` (los de red necesitan el backend levantado, ver _Proyecto_)
- Un solo test: `pnpm exec vitest run <archivo>`
- Verificación completa, para saber que no se rompió nada: `pnpm run verify` (ESLint, Prettier, Vitest y build con typecheck)
- Formato y lint: `pnpm run format:check` y `pnpm run lint` (`pnpm run format` corrige el formato)

## Flujo

`/ticket` → PR de stories → `/tracker` → `/clear` → `/implement` → `/clear` → `/rdd` → `/retro` → PR. El detalle está en `docs/flujo-de-trabajo.md`.

- **`/rdd` no se corre en este proyecto, salvo que el usuario lo pida explícitamente** (por tiempo y tokens). Si no lo pide, de `/implement` se pasa directo a `/retro`.

- Proyecto de frontend: cargá la skill `workflow-ui` en cada paso. El contrato visual es `MOCKUP.md`.
- Sin tracker en `.work/NUM-*.md` no se escribe código de producción.
- Un test commiteado no se cambia para que pase. Si parece mal, se anota en el Log del tracker y se pregunta.
- No se toca nada de lo que el tracker marca como "Fuera de alcance".
- Un patrón nuevo (abstracción, librería, estructura de carpetas, manejo de errores) necesita un ADR en `docs/adr/`.

## Trabajo en paralelo (Claude y Gemini)

Claude (Claude Code) y Gemini (Antigravity) trabajan a la vez en tickets distintos. Cada uno tiene su propia carpeta, para no cambiarle la rama ni mezclarle el `git status` al otro:

| Agente | Carpeta                         | Ramas                               |
| ------ | ------------------------------- | ----------------------------------- |
| Claude | `C:\Projects\TicketYa-UI`       | `main` y las ramas de sus tickets   |
| Gemini | `C:\Projects\TicketYa-UI-<NUM>` | Una rama por ticket, en un worktree |

- **Gemini abre un worktree por ticket**, desde `main` actualizado: `git worktree add ..\TicketYa-UI-<NUM> -b <tipo>/<NUM>-<descripcion> main`. Abre Antigravity con ese worktree como workspace.
- **Cada carpeta tiene su propio `.env`, `node_modules` y `.work/`**: en un worktree nuevo, copiá el `.env` y corré `pnpm install`.
- **`main` solo se abre en `C:\Projects\TicketYa-UI`**. Git no deja tener la misma rama abierta en dos carpetas.
- **Nunca se trabaja en la carpeta del otro** ni se toma un ticket que ya tiene rama o worktree. `git worktree list` muestra quién está en qué.
- Cuando se mergea el PR: `git worktree remove ..\TicketYa-UI-<NUM>` y `git pull` en `main`.

## Proyecto

- Fuente de verdad sobre qué construir: el backend en `C:\Projects\TicketYa` (consigna en su `README.md`, US en `docs/user-stories.md`).
- Si algo se puede resolver en el backend (un dato del seeder, un campo que falta en la respuesta), se arregla ahí antes de parchear el front.
- Estructura de carpetas: skill `atomic-design`. Features del proyecto en `CLAUDE.md`.
- Los tests de red van contra el gateway real (`TICKETYA_GATEWAY_URL` en `.env`), con el auth-service en perfil `dev`. Sin MSW.
- Configuración en `.env` con prefijo `TICKETYA_`. Copiá `.env.example` la primera vez.

## Dónde buscar

- Cómo funciona el flujo → `docs/flujo-de-trabajo.md`
- Arquitectura → `docs/architecture.md`
- Roles y glosario del dominio → `docs/domain/`
- Decisiones tomadas → `docs/adr/`
- Atributos de calidad → `docs/quality-attributes.md`
- Tickets → `docs/stories/`
