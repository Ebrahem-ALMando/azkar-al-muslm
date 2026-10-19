export const STORAGE = {
  onboarded: 'azkar-onboarded',
  visited: 'azkar-visited',
  displayName: 'azkar-display-name',
  city: 'azkar-city',
  themeId: 'azkar-theme-id',
  dark: 'azkar-dark',
  sessionSplash: 'azkar-session-splash',
} as const

export type UserPreferences = {
  displayName: string
  city: string
  themeId: string
}

export function readPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return { displayName: '', city: '', themeId: 'emerald' }
  }
  return {
    displayName: window.localStorage.getItem(STORAGE.displayName) ?? '',
    city: window.localStorage.getItem(STORAGE.city) ?? '',
    themeId: window.localStorage.getItem(STORAGE.themeId) ?? 'emerald',
  }
}

export function writePreferences(partial: Partial<UserPreferences>) {
  if (typeof window === 'undefined') return
  if (partial.displayName !== undefined) {
    window.localStorage.setItem(STORAGE.displayName, partial.displayName)
  }
  if (partial.city !== undefined) {
    window.localStorage.setItem(STORAGE.city, partial.city)
  }
  if (partial.themeId !== undefined) {
    window.localStorage.setItem(STORAGE.themeId, partial.themeId)
  }
}

export function isOnboarded() {
  if (typeof window === 'undefined') return true
  return (
    window.localStorage.getItem(STORAGE.onboarded) === 'true' ||
    window.localStorage.getItem(STORAGE.visited) === 'true'
  )
}

export function markOnboarded() {
  window.localStorage.setItem(STORAGE.onboarded, 'true')
  window.localStorage.setItem(STORAGE.visited, 'true')
}

export function clearOnboardingFlag() {
  window.localStorage.removeItem(STORAGE.onboarded)
  window.localStorage.removeItem(STORAGE.visited)
}
