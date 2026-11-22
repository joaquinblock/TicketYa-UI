import { Search } from 'lucide-react'
import { useEventSearchBox } from './useEventSearchBox'

export function EventSearchBox() {
  const { text, setText } = useEventSearchBox()

  return (
    <form role="search" className="flex max-w-155 gap-2 rounded-card bg-surface p-2 shadow-2xl">
      <label className="flex min-h-13 flex-1 items-center gap-2.5 px-3 text-subtle">
        <Search aria-hidden className="size-5" />
        <span className="sr-only">Buscar eventos</span>
        <input
          type="search"
          autoComplete="off"
          placeholder="Artista, equipo, obra o disertante"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="w-full min-w-0 bg-transparent text-control text-ink outline-none"
        />
      </label>
    </form>
  )
}
