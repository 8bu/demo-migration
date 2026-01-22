/**
 * Federation Module Map
 *
 * This file contains the module map derived from the shared federation config.
 * The config is duplicated here (not imported) because:
 * 1. Shell runs in browser - can't use require()
 * 2. Legacy uses CommonJS - can't use ESM import
 *
 * IMPORTANT: Keep this in sync with packages/shared/federation.config.js
 * When adding new pages, update BOTH files.
 */

export interface ModuleInfo {
  path: string
  elementName: string
}

export interface LegacyRoute {
  path: string
  module: string
  title: string
  icon?: string
}

export type ModuleMap = Record<string, ModuleInfo>

/**
 * Federation configuration - must match packages/shared/federation.config.js
 */
const federationConfig = {
  pages: {
    dashboard: {
      source: 'pages/dashboard',
      route: { path: 'dashboard', title: 'Dashboard', icon: 'dashboard' }
    },
    booking: {
      source: 'pages/booking/index',
      route: { path: 'booking', title: 'Bookings', icon: 'calendar' }
    },
    reports: {
      source: 'pages/reports',
      route: { path: 'reports', title: 'Reports', icon: 'chart' }
    },
    settings: {
      source: 'pages/settings',
      route: { path: 'settings', title: 'Settings', icon: 'cog' }
    }
  },
  components: {
    'stats-card': { source: 'components/StatsCard' }
  } as Record<string, { source: string; route?: { path: string; title: string; icon?: string } }>
}

function capitalize(str: string): string {
  // Handle kebab-case: stats-card -> StatsCard
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

/**
 * Get the module map for LegacyLoader
 * Maps module names to federation paths and custom element names
 */
export function getModuleMap(): ModuleMap {
  const moduleMap: ModuleMap = {}

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
 * Get all available module names
 */
export function getModuleNames(): string[] {
  return [
    ...Object.keys(federationConfig.pages),
    ...Object.keys(federationConfig.components)
  ]
}

/**
 * Check if a module exists in the federation config
 */
export function isValidModule(moduleName: string): boolean {
  const modules = getModuleNames()
  return modules.includes(moduleName)
}

/**
 * Get module info by name
 */
export function getModuleInfo(moduleName: string): ModuleInfo | undefined {
  const moduleMap = getModuleMap()
  return moduleMap[moduleName]
}

/**
 * Get all legacy routes with metadata for navigation
 */
export function getLegacyRoutes(): LegacyRoute[] {
  const routes: LegacyRoute[] = []

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
export function findLegacyRoute(path: string): LegacyRoute | undefined {
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
export function isLegacyRoute(path: string): boolean {
  return findLegacyRoute(path) !== undefined
}

/**
 * Get module name for a path
 */
export function getModuleForPath(path: string): string | undefined {
  const route = findLegacyRoute(path)
  return route?.module
}
