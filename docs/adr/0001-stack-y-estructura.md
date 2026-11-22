# 0001: Stack del frontend y estructura de carpetas

- **Fecha:** 2026-11-22
- **Estado:** aceptada

## Contexto

La consigna valora una interfaz gráfica que consuma la API por el gateway y cubra al menos los flujos del cliente (buscar, elegir sector y asientos, comprar, ver entradas). Organizador, administrador y personal de acceso usan la misma cuenta y la misma marca. Quedan dos días.

## Decisión

- **Una sola app** de React 19 con Vite y TypeScript, y pnpm. Cada rol es un grupo de rutas, no una app aparte.
- **Librerías:** React Router, TanStack Query v5, React Hook Form + Zod, Tailwind v4, shadcn (Radix + `class-variance-authority`), sonner (toasts), Recharts (gráficos), lucide-react (íconos) y qrcode (QR de las entradas).
- **Calidad:** ESLint, Prettier, Vitest y Testing Library. `pnpm run verify` corre los cuatro pasos.
- **Tests de red contra el backend real**, sin MSW: la fuente de verdad son los datos del seeder.
- **Estructura** según la skill `atomic-design`: `features/` por funcionalidad y `shared/components/{atoms,molecules,organisms,templates}` para lo compartido.
- **Configuración en `.env`** con el prefijo `TICKETYA_` (`.env.example` versionado).

## Alternativas consideradas

- **Monorepo con Turborepo** (una app por rol y un paquete de UI): el producto es uno solo, con el mismo login, y la configuración de paquetes no se paga en dos días.
- **MSW para la red:** descartado para no probar contra respuestas inventadas.
- **Carpeta `components/ui` plana:** crece sin orden cuando entran componentes de una sola pantalla.

## Consecuencias

- Para correr los tests de red hay que levantar el backend con el perfil `dev`. Los tests que cambian datos obligan a reiniciar el servicio.
- Sumar un rol es sumar rutas y features, no otra app.
