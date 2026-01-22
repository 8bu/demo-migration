<script setup lang="ts">
/**
 * LegacyComponent - Loads and renders a Vue 2 legacy component as a Web Component
 *
 * Similar to LegacyLoader but for standalone components (not pages).
 * Supports passing props via attributes.
 */

const props = defineProps<{
  /** The component name to load (e.g., 'stats-card') */
  component: string
  /** Props to pass to the legacy component */
  componentProps?: Record<string, unknown>
}>()

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const containerRef = ref<HTMLElement | null>(null)

// Capitalize helper for kebab-case
function capitalize(str: string): string {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

// Build module path and element name from component name
const modulePath = computed(() => `./${capitalize(props.component)}Component`)
const elementName = computed(() => `legacy-${props.component}`)

// Get the base URL for legacy assets
const getLegacyBaseUrl = () => '/_legacy/_nuxt'

/**
 * Load a script and return a promise
 */
const loadScript = (src: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
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
 * Load the Webpack remoteEntry.js
 */
const loadRemoteEntry = async (): Promise<void> => {
  if ((window as any).legacyApp) {
    return
  }

  const baseUrl = getLegacyBaseUrl()
  const remoteEntryUrl = `${baseUrl}/remoteEntry.js`

  await loadScript(remoteEntryUrl, 'legacy-remoteEntry')

  let attempts = 0
  while (!(window as any).legacyApp && attempts < 20) {
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }

  if (!(window as any).legacyApp) {
    throw new Error('legacyApp container not found')
  }
}

/**
 * Load the federated component
 */
const loadFederatedComponent = async (): Promise<void> => {
  await loadRemoteEntry()

  const win = window as any
  if (!win.__LEGACY_CONTAINER_INITIALIZED__) {
    await win.legacyApp.init({})
    win.__LEGACY_CONTAINER_INITIALIZED__ = true
  }

  const factory = await win.legacyApp.get(modulePath.value)
  factory()
}

/**
 * Create and mount the custom element with props as attributes
 */
const mountElement = () => {
  if (!containerRef.value) return

  // Clear existing content
  containerRef.value.innerHTML = ''

  // Create the custom element
  const element = document.createElement(elementName.value)

  // Set attributes from componentProps
  if (props.componentProps) {
    for (const [key, value] of Object.entries(props.componentProps)) {
      // Convert camelCase to kebab-case
      const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      const attrValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
      element.setAttribute(attrName, attrValue)
    }
  }

  containerRef.value.appendChild(element)
}

const loadComponent = async () => {
  try {
    isLoading.value = true
    hasError.value = false

    await loadFederatedComponent()

    // Wait for custom element to be registered
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!customElements.get(elementName.value)) {
      throw new Error(`Custom element ${elementName.value} not registered`)
    }

    isLoading.value = false

    // Mount the element after loading completes
    await nextTick()
    mountElement()
  } catch (error) {
    console.error(`[LegacyComponent] Failed to load ${props.component}:`, error)
    hasError.value = true
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load component'
    isLoading.value = false
  }
}

// Re-mount when props change
watch(() => props.componentProps, () => {
  if (!isLoading.value && !hasError.value) {
    mountElement()
  }
}, { deep: true })

watch(() => props.component, loadComponent, { immediate: true })
onMounted(loadComponent)
</script>

<template>
  <div class="shell-legacy-component">
    <div v-if="isLoading" class="shell-flex shell-items-center shell-justify-center shell-p-4">
      <div class="shell-animate-spin shell-h-6 shell-w-6 shell-border-2 shell-border-blue-600 shell-border-t-transparent shell-rounded-full"></div>
    </div>

    <div v-else-if="hasError" class="shell-text-red-500 shell-text-sm shell-p-2">
      {{ errorMessage }}
    </div>

    <!-- Container for the custom element -->
    <div v-else ref="containerRef"></div>
  </div>
</template>
