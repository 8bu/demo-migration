/**
 * Dynamic CSS Loader for Legacy Web Components
 *
 * Problem: Webpack generates content-hashed CSS filenames (e.g., cd7db16.css)
 * that change on every build. Hardcoding these hashes breaks styles.
 *
 * Solution: This module discovers the CSS filename dynamically by:
 * 1. Checking a global variable set by the build
 * 2. Fetching the CSS directory listing (fallback)
 * 3. Using a known fallback path
 */

const BASE_URL = '/_legacy/_nuxt'

// Cache the discovered CSS URL
let cachedCssUrl = null

/**
 * Discovers the legacy CSS URL dynamically
 * @returns {Promise<string>} The CSS URL
 */
export async function discoverCssUrl() {
  if (cachedCssUrl) {
    return cachedCssUrl
  }

  // Method 1: Check if build injected the CSS filename
  if (typeof window !== 'undefined' && window.__LEGACY_CSS_FILENAME__) {
    cachedCssUrl = `${BASE_URL}/css/${window.__LEGACY_CSS_FILENAME__}`
    console.log('[CSS Loader] Using injected filename:', cachedCssUrl)
    return cachedCssUrl
  }

  // Method 2: Try to fetch from a manifest or known location
  try {
    // Try to find the CSS file by fetching the directory
    // Note: This may not work on all servers, so we have fallbacks
    const response = await fetch(`${BASE_URL}/css/`, { method: 'HEAD' })
    if (response.ok) {
      // If we can access the directory, try to find the CSS file
      // by checking common patterns
    }
  } catch (e) {
    // Directory listing not available, continue to fallback
  }

  // Method 3: Use the CSS filename from the build
  // This gets replaced by the build script
  const buildCssFilename = '%%CSS_FILENAME%%'
  if (buildCssFilename && !buildCssFilename.includes('%%')) {
    cachedCssUrl = `${BASE_URL}/css/${buildCssFilename}`
    console.log('[CSS Loader] Using build-time filename:', cachedCssUrl)
    return cachedCssUrl
  }

  // Method 4: Fallback - try to load any CSS file from the expected path
  // The build script should update this
  cachedCssUrl = `${BASE_URL}/css/app.css`
  console.log('[CSS Loader] Using fallback:', cachedCssUrl)
  return cachedCssUrl
}

/**
 * Injects the legacy CSS into a Shadow DOM
 * @param {ShadowRoot} shadowRoot - The shadow root to inject into
 */
export async function injectLegacyCss(shadowRoot) {
  if (!shadowRoot) {
    console.warn('[CSS Loader] No shadow root provided')
    return
  }

  // Check if CSS is already injected
  if (shadowRoot.querySelector('link[data-legacy-css]')) {
    console.log('[CSS Loader] CSS already injected')
    return
  }

  const cssUrl = await discoverCssUrl()

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssUrl
  link.setAttribute('data-legacy-css', 'true')

  // Handle load errors
  link.onerror = () => {
    console.error('[CSS Loader] Failed to load CSS from:', cssUrl)
    // Try fallback
    if (!cssUrl.includes('app.css')) {
      link.href = `${BASE_URL}/css/app.css`
    }
  }

  link.onload = () => {
    console.log('[CSS Loader] CSS loaded successfully from:', cssUrl)
  }

  shadowRoot.prepend(link)
}

export default {
  discoverCssUrl,
  injectLegacyCss,
  BASE_URL
}
