import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getCities } from '@/features/catalog/services/venues.service'
import { getErrorMessage } from '@/shared/lib/http/errorMessage'
import type { EventType, Participant } from '@/shared/types/event.types'
import { FAVORITE_SUGGESTIONS_LIMIT } from '../constants/preferences.constants'
import { preferencesKeys } from '../lib/preferences.queryKeys'
import {
  ensureDevClientSession,
  getMyPreferences,
  getParticipants,
  updateMyPreferences,
} from '../services/preferences.service'
import type { Preferences } from '../types/preferences.types'
import { isPreferencesForbiddenError } from '../utils/preferencesErrors'

const EMPTY_PREFERENCES: Preferences = { eventTypes: [], participantIds: [], city: null }
const EMPTY_PARTICIPANTS: Participant[] = []

/** Orquesta la carga, edición y guardado de las preferencias del cliente en `/preferencias`. */
export function usePreferencesPageController() {
  const queryClient = useQueryClient()

  const preferencesQuery = useQuery({
    queryKey: preferencesKeys.me(),
    retry: false,
    queryFn: async () => {
      await ensureDevClientSession()
      return getMyPreferences()
    },
  })

  const participantsQuery = useQuery({
    queryKey: preferencesKeys.participants(),
    queryFn: () => getParticipants(),
    staleTime: 60_000,
  })

  const citiesQuery = useQuery({
    queryKey: preferencesKeys.cities(),
    queryFn: getCities,
    staleTime: 60_000,
  })

  const [draft, setDraft] = useState<Preferences | null>(null)
  const [isSavedBannerVisible, setIsSavedBannerVisible] = useState(false)
  const [isAddingFavorite, setIsAddingFavorite] = useState(false)
  const [favoriteQuery, setFavoriteQuery] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)

  const saveMutation = useMutation({
    mutationFn: async (next: Preferences) => {
      await ensureDevClientSession()
      return updateMyPreferences(next)
    },
    meta: { handlesErrorInline: true },
    onSuccess: (saved) => {
      queryClient.setQueryData(preferencesKeys.me(), saved)
      setDraft(saved)
      setSaveError(null)
      setIsSavedBannerVisible(true)
      setIsAddingFavorite(false)
    },
    onError: (error) => {
      setSaveError(getErrorMessage(error, 'No pudimos guardar tus preferencias.'))
      setIsSavedBannerVisible(false)
    },
  })

  const currentPreferences = draft ?? preferencesQuery.data ?? EMPTY_PREFERENCES

  const updateDraft = (updater: (current: Preferences) => Preferences) => {
    setDraft((current) => updater(current ?? preferencesQuery.data ?? EMPTY_PREFERENCES))
    setIsSavedBannerVisible(false)
    setSaveError(null)
  }

  const toggleEventType = (type: EventType) => {
    updateDraft((current) => {
      const exists = current.eventTypes.includes(type)
      return {
        ...current,
        eventTypes: exists
          ? current.eventTypes.filter((item) => item !== type)
          : [...current.eventTypes, type],
      }
    })
  }

  const addFavorite = (participantId: number) => {
    updateDraft((current) =>
      current.participantIds.includes(participantId)
        ? current
        : { ...current, participantIds: [...current.participantIds, participantId] },
    )
    setFavoriteQuery('')
  }

  const removeFavorite = (participantId: number) => {
    updateDraft((current) => ({
      ...current,
      participantIds: current.participantIds.filter((id) => id !== participantId),
    }))
  }

  const setCity = (city: string | null) => {
    updateDraft((current) => ({ ...current, city }))
  }

  const participants = participantsQuery.data ?? EMPTY_PARTICIPANTS
  const participantsById = useMemo(
    () => new Map<number, Participant>(participants.map((item) => [item.id, item])),
    [participants],
  )

  const favoriteParticipants = useMemo(
    () =>
      currentPreferences.participantIds.map(
        (id) => participantsById.get(id) ?? { id, name: `Participante #${id}`, type: 'ARTIST' },
      ),
    [currentPreferences.participantIds, participantsById],
  )

  const favoriteSuggestions = useMemo(() => {
    const normalized = favoriteQuery.trim().toLowerCase()
    return participants
      .filter(
        (item) =>
          !currentPreferences.participantIds.includes(item.id) &&
          (normalized === '' || item.name.toLowerCase().includes(normalized)),
      )
      .slice(0, FAVORITE_SUGGESTIONS_LIMIT)
  }, [participants, currentPreferences.participantIds, favoriteQuery])

  const isLoading = preferencesQuery.isPending
  const isForbidden =
    (preferencesQuery.isError && isPreferencesForbiddenError(preferencesQuery.error)) ||
    (saveMutation.isError && isPreferencesForbiddenError(saveMutation.error))
  const loadError =
    preferencesQuery.isError && !isPreferencesForbiddenError(preferencesQuery.error)
      ? getErrorMessage(preferencesQuery.error, 'No pudimos cargar tus preferencias.')
      : null

  return {
    isLoading,
    isForbidden,
    loadError,
    retryLoad: () => void preferencesQuery.refetch(),
    selectedTypes: currentPreferences.eventTypes,
    toggleEventType,
    favoriteParticipants,
    favoriteSuggestions,
    isAddingFavorite,
    favoriteQuery,
    startAddingFavorite: () => {
      setIsAddingFavorite(true)
      setFavoriteQuery('')
    },
    stopAddingFavorite: () => setIsAddingFavorite(false),
    setFavoriteQuery,
    addFavorite,
    removeFavorite,
    cities: citiesQuery.data ?? [],
    city: currentPreferences.city,
    setCity,
    save: () => {
      if (saveMutation.isPending) return
      saveMutation.mutate(currentPreferences)
    },
    isSaving: saveMutation.isPending,
    isSavedBannerVisible,
    saveError,
  }
}
