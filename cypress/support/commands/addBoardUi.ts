Cypress.Commands.add('addBoardUi', (name) => {

  cy
    .contains('h1', 'Create a board...')
    .click();

  cy
    .get('[placeholder="Create a board..."]')
    .type(`${name}{enter}`);

});