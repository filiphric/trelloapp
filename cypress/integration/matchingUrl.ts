it('creating a board', () => {

  cy
    .intercept({
    method: 'GET',
    path: '/api/boards'
  }).as('matchedUrl')

  cy
    .visit('/')

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy=new-board-input]')
    .type('new board{enter}');

})