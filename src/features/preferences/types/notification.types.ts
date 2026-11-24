/** Un aviso de la bandeja, como lo devuelve `GET /api/notifications`. */
export type Notification = {
  id: number
  title: string
  body: string
  createdAt: string
  read: boolean
}
