# AGENTS.md

> Mapa del proyecto para cualquier agente. Corto a propósito: se carga en cada sesión.

## Comandos

- Tests: `pnpm run test` (los de red necesitan el backend levantado, ver _Proyecto_)
- Un solo test: `pnpm exec vitest run <archivo>`
- Verificación completa, para saber que no se rompió nada: `pnpm run verify` (ESLint, Prettier, Vitest y build con typecheck)
- Formato y lint: `pnpm run format:check` y `pnpm run lint` (`pnpm run format` corrige el formato)

## Flujo

`/ticket` → PR de stories → `/tracker` → `/clear` → `/implement` → `/clear` → `/rdd` → `/retro` → PR. El detalle está en `docs/flujo-de-trabajo.md`.

- Proyecto de frontend: cargá la skill `workflow-ui` en cada paso. El contrato visual es `MOCKUP.md`.
- Sin tracker en `.work/NUM-*.md` no se escribe código de producción.
- Un test commiteado no se cambia para que pase. Si parece mal, se anota en el Log del tracker y se pregunta.
- No se toca nada de lo que el tracker marca como "Fuera de alcance".
- Un patrón nuevo (abstracción, librería, estructura de carpetas, manejo de errores) necesita un ADR en `docs/adr/`.

## Proyecto

- Fuente de verdad sobre qué construir: el backend en `C:\Projects\TicketYa` (consigna en su `README.md`, US en `docs/user-stories.md`).
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
