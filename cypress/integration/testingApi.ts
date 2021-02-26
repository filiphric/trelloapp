it('creating a board', () => {

  cy
    .intercept('POST', '/api/boards').as('createBoard')

  cy
    .visit('/')

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy=new-board-input]')
    .type('new board{enter}');

    cy
    .wait('@createBoard')
    .then( ({ request }) => {
      expect(request.body.name).to.eq('new board')
    })

})