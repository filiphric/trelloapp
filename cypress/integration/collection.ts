import '../support/commands/addBoardApi';
import '../support/commands/updateBoardApi';
import '../support/commands/deleteBoardApi';

beforeEach(() => {

  cy
    .request('POST', '/reset');

});

it('opens board', () => {

  cy
    .visit('/');

  cy
    .log('click on create a board button')
    .get('[data-cy="create-board"]')
    .click();

  cy
    .get('[data-cy="new-board-create"]')
    .click();

  cy
    .log('click on create a board button')
    .get('[data-cy="create-board"]')
    .click();

  cy
    .log('type in board name and hit enter')
    .get('[data-cy="new-board-input"]')
    .type('new board{enter}');

});

it('stars a board', () => {

  cy
    .visit('/');

  cy
    .log('create a new board via api')
    .addBoardApi('new board');

  cy
    .log('created board is visible')
    .get('[data-cy="board-item"]')
    .should('be.visible')
    .should('have.length', 1);

  cy
    .log('click on star button')
    .get('[data-cy="board-item"]')
    .realHover()
    .get('.Star')
    .click();

});

it('renames a board via api', () => {

  cy
    .log('create a new board via api')
    .addBoardApi('new board');

  cy
    .visit('/');

  cy
    .get('[data-cy="board-item"]')
    .should('contain.text', 'new board');

  cy
    .updateBoardApi({ name: 'updated board name' });

  cy
    .get('[data-cy="board-item"]')
    .should('contain.text', 'updated board name');

});

it('deletes board via api', () => {

  cy
    .log('create a new board via api')
    .addBoardApi('new board');

  cy
    .visit('/');

  cy
    .log('created board is visible')
    .get('[data-cy="board-item"]')
    .should('have.length', 1);

  cy
    .deleteBoardApi();

  cy
    .log('created board disappears')
    .get('board-item')
    .should('have.length', 0);

});

it('shows an error when network does not work on creating board', () => {

  cy
    .intercept('POST', '/api/boards', {
      forceNetworkError: true
    }).as('createList');

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
    .log('error message appears')
    .get('#errorMessage')
    .should('be.visible');

  cy
    .log('error message disappears')
    .get('#errorMessage')
    .should('not.be.visible');

});