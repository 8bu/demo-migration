/**
 * Composable for managing shared state between Shell and Legacy apps
 *
 * This provides reactive access to the global state that's shared
 * across the Module Federation boundary via Web Components
 */

import type { Ref } from 'vue'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface Preferences {
  theme: 'light' | 'dark'
  locale: string
}

interface SharedState {
  auth: AuthState
  preferences: Preferences
}

type EventCallback = (data: unknown) => void

interface EventBus {
  on: (event: string, callback: EventCallback) => () => void
  off: (event: string, callback: EventCallback) => void
  emit: (event: string, data?: unknown) => void
}

const createDefaultState = (): SharedState => ({
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  preferences: {
    theme: 'light',
    locale: 'en',
  },
})

const createEventBus = (): EventBus => {
  const events = new Map<string, Set<EventCallback>>()

  return {
    on(event: string, callback: EventCallback) {
      if (!events.has(event)) {
        events.set(event, new Set())
      }
      events.get(event)!.add(callback)
      return () => events.get(event)?.delete(callback)
    },
    off(event: string, callback: EventCallback) {
      events.get(event)?.delete(callback)
    },
    emit(event: string, data?: unknown) {
      events.get(event)?.forEach((cb) => cb(data))
    },
  }
}

export function useSharedState() {
  const state: Ref<SharedState> = ref(createDefaultState())

  // Initialize global state on client
  const initializeState = () => {
    if (typeof window === 'undefined') return

    // Initialize event bus
    if (!window.__MF_EVENT_BUS__) {
      window.__MF_EVENT_BUS__ = createEventBus()
    }

    // Initialize shared state
    if (!window.__MF_SHARED_STATE__) {
      window.__MF_SHARED_STATE__ = createDefaultState()
    }

    // Sync local state with global state
    state.value = { ...window.__MF_SHARED_STATE__ }

    // Listen for state changes from legacy app
    window.__MF_EVENT_BUS__.on('state:changed', (newState) => {
      if (newState && typeof newState === 'object') {
        state.value = { ...state.value, ...(newState as Partial<SharedState>) }
      }
    })
  }

  // Update auth state
  const setAuth = (auth: Partial<AuthState>) => {
    state.value.auth = { ...state.value.auth, ...auth }

    if (typeof window !== 'undefined' && window.__MF_SHARED_STATE__) {
      window.__MF_SHARED_STATE__.auth = state.value.auth
      window.__MF_EVENT_BUS__?.emit('state:changed', window.__MF_SHARED_STATE__)
    }
  }

  // Login user
  const login = (user: User, token: string) => {
    setAuth({
      user,
      token,
      isAuthenticated: true,
    })
  }

  // Logout user
  const logout = () => {
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  }

  // Update preferences
  const setPreferences = (prefs: Partial<Preferences>) => {
    state.value.preferences = { ...state.value.preferences, ...prefs }

    if (typeof window !== 'undefined' && window.__MF_SHARED_STATE__) {
      window.__MF_SHARED_STATE__.preferences = state.value.preferences
      window.__MF_EVENT_BUS__?.emit('state:changed', window.__MF_SHARED_STATE__)
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    setPreferences({
      theme: state.value.preferences.theme === 'light' ? 'dark' : 'light',
    })
  }

  // Emit custom event to legacy app
  const emitToLegacy = (event: string, data?: unknown) => {
    if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
      window.__MF_EVENT_BUS__.emit(event, data)
    }
  }

  // Subscribe to events from legacy app
  const onLegacyEvent = (event: string, callback: EventCallback) => {
    if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
      return window.__MF_EVENT_BUS__.on(event, callback)
    }
    return () => {}
  }

  // Initialize on mount
  onMounted(() => {
    initializeState()
  })

  return {
    state: readonly(state),
    isAuthenticated: computed(() => state.value.auth.isAuthenticated),
    currentUser: computed(() => state.value.auth.user),
    theme: computed(() => state.value.preferences.theme),
    locale: computed(() => state.value.preferences.locale),
    login,
    logout,
    setAuth,
    setPreferences,
    toggleTheme,
    emitToLegacy,
    onLegacyEvent,
  }
}
