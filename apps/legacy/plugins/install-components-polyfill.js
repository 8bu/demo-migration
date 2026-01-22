/**
 * Polyfill for Nuxt 2's installComponents function
 * This is needed when Vue components are loaded outside of Nuxt's normal runtime
 * (e.g., via Module Federation)
 */

// Install the polyfill immediately on load
if (typeof window !== 'undefined') {
  window.installComponents = function installComponents(component, components) {
    const options = typeof component === 'function' ? component.options : component
    if (!options.components) {
      options.components = {}
    }
    for (const key in components) {
      options.components[key] = components[key]
    }
  }
}

// Also make it available globally for synchronous module loading
if (typeof globalThis !== 'undefined') {
  globalThis.installComponents = window.installComponents
}
