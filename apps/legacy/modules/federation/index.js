/**
 * Nuxt Module: Federation Wrapper Generator
 *
 * This module is registered in nuxt.config.js but the actual generation
 * happens in getExposes.js (called synchronously during config evaluation).
 *
 * This module exists to provide hooks for future enhancements like:
 * - Watch mode for development
 * - Validation of federation config
 * - Integration with Nuxt's build pipeline
 */

module.exports = function federationModule() {
  // Generation happens in getExposes.js (synchronous, at config time)
  // This ensures files exist before webpack resolves them

  // Future: Add watch mode for development
  // const { nuxt } = this
  // if (nuxt.options.dev) {
  //   // Watch federation.config.js and *.federation.js files
  //   // Regenerate on changes
  // }
}

module.exports.meta = {
  name: 'federation',
  version: '1.0.0'
}
