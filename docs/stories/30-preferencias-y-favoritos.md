# 30: Preferencias y favoritos

**Tipo:** Story
**Estado:** aprobado
**Funcionalidad:** Perfil (épica #10 Cliente, página #29)

## Historia

Como **cliente**,
quiero **configurar los tipos de eventos que me gustan, mis participantes favoritos y mi ciudad desde Preferencias**,
para **recibir sugerencias de eventos acordes a mis gustos y avisos cuando mis favoritos publiquen fechas en mi ciudad**.

## Contexto

El cliente necesita un lugar donde indicar sus gustos para personalizar las recomendaciones (`US-REC-02`) y los avisos de artistas favoritos (`US-NOT-03`). Hoy la página `/preferencias` muestra solo el título de la sección; el backend (`recommendation-service`, `US-REC-01`) ya expone `GET /api/preferences/me` y `PUT /api/preferences/me`, y `event-service` expone el catálogo de participantes y lugares.

## Criterios de aceptación

- **CA1: Cargar las preferencias guardadas**
  Dado que soy un cliente autenticado y entro a `/preferencias`
  Cuando la página está cargando mis preferencias
  Entonces veo un indicador de carga
  Y al completarse la carga veo seleccionados los tipos de evento, los chips de mis participantes favoritos (con su nombre) y mi ciudad guardada (o sin selección si nunca guardé preferencias).

- **CA2: Elegir tipos de evento, favoritos y ciudad y guardar**
  Dado que estoy en `/preferencias`
  Cuando activo o desactivo chips en "¿Qué planes te gustan?" (Recitales, Festivales, Teatro, Deportes, Conferencias), agrego o quito participantes en "Tus favoritos", elijo una ciudad o "Sin preferencia" en "Tu ciudad" y toco "Guardar preferencias"
  Entonces el botón queda deshabilitado mientras se envía el pedido
  Y al confirmarse veo el mensaje "Guardamos tus preferencias", que desaparece si vuelvo a modificar algún campo, y los cambios persisten al recargar la página.

- **CA3: Buscar y agregar participantes favoritos**
  Dado que toco "Agregar favorito" en "Tus favoritos"
  Cuando se abre el buscador
  Entonces veo sugerencias iniciales de participantes que todavía no están en mis favoritos
  Y al escribir un texto se filtran por nombre; si no hay coincidencias veo "No encontramos a nadie con ese nombre.".

- **CA4: Error al cargar o al guardar**
  Dado que ocurre una falla de red o del servidor al cargar o al guardar mis preferencias
  Cuando la operación falla
  Entonces veo un mensaje entendible en español (con opción de reintentar si falló la carga inicial)
  Y si falló el guardado, el botón vuelve a habilitarse sin perder los cambios que había hecho en pantalla.

- **CA5: Acceso sin sesión o con rol distinto de cliente**
  Dado que intento usar `/preferencias` sin sesión iniciada o con un usuario que no tiene rol de cliente
  Cuando la página consulta las preferencias o el servidor responde `403 forbidden`
  Entonces veo un mensaje claro indicando que esta sección es solo para clientes autenticados, sin errores sin capturar.

## Requisitos no funcionales

- A 360 px de ancho la página, los chips y el buscador de favoritos se usan sin scroll horizontal ni controles cortados, siguiendo `PerfilMobile`.
- Mientras se guarda, el botón "Guardar preferencias" permanece deshabilitado para evitar envíos duplicados.
- Los chips de tipos de evento seleccionados se distinguen con ícono de tilde y estado `aria-pressed`, no solo con color.

## Fuera de alcance

- Sección "Notificaciones" debajo de Preferencias (issue `#31`).
- Sección "Para vos" en la pantalla de inicio (issue `#13`, `US-REC-02`).
- Alta o edición de participantes desde esta pantalla.

## Notas técnicas

- Feature: `preferences` (`PreferencesPage`, ruta `/preferencias`).
- Backend (`C:\Projects\TicketYa`): `GET /api/preferences/me` y `PUT /api/preferences/me` (`US-REC-01` en `recommendation-service`), `GET /api/participants` y `GET /api/participants/{id}` (`event-service`), y ciudades desde `GET /api/venues`.
- `recommendation-service` acepta los 5 tipos `CONCERT`, `FESTIVAL`, `THEATER`, `SPORTS`, `CONFERENCE` (no existe `OTHER` en el backend, a diferencia del placeholder del mockup).
- Mockup: `Perfil` y `PerfilMobile` (`MOCKUP.md` / `project/Perfil.dc.html` y `project/PerfilMobile.dc.html`).

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
