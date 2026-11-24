import { Check } from 'lucide-react'
import { Button } from '@/shared/components/atoms/Button'
import { PageTitle } from '@/shared/components/atoms/PageTitle'
import { LoginRequired } from '@/shared/components/molecules/LoginRequired/LoginRequired'
import { CitySelectSection } from '../components/CitySelectSection'
import { EventTypeChips } from '../components/EventTypeChips'
import { FavoriteParticipantsSection } from '../components/FavoriteParticipantsSection'
import { PreferencesForbiddenView } from '../components/PreferencesForbiddenView'
import { PreferencesLoadError } from '../components/PreferencesLoadError'
import { PreferencesSkeleton } from '../components/PreferencesSkeleton'
import { usePreferencesPageController } from '../hooks/usePreferencesPageController'

export function PreferencesPage() {
  const {
    isLoading,
    isLoginRequired,
    isForbidden,
    loadError,
    retryLoad,
    selectedTypes,
    toggleEventType,
    favoriteParticipants,
    favoriteSuggestions,
    isAddingFavorite,
    favoriteQuery,
    startAddingFavorite,
    stopAddingFavorite,
    setFavoriteQuery,
    addFavorite,
    removeFavorite,
    cities,
    city,
    setCity,
    save,
    isSaving,
    isSavedBannerVisible,
    saveError,
  } = usePreferencesPageController()

  return (
    <div className="mx-auto flex w-full max-w-220 flex-col gap-6 px-4 pt-10 pb-18 md:px-7">
      <div className="flex flex-col gap-2.5">
        <PageTitle>
          Preferencias<span className="text-accent">.</span>
        </PageTitle>
        <p className="text-[17px] text-muted">
          Contanos qué te gusta y te acercamos los eventos que van con vos.
        </p>
      </div>

      {isLoading && <PreferencesSkeleton />}

      {!isLoading && isLoginRequired && (
        <LoginRequired message="Iniciá sesión para ver tus preferencias." />
      )}

      {!isLoading && isForbidden && <PreferencesForbiddenView />}

      {!isLoading && !isLoginRequired && !isForbidden && loadError && (
        <PreferencesLoadError message={loadError} onRetry={retryLoad} />
      )}

      {!isLoading && !isLoginRequired && !isForbidden && !loadError && (
        <form
          aria-label="Tus preferencias"
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
          className="rounded-2xl border border-line bg-surface"
        >
          <EventTypeChips selectedTypes={selectedTypes} onToggle={toggleEventType} />

          <FavoriteParticipantsSection
            favorites={favoriteParticipants}
            onRemove={removeFavorite}
            onStartAdd={startAddingFavorite}
            search={{
              isOpen: isAddingFavorite,
              query: favoriteQuery,
              suggestions: favoriteSuggestions,
              onQueryChange: setFavoriteQuery,
              onAdd: addFavorite,
              onClose: stopAddingFavorite,
            }}
          />

          <CitySelectSection cities={cities} city={city} onChange={setCity} />

          <section className="flex flex-wrap items-center gap-3.5 border-t border-line px-4 py-5 md:px-6.5 md:py-6">
            <Button type="submit" variant="accent" size="lg" disabled={isSaving}>
              {isSaving ? 'Guardando…' : 'Guardar preferencias'}
            </Button>

            {isSavedBannerVisible && (
              <span
                role="status"
                className="flex items-center gap-1.5 text-sm font-semibold text-success-ink"
              >
                <Check aria-hidden className="size-4" strokeWidth={2.6} />
                Guardamos tus preferencias
              </span>
            )}

            {saveError && (
              <p role="alert" className="text-sm font-medium text-error-ink">
                {saveError}
              </p>
            )}
          </section>
        </form>
      )}
    </div>
  )
}
