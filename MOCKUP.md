# Mockup de TicketYa

El mockup interactivo es la referencia visual de la interfaz: así tiene que quedar.

- **Online:** https://claude.ai/artifact/3UPvqt8m5RRCCZ1pyau6H3 (privado, de la cuenta del dueño)
- **Copia local:** `project/`. Hay un archivo `.dc.html` por pantalla y `canvas.json` ordena las pantallas por rol.
- **Imágenes:** las fotos de los eventos apuntan a `/_blob/...`, que solo existe en el artifact. Abiertas en local, esas fotos no cargan.

## Pantallas

Cada pantalla del cliente tiene su versión mobile de 390 px (`MainMobile`, `EventoMobile`, etc.), ubicada debajo de la de escritorio en el lienzo. Las versiones mobile son copias de las de escritorio con los links cambiados a las versiones mobile. Si cambiás una pantalla de escritorio, tenés que volver a generar su copia mobile.

**Cliente**

| Archivo    | Pantalla                                                 |
| ---------- | -------------------------------------------------------- |
| `Main`     | Inicio: hero, cartelera con filtros, "Para vos" y footer |
| `Evento`   | Detalle del evento, con breadcrumb y pasos de la compra  |
| `Fila`     | Fila virtual                                             |
| `Asientos` | Elegí tus lugares                                        |
| `Pago`     | Reserva y pago, con todos sus estados                    |
| `Entradas` | Mis entradas, con el QR y las devoluciones               |
| `Perfil`   | Preferencias y notificaciones                            |

**Organizador**

| Archivo      | Pantalla          |
| ------------ | ----------------- |
| `OrgEventos` | Mis eventos       |
| `OrgEditor`  | Editor del evento |
| `OrgReporte` | Reporte de ventas |

**Administrador**

| Archivo        | Pantalla                  |
| -------------- | ------------------------- |
| `AdminGestion` | Gestión del administrador |

Las pantallas de organizador y administrador todavía tienen el estilo viejo. Faltan `AdminLugares` y `Acceso` (personal de acceso).

## Design system usado

- **Colores:**

  | Uso              | Color                            |
  | ---------------- | -------------------------------- |
  | Fondo            | `#F2F1EC`                        |
  | Tinta            | `#141414`                        |
  | Texto secundario | `#5C5A55` y `#77736B`            |
  | Líneas           | `#E4E1D9`                        |
  | Acento           | `#FFC531`                        |
  | Links            | `#1D4ED8`                        |
  | Éxito            | `#DDF1E6` / `#14532D`            |
  | Error            | `#FBE3E1` / `#8A1C13`            |
  | Advertencia      | `#FFF1CC` / `#5C4200`            |
  | Asiento libre    | `#EEF3E9`                        |
  | Footer           | fondo `#F8F7F3`, borde `#E1DED7` |

- **Tipografía:** Archivo 800 en los títulos (con punto amarillo al final), Inter en el texto y JetBrains Mono en códigos, montos y timers.
- **En todas las pantallas del cliente:**
  - El mismo header, con la navegación centrada y el subrayado amarillo en la sección activa.
  - El mismo footer grande, con la marca TicketYa®.
- **En la compra:**
  - "← Volver" arriba.
  - Los pasos Explorar / Evento / Fila virtual / Lugares / Pago.
