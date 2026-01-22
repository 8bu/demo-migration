/**
 * Factory for creating Web Component wrappers from Vue 2 components
 *
 * This module provides a unified way to wrap Vue 2 components as custom elements
 * with Shadow DOM, CSS injection, Vuex store, and cross-app communication support.
 */
import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import Vuex from 'vuex'
import * as storeModule from '~/store/index.js'

// Ensure Vuex is installed (only once)
if (!Vue._installedPlugins?.includes(Vuex)) {
  Vue.use(Vuex)
}

// Create a fresh store instance for each Web Component
const createStore = () => new Vuex.Store({
  state: storeModule.state(),
  getters: storeModule.getters,
  mutations: storeModule.mutations,
  actions: storeModule.actions
})

/**
 * Default event handlers that can be extended via config
 */
const defaultEventHandlers = {
  'auth:login': function(data) {
    if (data?.user) {
      this.sharedUser = data.user
      this.isAuthenticated = true
      this.logEvent?.('login', `User ${data.user.name || 'unknown'} logged in`)
    }
    this.syncSharedState()
  },
  'auth:logout': function(data) {
    this.sharedUser = null
    this.isAuthenticated = false
    this.logEvent?.('logout', `User logged out: ${data?.reason || 'unknown reason'}`)
  },
  'theme:changed': function(data) {
    if (data?.theme) {
      this.sharedTheme = data.theme
      this.logEvent?.('theme', `Theme changed to ${data.theme}`)
    }
  },
  'state:changed': function() {
    this.syncSharedState()
  }
}

/**
 * Creates a Web Component wrapper for a Vue 2 component
 *
 * @param {Object} Component - The Vue 2 component to wrap
 * @param {Object} options - Configuration options
 * @param {string} options.elementName - Custom element name (e.g., 'legacy-dashboard')
 * @param {string[]} options.events - Event names to subscribe to (default: ['state:changed'])
 * @param {boolean} options.injectSharedState - Whether to inject shared state as props (default: false)
 * @param {boolean} options.enableEventLog - Whether to enable event logging (default: false)
 * @param {Object} options.eventHandlers - Custom event handlers (merged with defaults)
 * @param {string[]} options.props - Additional props to pass to the component
 * @returns {CustomElementConstructor} The custom element class
 */
export function createWrapper(Component, options = {}) {
  const {
    elementName,
    events = ['state:changed'],
    injectSharedState = false,
    enableEventLog = false,
    eventHandlers = {},
    props = []
  } = options

  if (!elementName) {
    throw new Error('elementName is required in createWrapper options')
  }

  // Merge custom handlers with defaults
  const mergedHandlers = { ...defaultEventHandlers, ...eventHandlers }

  // Build props definition for the wrapper
  // This allows @vue/web-component-wrapper to pass attributes as props
  const wrapperProps = {}
  props.forEach(prop => {
    wrapperProps[prop] = {
      type: null, // Accept any type
      default: undefined
    }
  })

  // Create the wrapper component
  const WrappedComponent = {
    name: `Wrapped${elementName.replace(/^legacy-/, '').replace(/^\w/, c => c.toUpperCase())}`,
    store: createStore(),
    props: wrapperProps,

    data() {
      const data = {}

      if (injectSharedState) {
        data.sharedUser = null
        data.sharedTheme = 'light'
        data.isAuthenticated = false
      }

      if (enableEventLog) {
        data.eventLog = []
      }

      return data
    },

    provide() {
      if (!injectSharedState) return {}

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
      const propsData = {}

      if (injectSharedState) {
        propsData.sharedUser = this.sharedUser
        propsData.sharedTheme = this.sharedTheme
        propsData.isAuthenticated = this.isAuthenticated
      }

      if (enableEventLog) {
        propsData.eventLog = this.eventLog
      }

      // Add any additional props from web component attributes
      // Parse string values to their proper types
      props.forEach(prop => {
        const value = this[prop]
        if (value !== undefined) {
          propsData[prop] = this.parseAttrValue(value)
        }
      })

      return h(Component, { props: propsData })
    },

    mounted() {
      console.log(`[Legacy ${elementName}] Web Component mounted`)

      // Initial sync with shared state
      this.syncSharedState()

      // Subscribe to events
      if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
        this._eventUnsubscribers = []

        events.forEach(eventName => {
          const handler = mergedHandlers[eventName]
          if (handler) {
            const boundHandler = handler.bind(this)
            const unsubscribe = window.__MF_EVENT_BUS__.on(eventName, (data) => {
              console.log(`[Legacy ${elementName}] Received ${eventName} event:`, data)
              boundHandler(data)
            })
            this._eventUnsubscribers.push(unsubscribe)
          }
        })
      }
    },

    beforeDestroy() {
      // Clean up all event listeners
      if (this._eventUnsubscribers) {
        this._eventUnsubscribers.forEach(unsubscribe => unsubscribe?.())
      }
    },

    methods: {
      syncSharedState() {
        if (typeof window !== 'undefined' && window.__MF_SHARED_STATE__) {
          const shared = window.__MF_SHARED_STATE__
          console.log(`[Legacy ${elementName}] Syncing shared state:`, shared)

          if (injectSharedState) {
            if (shared.auth) {
              this.sharedUser = shared.auth.user
              this.isAuthenticated = shared.auth.isAuthenticated
            }
            if (shared.preferences) {
              this.sharedTheme = shared.preferences.theme
            }

            if (enableEventLog) {
              this.logEvent('sync', 'Synced with Shell state')
            }
          }
        }
      },

      logEvent(type, message) {
        if (!enableEventLog || !this.eventLog) return

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

      emitToShell(event, data) {
        if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
          console.log(`[Legacy ${elementName}] Emitting ${event} to Shell:`, data)
          window.__MF_EVENT_BUS__.emit(event, data)
        }
      },

      /**
       * Parse attribute value to proper type
       * Web Component attributes are always strings, so we need to convert them
       */
      parseAttrValue(value) {
        if (value === undefined || value === null) return value
        if (typeof value !== 'string') return value

        // Try to parse as JSON (for objects/arrays)
        if (value.startsWith('{') || value.startsWith('[')) {
          try {
            return JSON.parse(value)
          } catch (e) {
            return value
          }
        }

        // Check for boolean
        if (value === 'true') return true
        if (value === 'false') return false

        // Check for number
        const num = Number(value)
        if (!isNaN(num) && value.trim() !== '') return num

        return value
      }
    }
  }

  // Create the custom element class
  const BaseElement = wrap(Vue, WrappedComponent)

  // Extend to inject styles into Shadow DOM
  class StyledElement extends BaseElement {
    connectedCallback() {
      super.connectedCallback?.()

      // Inject legacy CSS into shadow root
      if (this.shadowRoot) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = '/_legacy/_nuxt/css/legacy-styles.css'
        this.shadowRoot.prepend(link)
      }
    }
  }

  // Register the custom element if not already registered
  if (typeof window !== 'undefined' && !customElements.get(elementName)) {
    customElements.define(elementName, StyledElement)
  }

  return StyledElement
}

export default createWrapper
