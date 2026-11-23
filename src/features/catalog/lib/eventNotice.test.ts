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
})
