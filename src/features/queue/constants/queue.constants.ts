export const QUEUE_POLL_INTERVAL_MS = 5_000
export const QUEUE_BATCH_SIZE = 100
export const QUEUE_BATCH_SECONDS = 30
export const QUEUE_SEEDER_CLIENT_USER_ID = 1

export const QUEUE_RULES = [
  { number: '01', text: 'Si volvés a entrar, conservás tu lugar.', icon: 'check' },
  { number: '02', text: 'Cuando te habiliten, tenés 10 minutos para reservar.', icon: 'clock' },
  { number: '03', text: 'Si se te pasa la ventana, volvés al final.', icon: 'none' },
] as const
