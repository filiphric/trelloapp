import '@4tw/cypress-drag-drop';

beforeEach(() => {

  Cypress.env('boards', []);
  Cypress.env('lists', []);
  Cypress.env('tasks', []);

});