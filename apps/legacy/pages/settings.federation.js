/**
 * Federation config for Settings page
 */
module.exports = {
  events: ['auth:login', 'auth:logout', 'theme:changed', 'state:changed'],
  injectSharedState: true,
  enableEventLog: false
}
