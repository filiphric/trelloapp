import '@4tw/cypress-drag-drop';
import 'cypress-file-upload';
import 'cypress-real-events/support';
import '@cypress/code-coverage/support';

beforeEach(() => {

  Cypress.env('boards', []);
  Cypress.env('lists', []);
  Cypress.env('tasks', []);
  Cypress.env('users', []);

});