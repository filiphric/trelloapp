beforeEach(() => {

  cy
    .request('POST', '/reset');

});

it.skip('opens board', () => {

  cy
    .visit('/');

  cy
    .log('click on create a board button')
    .get('[data-cy="create-board"]')
    .click();

  cy
    .log('type in board name and hit enter')
    .get('[data-cy="new-board-input"]')
    .type('new board{enter}');

  cy
    .url()
    .should('eq', 'nonsens');

});