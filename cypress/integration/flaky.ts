it('board id must be even', () => {

  cy
    .intercept('POST', '/api/boards')
    .as('board');

  cy
    .visit('/');

  cy
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy=new-board-input]')
    .type('new board{enter}');

  cy
    .wait('@board')
    .then(({ response }) => {

      expect(response.body.id % 5 == 0).to.be.true;

    });

});