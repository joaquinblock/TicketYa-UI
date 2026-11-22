# Prompt: backoffice de TicketYa (organizador, administrador y personal de acceso)

Seguimos con TicketYa. Este prompt **va después del de la parte del cliente**, que ya diseñaste.

**Respetá el design system que elegiste en ese prompt**: los mismos colores, la misma tipografía, los mismos componentes (botones, badges, cards, tablas, inputs, chips, banners), los mismos íconos, el mismo espaciado y el mismo tono de los textos. Todo tiene que seguir el estilo que venías siguiendo. Tiene que sentirse el mismo producto, no una herramienta aparte. Si necesitás un componente nuevo (tabla densa, barra lateral, gráfico, escáner), armalo con las mismas reglas visuales que ya definiste.

Recordatorio: **TicketYa** es una ticketera argentina para todo tipo de eventos: recitales, festivales, teatro, partidos y conferencias. Cualquier organizador, desde un club de barrio hasta una gran productora, publica sus eventos y vende entradas. El público compra desde el celular. Esto cubre los otros tres roles: organizador, administrador y personal de acceso.

Todo en español rioplatense (vos, elegí, publicá). Montos en pesos con punto de miles (`$68.000`). Fechas como `13 dic 2026 · 21:00`.

## Reglas comunes

- **Un solo producto con tres espacios, no tres aplicaciones.** Organizador, administrador y personal de acceso entran con la misma cuenta de Google, a la misma app. Cada uno ve solo lo que su rol permite. Arriba siempre se ve quién es (nombre, rol y, si corresponde, su organización) y hay un link para volver a la tienda pública.
  - **Organizador y administrador comparten el mismo armado del backoffice**: la misma barra lateral, el mismo encabezado, las mismas tablas, filtros, confirmaciones y estados. Solo cambian las secciones del menú según el rol. Las pantallas que tienen en común (Participantes, la tabla de eventos con suspender, reanudar y cancelar) son la misma pantalla, no dos versiones.
  - **El personal de acceso es una vista para el celular dentro de la misma app**, sin barra lateral y con todo más grande, pero con la misma marca y el mismo design system.
- **Misma marca que la parte del cliente**: el mismo logo y el mismo footer o pie, adaptado al backoffice.
- **Escritorio primero** para organizador y administrador: navegación lateral fija, contenido amplio, tablas. **Celular primero** para el personal de acceso: una sola mano, botones grandes y uso en la puerta con poca luz.
- **Cada acción que no se puede deshacer pide confirmación**: cancelar un evento, borrar un borrador, aprobar o rechazar una devolución, borrar un lugar. La confirmación dice qué va a pasar en concreto (por ejemplo: "Se reintegran 1.240 entradas y se avisa a los compradores").
- **Cada pantalla contempla sus estados:** cargando, vacío (con qué hacer), error del servidor con reintentar, y sin permiso (403).
- **Los errores del sistema se muestran en lenguaje humano**, al lado de lo que los causó. No se muestran códigos crudos.
- **Estados de un evento**, siempre con el mismo badge en todas las pantallas, usando los badges de estado que ya definiste:
  - Borrador
  - Publicado
  - Agotado
  - Suspendido
  - Cancelado
  - Finalizado

---

## 1. Backoffice del organizador

El organizador pertenece a una **organización** (por ejemplo, "Del Sur Producciones"). Ve todos los eventos de su organización, pero solo puede suspender o cancelar los que **creó él**.

### 1.1 Mis eventos (inicio)

- Encabezado con el nombre de la organización y el botón principal **"Crear evento"**.
- Resumen arriba: eventos a la venta, entradas vendidas este mes, recaudación y próximos eventos.
- Tabla o lista de eventos con:
  - Nombre e imagen chica
  - Tipo
  - Fecha
  - Lugar y ciudad
  - Estado
  - Vendidas sobre la capacidad, con una barra de ocupación
  - Recaudación
  - Si es de **alta demanda**, una marca visible
  - Quién lo creó
- Filtros por estado y búsqueda por nombre.
- Acciones por fila, según el estado:
  - **Borrador:** editar, publicar, borrar.
  - **Publicado o agotado:** ver reporte, asignar personal, suspender, cancelar.
  - **Suspendido:** reanudar (con fecha nueva opcional), cancelar.
  - **Cancelado o finalizado:** solo ver reporte.
- Si el evento lo creó otro organizador de la misma organización, suspender y cancelar aparecen deshabilitados, con el motivo: "Solo quien creó el evento, o un administrador, puede suspenderlo".

### 1.2 Crear y editar un evento (solo en borrador)

Un formulario por pasos, o por secciones, que se pueda guardar en cualquier momento como borrador. Si en la parte del cliente usaste un indicador de pasos para la compra, usá el mismo acá.

1. **Datos:** nombre, descripción, tipo (recital, festival, teatro, deporte, conferencia, otro), fecha y hora (siempre futura) e imagen de portada.
2. **Lugar:** se elige de los lugares cargados por el administrador (estadio, teatro, sala). Se muestra la dirección, la ciudad y un mapa chico. Avisar que **si cambia el lugar, se borran los sectores y precios elegidos**.
3. **Sectores y precios:**
   - Lista de los sectores del lugar. Cada uno dice si es **numerado** (filas y asientos) o **no numerado** (zona con capacidad, por ejemplo "Campo") y cuál es su capacidad.
   - Se marca cuáles se venden y a qué precio (mayor a 0, hasta dos decimales).
   - Se muestran la capacidad total del evento y una vista chica del plano del lugar, con el mismo estilo de plano que en la elección de asientos del cliente.
4. **Participantes:**
   - Buscar y agregar artistas, equipos o disertantes del catálogo, filtrando por tipo.
   - Si no existe, crearlo ahí mismo, con nombre y tipo.
   - No puede haber dos con el mismo nombre y tipo.
5. **Venta:**
   - Máximo de entradas por cliente (por ejemplo, 4).
   - Interruptor **"Alta demanda"**. Al prenderlo, se pide la **fecha de apertura de la venta**, que tiene que ser anterior a la fecha del evento.
   - Explicar qué pasa con la alta demanda: los compradores entran a una fila virtual y se habilitan por tandas.
6. **Revisar y publicar:**
   - Resumen de todo, con una vista previa de cómo se va a ver la card del evento en la cartelera del cliente.
   - Una **lista de verificación** de lo que falta para poder publicar: al menos un sector a la venta, ningún sector numerado sin asientos y la fecha en el futuro.
   - Si falta algo, el botón "Publicar" queda deshabilitado y la lista dice qué corregir y a qué paso ir.
   - Al publicar, avisar que el evento ya no se puede editar.

Un evento publicado se ve en modo solo lectura, con un aviso de que ya no se edita.

### 1.3 Detalle de un evento publicado

- Cabecera con la imagen, el nombre, el estado, la fecha y el lugar.
- Pestañas o secciones: **Resumen**, **Reporte**, **Personal de acceso** y **Actividad**.
- **Suspender:**
  - Confirmación que explica que se frena la venta y que las entradas vendidas siguen válidas.
- **Reanudar:**
  - Vuelve al estado que tenía antes, publicado o agotado.
  - Opcionalmente se elige una **fecha nueva** para reprogramar, que tiene que ser futura y posterior a la apertura de la venta.
  - Avisar que se notifica a los compradores del cambio.
- **Cancelar:**
  - Es definitivo.
  - La confirmación dice cuántas entradas se reintegran y que se avisa a cada comprador.
  - Pedir que se escriba el nombre del evento para confirmar.

### 1.4 Reporte de ventas

- Totales del evento: entradas vendidas, devueltas, ocupación (en %) y recaudación.
- Tabla por sector: capacidad, vendidas, devueltas, ocupación con barra y recaudación.
- Aclaraciones visibles:
  - La ocupación cuenta solo las entradas vendidas, no las reservas en curso.
  - La recaudación no incluye las entradas devueltas.
- Algún gráfico simple (ocupación por sector, o vendidas contra devueltas), con la paleta del design system.
- Botón para exportar.

### 1.5 Personal de acceso del evento

- Lista del personal de acceso de **su organización**, con nombre, email y si ya está asignado a este evento.
- Asignar y quitar con un toque. Si ya estaba asignado, no pasa nada ni da error.
- Aviso: solo el personal asignado puede escanear entradas en la puerta de este evento.
- Estado vacío: "Todavía no asignaste a nadie. Sin personal asignado, nadie puede validar entradas en la puerta".

### 1.6 Participantes

- Catálogo de artistas, equipos y disertantes con búsqueda y filtro por tipo.
- Crear, editar y borrar.
- No se puede borrar uno que está en algún evento: explicarlo y mostrar en cuáles está.

---

## 2. Backoffice del administrador

Gestión completa de la plataforma, sin estar atado a una organización.

### 2.1 Panel (inicio)

- Indicadores:
  - Devoluciones pendientes, como lo más urgente y con acceso directo.
  - Eventos a la venta.
  - Eventos suspendidos.
  - Ventas del día.
- Avisos operativos:
  - Reintegros que fallaron y se están reintentando.
  - Pagos que quedaron sin respuesta.
  - Eventos que finalizan hoy.

### 2.2 Devoluciones

Es la tarea diaria principal.

- **Listado:**
  - Paginado.
  - Filtrado por estado: pendiente (por defecto), aprobada, rechazada o cancelada.
  - Las más viejas primero.
- **Datos de cada fila:**
  - Número de entrada
  - Evento y fecha del evento
  - Sector y asiento
  - Cliente
  - Fecha del pedido
  - Monto a reintegrar
  - Cuánto falta para el evento
- **Detalle de una solicitud:**
  - Datos de la orden, el medio de pago y el historial de esa entrada, con el mismo estilo de "ticket" que usaste para la orden del cliente.
  - **Aprobar:** confirmación que explica que se libera el lugar y se reintegra el dinero al medio de pago original.
  - **Rechazar:** la entrada sigue vigente y no se reintegra nada.
- **Casos que la interfaz tiene que mostrar:**
  - **Entrada ya usada:** si la entrada se usó para ingresar mientras la solicitud esperaba, no se puede aprobar. Explicarlo.
  - **Pasarela sin respuesta:** si no responde al aprobar, la solicitud sigue pendiente. Mostrar "No pudimos confirmar el reintegro, reintentá" y avisar que reintentar no genera un reintegro doble.
  - **Evento cancelado:** las solicitudes pasan a "Cancelada", no a "Rechazada", porque esas entradas se reintegran igual.
- Selección múltiple para resolver varias a la vez, si te parece útil.

### 2.3 Eventos (de todas las organizaciones)

- Tabla de todos los eventos, en cualquier estado salvo los borradores ajenos, con filtros por organización, estado, ciudad y fechas.
- El administrador puede **suspender, reanudar y cancelar cualquier evento**, con las mismas confirmaciones que el organizador.
- Para cada evento: quién lo creó, de qué organización es, ventas y estado.

### 2.4 Lugares

ABM completo, solo del administrador.

- **Listado:**
  - Lugares por nombre, con filtro por ciudad.
  - De cada uno: dirección, capacidad total y cantidad de eventos.
- **Crear o editar un lugar:**
  - Nombre, dirección, ciudad, latitud y longitud.
  - Mapa para ubicarlo.
- **Sectores del lugar:**
  - Cada sector es **numerado** o **no numerado**:
    - **Numerado:** se cargan **filas**, cada una con su cantidad de asientos (por ejemplo, fila A con 14 asientos y fila B con 16), y la capacidad es la suma.
    - **No numerado:** se carga una capacidad máxima.
  - Vista previa del plano a medida que se cargan las filas, con los mismos asientos que ve el cliente.
  - Se pueden agregar filas y borrar asientos sueltos.
- **Validaciones visibles:**
  - Dos sectores no pueden llamarse igual en el mismo lugar.
  - Una fila no se puede repetir.
- **Bloqueos:**
  - Un lugar con eventos no se borra.
  - Un sector que vende un evento ya publicado no se borra ni cambia su capacidad.
  - Mostrarlos con el motivo y los eventos que lo usan.

### 2.5 Participantes

- El mismo catálogo que ve el organizador, con alta, edición y baja.

### 2.6 Usuarios y organizaciones

- **Usuarios:**
  - Lista con nombre, email, rol (cliente, organizador, administrador, personal de acceso) y organización.
  - Búsqueda y filtro por rol.
  - Dar de baja (es una baja lógica, no se borra) y cambiar el rol.
- **Precargar a alguien por email** con su rol y su organización: cuando esa persona entre con Google por primera vez, queda con ese rol.
- **Organizaciones:**
  - Lista y detalle, con sus organizadores, su personal de acceso y sus eventos.
  - Los datos sensibles (CUIT, cuenta bancaria) solo los ve el administrador.

---

## 3. App del personal de acceso (celular, en la puerta)

Lo usa una persona parada en el ingreso, apurada y con gente esperando. Tiene que ser obvio, rápido y legible a un metro de distancia. Mantené el design system, pero con todo más grande.

### 3.1 Elegir el evento

- Lista de los eventos de hoy y próximos a los que **está asignado**, con nombre, hora, lugar y puerta.
- Estado vacío: "No tenés eventos asignados. Pedile al organizador que te asigne".

### 3.2 Escanear

- La cámara ocupa casi toda la pantalla, con un recuadro guía.
- Arriba: el evento elegido y un contador de ingresos ("Ingresaron 3.412 de 5.000").
- Opción de **ingresar el código a mano** si la cámara no lee.
- Linterna.

### 3.3 Resultado del escaneo

Pantalla completa y enorme, distinguible de un vistazo y no solo por el color: también por el ícono y el texto. Usá los colores de éxito, error y advertencia que ya definiste. Después de unos segundos, o con un toque, vuelve a escanear.

- **Válida, puede pasar:** muestra el sector, la fila y el asiento (o "Campo · sin numerar") y el número de entrada. La entrada queda marcada como usada.
- **Ya usada:** "Esta entrada ya ingresó" con la hora en que se usó. Es clave: un QR no entra dos veces.
- **No es de este evento:** dice de qué evento es, si se puede saber.
- **Inválida:** no existe, fue anulada o fue reintegrada.
- **No estás asignado a este evento:** el personal no puede validar ahí.
- **Sin conexión:** no se pudo validar. Reintentar y no dejar pasar sin validar.

### 3.4 Historial del turno

- Últimos escaneos con hora, resultado y sector.
- Totales del turno: validadas y rechazadas.

---

## Datos de ejemplo

Usá los mismos eventos e imágenes que en la parte del cliente.

- **Organizaciones:** "Del Sur Producciones" y "Cultura Serrana".
- **Eventos:**
  - "Los Serranos en vivo": recital de alta demanda en el Estadio del Sur (Buenos Aires), 13 dic 2026, publicado. Sectores Campo (no numerado, $45.000), Platea baja ($68.000), Platea alta (agotada, $55.000) y Palco VIP ($120.000).
  - "Peña folklórica serrana": Teatro de la Sierra (Tandil), publicado.
  - "Hamlet": teatro en Tandil, publicado.
  - "Clásico del Sur": partido, agotado.
  - Un festival en borrador, un evento suspendido, uno cancelado y uno finalizado.
- **Personas:**
  - Organizadores: Martín Díaz (Del Sur Producciones) y Lucía Ferreyra (Cultura Serrana).
  - Administrador: Sofía Rey.
  - Personal de acceso: Diego Paz (Del Sur Producciones).
  - Cliente: Ana García.
- **Devoluciones pendientes:**
  - Entrada TY-00456 de Hamlet, platea fila C asiento 5, $26.000.
  - Dos entradas más de otros eventos.

## Qué entregar

- Las pantallas de los tres backoffices, navegables entre sí y con la parte del cliente.
- Los estados de cada pantalla: vacío, error y sin permiso.
- Las confirmaciones de las acciones destructivas.
- Todos los resultados del escaneo de acceso.
- Todo con el mismo design system de la parte del cliente.
