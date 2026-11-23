import { describe, expect, it } from 'vitest'
import type { EventDetail } from '../types/catalog.types'
import { getEventNotice } from './eventNotice'

type NoticeInput = Pick<EventDetail, 'status' | 'highDemand' | 'saleStart'>

/** Hora local, sin zona, como las fechas que manda el backend. */
const NOW = new Date('2026-11-22T12:00:00')
const PAST_SALE_START = '2026-11-20T10:00:00'

const onSale = (overrides: Partial<NoticeInput> = {}): NoticeInput => ({
  status: 'PUBLISHED',
  highDemand: false,
  saleStart: null,
  ...overrides,
})

describe('getEventNotice: a la venta', () => {
  it.each([null, PAST_SALE_START])(
    'sin alta demanda y con la venta abierta (apertura %s) no tiene aviso',
    (saleStart) => {
      expect(getEventNotice(onSale({ saleStart }), NOW)).toBeUndefined()
    },
  )

  it('de alta demanda y con la venta abierta avisa que se entra a la fila por tandas', () => {
    expect(
      getEventNotice(onSale({ highDemand: true, saleStart: PAST_SALE_START }), NOW),
    ).toMatchObject({
      title: 'Alta demanda · fila virtual',
      message:
        'La venta ya abrió. Entrá a la fila para asegurar tu lugar: te habilitamos por tandas y tenés 10 minutos para reservar.',
    })
  })

  it('con la apertura en el futuro avisa que la venta no empezó y cuándo abre', () => {
    expect(getEventNotice(onSale({ saleStart: '2026-12-12T12:00:00' }), NOW)).toMatchObject({
      title: 'La venta todavía no empezó',
      message: 'Abre el 12 dic 2026 · 12:00 hs. Ese día vas a poder entrar a la fila.',
    })
  })

  it('con la apertura justo ahora la venta ya está abierta', () => {
    expect(getEventNotice(onSale({ saleStart: '2026-11-22T12:00:00' }), NOW)).toBeUndefined()
  })

  it('de alta demanda y con la apertura en el futuro avisa solo que la venta no empezó', () => {
    expect(
      getEventNotice(onSale({ highDemand: true, saleStart: '2026-12-12T12:00:00' }), NOW),
    ).toMatchObject({ kind: 'SALE_NOT_STARTED', title: 'La venta todavía no empezó' })
  })
})
