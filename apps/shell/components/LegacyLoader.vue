<script setup lang="ts">
/**
 * LegacyLoader - Dynamically loads and renders Vue 2 legacy pages as Web Components
 *
 * This component uses MANUAL Module Federation loading to avoid cross-bundler
 * compatibility issues between Vite and Webpack. It loads the Webpack remoteEntry.js
 * as a script tag and directly accesses the global container.
 */
import { getModuleMap, getModuleInfo } from '~/config/federation'

declare global {
  interface Window {
    legacyApp: {
      init: (shareScope: Record<string, unknown>) => Promise<void>
      get: (module: string) => Promise<() => unknown>
    }
    __MF_EVENT_BUS__: {
      on: (event: string, callback: (data: unknown) => void) => () => void
      off: (event: string, callback: (data: unknown) => void) => void
      emit: (event: string, data?: unknown) => void
    }
    __MF_SHARED_STATE__: Record<string, unknown>
  }
}

const props = defineProps<{
  /** The module name to load (e.g., 'dashboard', 'booking', 'reports') */
  module: string
}>()

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

// Get module map from shared federation config
const moduleMap = getModuleMap()

const currentModule = computed(() => moduleMap[props.module])
const elementName = computed(() => currentModule.value?.elementName || '')

// Get the base URL for legacy assets
// In dev: Vite proxy forwards /_legacy/_nuxt/* to localhost:3001
// In prod: Files are served directly from /_legacy/_nuxt/
const getLegacyBaseUrl = () => {
  return '/_legacy/_nuxt'
}

// Initialize shared state for cross-app communication
const initSharedState = () => {
  if (typeof window === 'undefined') return

  // Initialize event bus if not exists
  if (!window.__MF_EVENT_BUS__) {
    const events = new Map<string, Set<(data: unknown) => void>>()
    window.__MF_EVENT_BUS__ = {
      on(event: string, callback: (data: unknown) => void) {
        if (!events.has(event)) events.set(event, new Set())
        events.get(event)!.add(callback)
        return () => events.get(event)?.delete(callback)
      },
      off(event: string, callback: (data: unknown) => void) {
        events.get(event)?.delete(callback)
      },
      emit(event: string, data?: unknown) {
        events.get(event)?.forEach((cb) => cb(data))
      },
    }
  }

  // Initialize shared state if not exists
  if (!window.__MF_SHARED_STATE__) {
    window.__MF_SHARED_STATE__ = {
      auth: {
        user: {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'admin',
        },
        token: 'demo-token-123',
        isAuthenticated: true,
      },
      preferences: {
        theme: 'light',
        locale: 'en',
      },
    }
  }
}

/**
 * Load a script and return a promise
 */
const loadScript = (src: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`script[data-id="${id}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.setAttribute('data-id', id)

    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load: ${src}`))

    document.head.appendChild(script)
  })
}

/**
 * Load a CSS stylesheet
 */
const loadStylesheet = (href: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (document.querySelector(`link[data-id="${id}"]`)) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.setAttribute('data-id', id)

    link.onload = () => resolve()
    link.onerror = () => {
      console.warn(`[LegacyLoader] Could not load stylesheet: ${href}`)
      resolve() // Don't fail if CSS doesn't load
    }

    document.head.appendChild(link)
  })
}

/**
 * Load the Webpack remoteEntry.js and wait for container to be available
 */
const loadRemoteEntry = async (): Promise<void> => {
  const baseUrl = getLegacyBaseUrl()

  // Load the legacy CSS (do this even if container is already loaded)
  // Uses predictable filename configured in legacy/nuxt.config.js
  const cssUrl = `${baseUrl}/css/legacy-styles.css`
  console.log(`[LegacyLoader] Loading legacy CSS from: ${cssUrl}`)
  await loadStylesheet(cssUrl, 'legacy-css')

  if (window.legacyApp) {
    console.log('[LegacyLoader] Container already loaded')
    return
  }

  const remoteEntryUrl = `${baseUrl}/remoteEntry.js`

  console.log(`[LegacyLoader] Loading remoteEntry from: ${remoteEntryUrl}`)

  await loadScript(remoteEntryUrl, 'legacy-remoteEntry')

  // Wait and retry for the container to be available
  let attempts = 0
  const maxAttempts = 20

  while (!window.legacyApp && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }

  if (!window.legacyApp) {
    console.error('[LegacyLoader] window.legacyApp:', window.legacyApp)
    console.error('[LegacyLoader] Script loaded but container not found')
    throw new Error('legacyApp container not found. Ensure the webpack build includes the runtime.')
  }

  console.log('[LegacyLoader] Container loaded successfully')
}

// Track if container has been initialized - use window property to persist across component instances
declare global {
  interface Window {
    __LEGACY_CONTAINER_INITIALIZED__?: boolean
  }
}

/**
 * Initialize the Module Federation container and load the module
 */
const loadFederatedModule = async (modulePath: string): Promise<void> => {
  await loadRemoteEntry()

  const containerInitialized = window.__LEGACY_CONTAINER_INITIALIZED__ || false
  console.log(`[LegacyLoader] Loading ${modulePath}, container initialized: ${containerInitialized}`)

  // Initialize the container only once with empty share scope (no shared dependencies)
  if (!containerInitialized) {
    console.log('[LegacyLoader] Initializing container for the first time')
    await window.legacyApp.init({})
    window.__LEGACY_CONTAINER_INITIALIZED__ = true
  }

  // Get the module factory
  const factory = await window.legacyApp.get(modulePath)

  // Execute the factory to register the web component
  const module = factory()

  console.log(`[LegacyLoader] Module loaded:`, module)
}

// Load the federated module
const loadModule = async () => {
  if (!currentModule.value) {
    hasError.value = true
    errorMessage.value = `Unknown module: ${props.module}`
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    hasError.value = false

    initSharedState()

    await loadFederatedModule(currentModule.value.path)

    // Wait for custom element to be registered
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!customElements.get(elementName.value)) {
      throw new Error(`Custom element ${elementName.value} not registered`)
    }

    isLoading.value = false
  } catch (error) {
    console.error(`[LegacyLoader] Failed to load module ${props.module}:`, error)
    hasError.value = true
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load legacy module'
    isLoading.value = false
  }
}

watch(() => props.module, loadModule, { immediate: true })

onMounted(() => {
  loadModule()
})
</script>

<template>
  <div class="shell-legacy-loader">
    <div v-if="isLoading" class="shell-flex shell-items-center shell-justify-center shell-min-h-[400px]">
      <div class="shell-text-center">
        <div class="shell-animate-spin shell-rounded-full shell-h-12 shell-w-12 shell-border-b-2 shell-border-blue-600 shell-mx-auto shell-mb-4"></div>
        <p class="shell-text-gray-500">Loading {{ module }}...</p>
      </div>
    </div>

    <div v-else-if="hasError" class="shell-flex shell-items-center shell-justify-center shell-min-h-[400px]">
      <div class="shell-text-center shell-bg-red-50 shell-border shell-border-red-200 shell-rounded-lg shell-p-8 shell-max-w-md">
        <div class="shell-text-red-500 shell-text-4xl shell-mb-4">⚠️</div>
        <h3 class="shell-text-lg shell-font-semibold shell-text-red-700 shell-mb-2">Failed to Load Module</h3>
        <p class="shell-text-red-600 shell-text-sm shell-mb-4">{{ errorMessage }}</p>
        <button class="shell-px-4 shell-py-2 shell-bg-red-600 shell-text-white shell-rounded shell-hover:bg-red-700 shell-transition" @click="loadModule">
          Retry
        </button>
      </div>
    </div>

    <div v-else class="shell-legacy-container">
      <component :is="elementName" v-if="elementName" />
    </div>
  </div>
</template>

<style scoped>
.shell-legacy-loader {
  width: 100%;
  min-height: 400px;
}

.shell-legacy-container {
  width: 100%;
}

.shell-legacy-container :deep(*) {
  max-width: 100%;
}
</style>
