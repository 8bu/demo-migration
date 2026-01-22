/**
 * Web Component wrapper for Dashboard page
 * Exposes Vue 2 component as <legacy-dashboard> custom element
 *
 * DEMONSTRATES:
 * - Reading shared state from Shell (user info, theme)
 * - Listening to events from Shell (auth:login, auth:logout, theme:changed)
 * - Emitting events back to Shell
 */
import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import Dashboard from '~/pages/dashboard.vue'
import Vuex from 'vuex'
import * as storeModule from '~/store/index.js'

// Ensure Vuex is installed
if (!Vue._installedPlugins?.includes(Vuex)) {
  Vue.use(Vuex)
}

// Create a fresh store instance for this Web Component
const createStore = () => new Vuex.Store({
  state: storeModule.state(),
  getters: storeModule.getters,
  mutations: storeModule.mutations,
  actions: storeModule.actions
})

// Wrapper component that provides the store AND shared state bridge
const WrappedDashboard = {
  name: 'WrappedDashboard',
  store: createStore(),
  data() {
    return {
      // Local copy of shared state for reactivity
      sharedUser: null,
      sharedTheme: 'light',
      isAuthenticated: false,
      eventLog: []
    }
  },
  provide() {
    // Provide shared state to child components
    return {
      sharedState: {
        getUser: () => this.sharedUser,
        getTheme: () => this.sharedTheme,
        isAuthenticated: () => this.isAuthenticated,
        getEventLog: () => this.eventLog
      }
    }
  },
  render(h) {
    // Pass shared state as props to Dashboard
    return h(Dashboard, {
      props: {
        sharedUser: this.sharedUser,
        sharedTheme: this.sharedTheme,
        isAuthenticated: this.isAuthenticated,
        eventLog: this.eventLog
      }
    })
  },
  mounted() {
    console.log('[Legacy Dashboard] Web Component mounted')

    // Initial sync with shared state
    this.syncSharedState()

    // Listen for events from Shell
    if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
      // Auth events
      this._unsubscribeLogin = window.__MF_EVENT_BUS__.on('auth:login', (data) => {
        console.log('[Legacy Dashboard] Received auth:login event:', data)
        this.handleLogin(data)
      })

      this._unsubscribeLogout = window.__MF_EVENT_BUS__.on('auth:logout', (data) => {
        console.log('[Legacy Dashboard] Received auth:logout event:', data)
        this.handleLogout(data)
      })

      // Theme events
      this._unsubscribeTheme = window.__MF_EVENT_BUS__.on('theme:changed', (data) => {
        console.log('[Legacy Dashboard] Received theme:changed event:', data)
        this.handleThemeChange(data)
      })

      // General state change events
      this._unsubscribeState = window.__MF_EVENT_BUS__.on('state:changed', (state) => {
        console.log('[Legacy Dashboard] Received state:changed event:', state)
        this.syncSharedState()
      })
    }
  },
  beforeDestroy() {
    // Clean up event listeners
    if (this._unsubscribeLogin) this._unsubscribeLogin()
    if (this._unsubscribeLogout) this._unsubscribeLogout()
    if (this._unsubscribeTheme) this._unsubscribeTheme()
    if (this._unsubscribeState) this._unsubscribeState()
  },
  methods: {
    syncSharedState() {
      if (typeof window !== 'undefined' && window.__MF_SHARED_STATE__) {
        const shared = window.__MF_SHARED_STATE__
        console.log('[Legacy Dashboard] Syncing shared state:', shared)

        // Update local reactive data
        if (shared.auth) {
          this.sharedUser = shared.auth.user
          this.isAuthenticated = shared.auth.isAuthenticated
        }
        if (shared.preferences) {
          this.sharedTheme = shared.preferences.theme
        }

        this.logEvent('sync', 'Synced with Shell state')
      }
    },

    handleLogin(data) {
      if (data && data.user) {
        this.sharedUser = data.user
        this.isAuthenticated = true
        this.logEvent('login', `User ${data.user.name || 'unknown'} logged in`)
      }
      // Re-sync to get full state
      this.syncSharedState()
    },

    handleLogout(data) {
      this.sharedUser = null
      this.isAuthenticated = false
      this.logEvent('logout', `User logged out: ${data?.reason || 'unknown reason'}`)
    },

    handleThemeChange(data) {
      if (data && data.theme) {
        this.sharedTheme = data.theme
        this.logEvent('theme', `Theme changed to ${data.theme}`)
      }
    },

    logEvent(type, message) {
      this.eventLog.unshift({
        id: Date.now(),
        type,
        message,
        time: new Date().toLocaleTimeString()
      })
      // Keep only last 10 events
      if (this.eventLog.length > 10) {
        this.eventLog.pop()
      }
    },

    // Method to emit events back to Shell (can be called from Dashboard)
    emitToShell(event, data) {
      if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
        console.log(`[Legacy Dashboard] Emitting ${event} to Shell:`, data)
        window.__MF_EVENT_BUS__.emit(event, data)
      }
    }
  }
}

// Create the custom element
const DashboardElement = wrap(Vue, WrappedDashboard)

// Extend the element to inject styles into Shadow DOM
class StyledDashboardElement extends DashboardElement {
  connectedCallback() {
    super.connectedCallback && super.connectedCallback()

    // Inject legacy CSS into shadow root
    // Uses predictable filename configured in nuxt.config.js
    if (this.shadowRoot) {
      const baseUrl = '/_legacy/_nuxt'

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = `${baseUrl}/css/legacy-styles.css`
      this.shadowRoot.prepend(link)
    }
  }
}

// Register custom element if not already registered
if (typeof window !== 'undefined' && !customElements.get('legacy-dashboard')) {
  customElements.define('legacy-dashboard', StyledDashboardElement)
}

export default StyledDashboardElement
