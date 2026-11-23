import { Plus, X } from 'lucide-react'
import { Input } from '@/shared/components/atoms/Input'
import type { Participant } from '@/shared/types/event.types'

type FavoriteSearchState = {
  isOpen: boolean
  query: string
  suggestions: Participant[]
  onQueryChange: (query: string) => void
  onAdd: (participantId: number) => void
  onClose: () => void
}

type FavoriteParticipantsSectionProps = {
  favorites: Participant[]
  onRemove: (participantId: number) => void
  onStartAdd: () => void
  search: FavoriteSearchState
}

export function FavoriteParticipantsSection({
  favorites,
  onRemove,
  onStartAdd,
  search,
}: FavoriteParticipantsSectionProps) {
  return (
    <section
      aria-labelledby="pref-favorites-heading"
      className="flex flex-col gap-3.5 border-t border-line px-4 py-5 md:px-6.5 md:py-6"
    >
      <h2 id="pref-favorites-heading" className="text-[19px]">
        Tus favoritos
      </h2>
      <p className="-mt-2 text-sm text-subtle">
        Artistas, equipos y disertantes. Te avisamos cuando tengan un evento nuevo.
      </p>

      <div className="flex flex-wrap gap-2">
        {favorites.map((favorite) => (
          <span
            key={favorite.id}
            className="inline-flex min-h-10.5 items-center gap-1 rounded-full bg-accent pr-1.5 pl-4 text-sm font-semibold text-ink"
          >
            {favorite.name}
            <button
              type="button"
              aria-label={`Quitar ${favorite.name} de favoritos`}
              onClick={() => onRemove(favorite.id)}
              className="grid size-7.5 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-ink hover:bg-ink/10"
            >
              <X aria-hidden className="size-3.5" strokeWidth={2.6} />
            </button>
          </span>
        ))}

        {!search.isOpen && (
          <button
            type="button"
            onClick={onStartAdd}
            className="inline-flex min-h-10.5 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-line-strong bg-transparent px-4 text-sm font-semibold text-muted hover:border-ink hover:text-ink"
          >
            <Plus aria-hidden className="size-3.5" strokeWidth={2.6} />
            Agregar favorito
          </button>
        )}
      </div>

      {search.isOpen && <FavoriteSearchBox search={search} />}
    </section>
  )
}

function FavoriteSearchBox({ search }: { search: FavoriteSearchState }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-footer p-3.5">
      <label htmlFor="favq" className="text-[13px] font-semibold text-ink">
        Buscá un artista, equipo o disertante
      </label>
      <Input
        id="favq"
        value={search.query}
        onChange={(event) => search.onQueryChange(event.target.value)}
        placeholder="Ej.: Los Serranos"
        autoComplete="off"
      />
      <div className="flex flex-wrap gap-2">
        {search.suggestions.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => search.onAdd(candidate.id)}
            className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-line bg-surface px-3 text-label font-medium text-ink hover:border-ink"
          >
            + {candidate.name}
          </button>
        ))}
        {search.suggestions.length === 0 && (
          <span className="text-label text-subtle">No encontramos a nadie con ese nombre.</span>
        )}
      </div>
      <button
        type="button"
        onClick={search.onClose}
        className="min-h-8 cursor-pointer self-start border-0 bg-transparent p-0 text-label font-medium text-muted underline hover:text-ink"
      >
        Listo
      </button>
    </div>
  )
}
