# 8: Iniciar sesión con Google

**Tipo:** Story
**Estado:** terminado
**Funcionalidad:** Login y sesión (épica #1)

## Historia

Como **cliente**,
quiero **iniciar sesión con mi cuenta de Google justo cuando voy a reservar, sin salir de la pantalla**,
para **comprar mis entradas sin crear una cuenta ni cargar mis datos a mano, y sin perder los lugares que ya elegí**.

## Contexto

Hoy no hay login. En Lugares, reservar sin sesión muestra el link "Iniciar sesión (falta login)" (#21, CA5). Pago, Fila virtual, Mis entradas y Preferencias entran solas en desarrollo con el cliente del seeder (`dev-login`). Esta story agrega el modal "Ingresá a TicketYa" del mockup y lo usa cada pantalla que pide sesión. Consume `POST /api/auth/google` y `POST /api/auth/dev-login` (US-AUTH-03, cerrada) y `GET /api/users/me` (US-AUTH-06 `joaquinblock/TicketYa#192`, **abierta: bloquea esta story**).

## Criterios de aceptación

- **CA1: Entrar desde el header**
  Dado que no tengo sesión
  Cuando toco "Ingresar" en el header y entro con Google (o, en desarrollo, con un usuario de prueba)
  Entonces el modal se cierra, el header muestra mi nombre en lugar de "Ingresar",
  Y cada request que sale después lleva mi token.
- **CA2: Mientras se canjea el token**
  Dado que elegí mi cuenta de Google
  Mientras la app canjea el token con el backend
  Entonces los botones del modal se deshabilitan y "Continuar con Google" dice "Ingresando…".
- **CA3: Google o el backend rechazan el login**
  Dado que el canje falla
  Entonces el modal sigue abierto, sigo sin sesión y veo, según el error:
  - 401 `invalid_credentials`: "No pudimos verificar tu cuenta de Google. Probá de nuevo."
  - 403 `user_disabled`: "Tu cuenta está dada de baja."
  - 409 `data_conflict`: "Tu email ya está vinculado a otra cuenta de Google."
  - 503 o falla de red: "No pudimos iniciar sesión. Probá de nuevo en unos minutos."
- **CA4: Reservar sin sesión**
  Dado que elegí lugares en Lugares y no tengo sesión
  Cuando toco "Reservar y pagar"
  Entonces se abre el modal y mi selección sigue en "Tu selección",
  Y si entro, la reserva se crea sola y voy a Pago,
  Y si cierro el modal, sigo en Lugares con la selección y con "Reservar y pagar" habilitado.
- **CA5: Pantallas que piden sesión**
  Dado que no tengo sesión
  Cuando entro a Mis entradas, a la Fila virtual o a Preferencias
  Entonces se abre el modal, y detrás la pantalla dice "Iniciá sesión para ver tus entradas." (o "…para hacer la fila.", "…para ver tus preferencias.") con el botón "Ingresar",
  Y si entro, la pantalla se carga sin recargar la página.
- **CA6: Cerrar sesión**
  Dado que tengo sesión
  Cuando toco mi nombre en el header
  Entonces vuelvo a Inicio, el header muestra "Ingresar"
  Y los requests que salen después ya no llevan token.

## Requisitos no funcionales

- A 360 px, el modal ocupa el ancho con margen y no tiene scroll horizontal (`MainMobile`).
- "Continuar con Google" es la única acción destacada del modal y mide 50 px de alto, como en el mockup (Fitts, Von Restorff). En desarrollo, la entrada con usuario de prueba va debajo, con estilo secundario.
- El login es un modal sobre la pantalla actual y no una página: el cliente no pierde lo que estaba haciendo y vuelve exactamente ahí (Zeigarnik, Nielsen 6). Se pide sesión recién al reservar, no al mirar el mapa (Tesler).
- "Continuar con Google" es el botón que el usuario ya conoce de otros sitios (Jakob).
- El modal se cierra con la X, con Escape y tocando el fondo; el foco queda atrapado adentro mientras está abierto y vuelve al botón que lo abrió al cerrarse (Nielsen 3, figura y fondo).
- Mientras canjea, el botón muestra que está trabajando y no se puede tocar dos veces (Doherty, Nielsen 1).
- Cada error es un `role="alert"` dentro del modal, sin códigos (Nielsen 2 y 9).

## Fuera de alcance

- El cuestionario de preferencias cuando `newUser` es `true`: va con Perfil.
- La renovación del token. El JWT dura 30 minutos y el backend no tiene refresh.
- Las pantallas de organizador y personal de acceso. Entran con el mismo botón, pero sus pantallas no existen todavía.
- Notificaciones: cuando se haga, usa el mismo mecanismo de CA5 para pedir sesión.
- El popup de Google en sí. Es un script de Google y se verifica a mano con un client id real.

## Notas técnicas

- Feature `auth`. El modal se puede abrir desde cualquier feature (header, `purchase`, `queue`, `tickets`, `preferences`).
- Google Identity Services, con `TICKETYA_GOOGLE_CLIENT_ID` en el `.env` (el mismo `GOOGLE_CLIENT_ID` del backend, que no es secreto). Sin la variable, el botón de Google no se muestra y en desarrollo queda el usuario de prueba.
- `dev-login` solo existe con `import.meta.env.DEV`. Reemplaza a los cuatro `ensureDevClientSession` de `purchase`, `queue`, `tickets` y `preferences`, que se borran.
- Tests contra el gateway real: el login correcto se prueba con `dev-login`, y CA3 con un ID token falso que el backend rechaza con 401.
- CA4 reemplaza el link de #21 CA5 ("Iniciar sesión (falta login)"). Ese test está commiteado: el cambio se acuerda en el tracker.
- Mockup: `Main` y `MainMobile`, modal "Ingresá a TicketYa" y header con sesión ("Ana García").

## Definition of Done

- [ ] Cada criterio tiene un test que pasa
- [ ] Login con Google verificado a mano con un client id real
- [ ] Checklist visual contra el mockup, en escritorio y a 360 px
- [ ] Review aprobada
- [ ] Documentación afectada actualizada
