import { Check, Clock } from 'lucide-react'
import { QUEUE_RULES } from '../constants/queue.constants'

export function QueueRulesList() {
  return (
    <ol className="my-6.5 mb-5.5 list-none p-0 text-left">
      {QUEUE_RULES.map((rule) => (
        <li
          key={rule.number}
          className="flex items-center gap-3.5 border-t border-line py-3.5 text-sm"
        >
          <b className="font-mono text-xs font-medium text-subtle">{rule.number}</b>
          <span className="flex-1 text-ink">{rule.text}</span>
          {rule.icon === 'check' && (
            <Check aria-hidden className="size-4.5 flex-none text-[#298452]" strokeWidth={2.5} />
          )}
          {rule.icon === 'clock' && (
            <Clock aria-hidden className="size-4.5 flex-none text-[#298452]" strokeWidth={2} />
          )}
        </li>
      ))}
    </ol>
  )
}
