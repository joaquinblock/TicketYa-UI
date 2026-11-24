export const preferencesKeys = {
  all: ['preferences'] as const,
  me: () => [...preferencesKeys.all, 'me'] as const,
  participants: () => [...preferencesKeys.all, 'participants'] as const,
  cities: () => [...preferencesKeys.all, 'cities'] as const,
  notifications: () => [...preferencesKeys.all, 'notifications'] as const,
} as const
