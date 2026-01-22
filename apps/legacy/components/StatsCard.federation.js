/**
 * Federation config for StatsCard component
 *
 * Components don't need shared state injection - they receive props directly
 */
module.exports = {
  events: [], // Components typically don't need events
  injectSharedState: false,
  enableEventLog: false,
  // Props that can be passed from shell via attributes
  props: ['title', 'value', 'change', 'format', 'color']
}
