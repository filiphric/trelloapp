const clipboardy = require('clipboardy');
const { setupDb } = require('./setupDb.js')

module.exports = (on: Cypress.PluginEvents, config: Cypress.ConfigOptions) => {
  on('task', {
    setupDb: setupDb,
    getClipboard: () => {
      const clipboard: string = clipboardy.readSync();
      return clipboard;
    },
  })

  return config;
};