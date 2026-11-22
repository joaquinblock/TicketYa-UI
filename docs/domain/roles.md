# Roles de usuario

Los únicos roles válidos para el "Como..." de una story. Son los roles del `AuthSeeder` del backend (`docs/architecture/permissions.md` de TicketYa).

| Rol                | Quién es                             | Qué hace en el sistema                                                                           |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Cliente            | Persona que va a eventos             | Busca eventos, elige sus lugares, paga, ve sus entradas con el QR y pide devoluciones            |
| Organizador        | Productor o club que publica eventos | Arma, publica y suspende sus eventos, y mira el reporte de ventas                                |
| Administrador      | Quien opera la plataforma            | Administra lugares, sectores y participantes, suspende o cancela eventos y resuelve devoluciones |
| Personal de acceso | Quien controla el ingreso al evento  | Escanea el QR de cada entrada en la puerta                                                       |

**No son roles:** sistema, desarrollador, nombres de servicios.
