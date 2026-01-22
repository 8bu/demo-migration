/**
 * Type declarations for Module Federation remotes
 */

declare module 'legacyApp/DashboardPage' {
  const DashboardPage: CustomElementConstructor
  export default DashboardPage
}

declare module 'legacyApp/BookingPage' {
  const BookingPage: CustomElementConstructor
  export default BookingPage
}

declare module 'legacyApp/ReportsPage' {
  const ReportsPage: CustomElementConstructor
  export default ReportsPage
}

// Extend Window interface for shared state
declare global {
  interface Window {
    __MF_EVENT_BUS__?: {
      on: (event: string, callback: (data: unknown) => void) => () => void
      off: (event: string, callback: (data: unknown) => void) => void
      emit: (event: string, data?: unknown) => void
    }
    __MF_SHARED_STATE__?: {
      auth: {
        user: {
          id: string
          email: string
          name: string
          avatar?: string
          role: 'admin' | 'user' | 'guest'
        } | null
        token: string | null
        isAuthenticated: boolean
      }
      preferences: {
        theme: 'light' | 'dark'
        locale: string
      }
    }
  }
}

export {}
