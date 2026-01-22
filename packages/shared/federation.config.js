/**
 * Module Federation Configuration
 *
 * This file defines which modules (pages, components) are exposed via Module Federation.
 * It's shared between the legacy app (generates wrappers) and shell (builds module map).
 *
 * IMPORTANT: Use CommonJS (module.exports) for Nuxt 2 compatibility.
 * Both apps can require() this file.
 */

const federationConfig = {
  // Pages to expose as Web Components
  // Key: module name (used in routes and module loading)
  // Value: config object with source path and route metadata
  pages: {
    dashboard: {
      source: 'pages/dashboard',
      route: {
        path: 'dashboard',
        title: 'Dashboard',
        icon: 'dashboard'
      }
    },
    booking: {
      source: 'pages/booking/index',
      route: {
        path: 'booking',
        title: 'Bookings',
        icon: 'calendar'
      }
    },
    reports: {
      source: 'pages/reports',
      route: {
        path: 'reports',
        title: 'Reports',
        icon: 'chart'
      }
    },
    settings: {
      source: 'pages/settings',
      route: {
        path: 'settings',
        title: 'Settings',
        icon: 'cog'
      }
    }
  },

  // Components to expose as standalone Web Components
  // Can be used directly in Shell or other apps
  components: {
    'stats-card': {
      source: 'components/StatsCard'
    }
  },

  // Global defaults for all wrappers
  defaults: {
    // Default events all wrappers subscribe to
    events: ['state:changed'],

    // Whether to inject shared state by default
    injectSharedState: false,

    // Whether to enable event logging by default
    enableEventLog: false
  }
}

/**
 * Get the module map for Shell's LegacyLoader
 * Maps module names to federation paths and custom element names
 */
function getModuleMap() {
  const moduleMap = {}

  // Pages
  Object.keys(federationConfig.pages).forEach(moduleName => {
    moduleMap[moduleName] = {
      path: `./${capitalize(moduleName)}Page`,
      elementName: `legacy-${moduleName}`
    }
  })

  // Components
  Object.keys(federationConfig.components).forEach(moduleName => {
    moduleMap[moduleName] = {
      path: `./${capitalize(moduleName)}Component`,
      elementName: `legacy-${moduleName}`
    }
  })

  return moduleMap
}

/**
 * Get all module names (for route generation)
 */
function getModuleNames() {
  return [
    ...Object.keys(federationConfig.pages),
    ...Object.keys(federationConfig.components)
  ]
}

/**
 * Get legacy routes with full metadata for navigation
 * Returns array compatible with Shell's route config
 */
function getLegacyRoutes() {
  const routes = []

  Object.entries(federationConfig.pages).forEach(([moduleName, config]) => {
    routes.push({
      path: config.route?.path || moduleName,
      module: moduleName,
      title: config.route?.title || capitalize(moduleName),
      icon: config.route?.icon
    })
  })

  return routes
}

/**
 * Find a legacy route by path
 */
function findLegacyRoute(path) {
  const routes = getLegacyRoutes()
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) return undefined

  // Find route matching first segment
  const route = routes.find(r => r.path === segments[0])
  return route
}

/**
 * Check if a path is a valid legacy route
 */
function isLegacyRoute(path) {
  return findLegacyRoute(path) !== undefined
}

/**
 * Get module name for a path
 */
function getModuleForPath(path) {
  const route = findLegacyRoute(path)
  return route?.module
}

/**
 * Get source path for a module (used by wrapper generator)
 */
function getSourcePath(moduleName) {
  const pageConfig = federationConfig.pages[moduleName]
  if (pageConfig) {
    return typeof pageConfig === 'string' ? pageConfig : pageConfig.source
  }

  const componentConfig = federationConfig.components[moduleName]
  if (componentConfig) {
    return typeof componentConfig === 'string' ? componentConfig : componentConfig.source
  }

  return undefined
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// CommonJS exports for Nuxt 2 compatibility
module.exports = federationConfig
module.exports.getModuleMap = getModuleMap
module.exports.getModuleNames = getModuleNames
module.exports.getLegacyRoutes = getLegacyRoutes
module.exports.findLegacyRoute = findLegacyRoute
module.exports.isLegacyRoute = isLegacyRoute
module.exports.getModuleForPath = getModuleForPath
module.exports.getSourcePath = getSourcePath
module.exports.federationConfig = federationConfig
