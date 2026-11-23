import { Check } from 'lucide-react'
import { EVENT_TYPES } from '@/shared/constants/event.constants'
import { cn } from '@/shared/lib/cn'
import type { EventType } from '@/shared/types/event.types'
import { PREFERENCES_EVENT_TYPE_LABEL } from '../constants/preferences.constants'

type EventTypeChipsProps = {
  selectedTypes: EventType[]
  onToggle: (type: EventType) => void
}

export function EventTypeChips({ selectedTypes, onToggle }: EventTypeChipsProps) {
  return (
    <section
      aria-labelledby="pref-types-heading"
      className="flex flex-col gap-3.5 px-4 py-5 md:px-6.5 md:py-6"
    >
      <h2 id="pref-types-heading" className="text-[19px]">
        ¿Qué planes te gustan?
      </h2>
      <p className="-mt-2 text-sm text-subtle">Podés elegir más de uno.</p>
      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="pref-types-heading">
        {EVENT_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type)
          return (
            <button
              key={type}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(type)}
              className={cn(
                'inline-flex min-h-10.5 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-ink',
                isSelected && 'border-accent bg-accent',
              )}
            >
              {isSelected && <Check aria-hidden className="size-3.75" strokeWidth={3} />}
              {PREFERENCES_EVENT_TYPE_LABEL[type]}
            </button>
          )
        })}
      </div>
    </section>
  )
}
