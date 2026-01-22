/**
 * Federation config for Dashboard page
 *
 * This page demonstrates full shared state integration with the Shell.
 */
module.exports = {
  // Events this page subscribes to from the Shell
  events: ['auth:login', 'auth:logout', 'theme:changed', 'state:changed'],

  // Inject shared state as props to the page component
  injectSharedState: true,

  // Enable event logging for debugging/demo purposes
  enableEventLog: true

  // Custom event handlers can be added here:
  // eventHandlers: {
  //   'custom:event': function(data) { /* ... */ }
  // }
}
