/**
 * Web Component wrapper for Booking page
 * Exposes Vue 2 component as <legacy-booking> custom element
 */
import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import Booking from '~/pages/booking/index.vue'
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

// Wrapper component that provides the store
const WrappedBooking = {
  name: 'WrappedBooking',
  store: createStore(),
  render(h) {
    return h(Booking)
  },
  mounted() {
    this.syncSharedState()

    if (typeof window !== 'undefined' && window.__MF_EVENT_BUS__) {
      this._unsubscribe = window.__MF_EVENT_BUS__.on('state:changed', (state) => {
        this.handleSharedStateChange(state)
      })
    }
  },
  beforeDestroy() {
    if (this._unsubscribe) {
      this._unsubscribe()
    }
  },
  methods: {
    syncSharedState() {
      if (typeof window !== 'undefined' && window.__MF_SHARED_STATE__) {
        const shared = window.__MF_SHARED_STATE__
        console.log('[Legacy Booking] Syncing shared state:', shared)
      }
    },
    handleSharedStateChange(state) {
      console.log('[Legacy Booking] Shared state changed:', state)
    }
  }
}

// Create the custom element
const BookingElement = wrap(Vue, WrappedBooking)

// Extend the element to inject styles into Shadow DOM
class StyledBookingElement extends BookingElement {
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
if (typeof window !== 'undefined' && !customElements.get('legacy-booking')) {
  customElements.define('legacy-booking', StyledBookingElement)
}

export default StyledBookingElement
