/**
 * Legacy Routes Configuration
 *
 * Re-exports route functions from the shared federation config.
 * This file exists for backward compatibility - new code should import from federation.ts
 *
 * All route configuration now lives in packages/shared/federation.config.js
 */

export {
  type LegacyRoute,
  getLegacyRoutes as getTopLevelRoutes,
  getLegacyRoutes,
  findLegacyRoute,
  isLegacyRoute,
  getModuleForPath,
} from './federation'

// Re-export as legacyRoutes for backward compatibility
import { getLegacyRoutes } from './federation'
export const legacyRoutes = getLegacyRoutes()

/**
 * Get a flat list of all legacy route paths
 */
export function getAllLegacyPaths(): string[] {
  return getLegacyRoutes().map(route => route.path)
}

export default legacyRoutes
