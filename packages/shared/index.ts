/**
 * Shared utilities and types for Module Federation monorepo
 * Import via relative paths (no package.json needed)
 */

// ============================================
// Shared State Types (for cross-app state sharing)
// ============================================

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface SharedState {
  auth: AuthState
  preferences: {
    theme: 'light' | 'dark'
    locale: string
  }
}

// ============================================
// Event Bus for Shell ↔ Legacy Communication
// ============================================

export type EventCallback = (data: unknown) => void

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map()

  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(callback)

    // Return unsubscribe function
    return () => this.off(event, callback)
  }

  off(event: string, callback: EventCallback): void {
    this.events.get(event)?.delete(callback)
  }

  emit(event: string, data?: unknown): void {
    this.events.get(event)?.forEach(cb => cb(data))
  }
}

// Singleton instance attached to window for cross-app access
declare global {
  interface Window {
    __MF_EVENT_BUS__?: EventBus
    __MF_SHARED_STATE__?: SharedState
  }
}

export function getEventBus(): EventBus {
  if (typeof window === 'undefined') {
    return new EventBus() // SSR fallback
  }
  if (!window.__MF_EVENT_BUS__) {
    window.__MF_EVENT_BUS__ = new EventBus()
  }
  return window.__MF_EVENT_BUS__
}

// ============================================
// Shared State Access
// ============================================

export function getSharedState(): SharedState {
  if (typeof window === 'undefined') {
    return createDefaultState()
  }
  if (!window.__MF_SHARED_STATE__) {
    window.__MF_SHARED_STATE__ = createDefaultState()
  }
  return window.__MF_SHARED_STATE__
}

export function setSharedState(state: Partial<SharedState>): void {
  if (typeof window === 'undefined') return
  const current = getSharedState()
  window.__MF_SHARED_STATE__ = { ...current, ...state }
  getEventBus().emit('state:changed', window.__MF_SHARED_STATE__)
}

function createDefaultState(): SharedState {
  return {
    auth: {
      user: null,
      token: null,
      isAuthenticated: false
    },
    preferences: {
      theme: 'light',
      locale: 'en'
    }
  }
}

// ============================================
// Utility Functions
// ============================================

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', options).format(d)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
