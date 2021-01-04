import '../support/commands/addBoardApi';
import '../support/commands/addListApi';

beforeEach(() => {

  cy
    .request('POST', '/reset');

  cy
    .addBoardApi('new board');

});

it('adds a new list', () => {

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('add a list')
    .get('[data-cy=add-list]')
    .click();

  cy
    .log('options are visible')
    .get('[data-cy=add-list-options]')
    .should('be.visible');

  cy
    .log('type the list name')
    .get('[data-cy=add-list-input]')
    .type('new list{enter}');

  cy
    .log('list is visible')
    .get('[data-cy=list]')
    .should('be.visible');

});

it('start typing new list name and close it', () => {

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('add a list')
    .get('[data-cy=add-list]')
    .click();

  cy
    .get('[data-cy=cancel]')
    .click();

  cy
    .log('options disappear')
    .get('[data-cy=add-list-options]')
    .should('not.be.visible');

});

it('start typing new list name and try to save it', () => {

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('add a list')
    .get('[data-cy=add-list]')
    .click();

  cy
    .get('[data-cy=save]')
    .click();

  cy
    .log('options disappear')
    .get('[data-cy=add-list-options]')
    .should('not.be.visible');

});

it('shows an error message when ther’s a network error', () => {

  cy
    .intercept('POST', '/api/lists', {
      forceNetworkError: true
    }).as('createList');

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('add a list')
    .get('[data-cy=add-list]')
    .click();

  cy
    .log('type the list name')
    .get('[data-cy=add-list-input]')
    .type('new list{enter}');

  cy
    .log('error message appears')
    .get('#errorMessage')
    .should('be.visible');

  cy
    .log('error message disappears')
    .get('#errorMessage')
    .should('not.be.visible');

});

it('updates list name', () => {

  cy
    .intercept('PATCH', '/api/lists')
    .as('updateList');

  cy
    .addListApi({ boardIndex: 0, title: 'new list' });

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('change list name')
    .get('[data-cy=list-name]')
    .clear()
    .type('renamed list{enter}');

  cy
    .wait('@updateList')
    .its('response.statusCode')
    .should('eq', 200);

});

it('deletes list', () => {

  cy
    .intercept('DELETE', '/api/lists')
    .as('deleteList');

  cy
    .addListApi({ boardIndex: 0, title: 'new list' });

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('change list name')
    .get('[data-cy=list] .dropdown')
    .click();

  cy
    .contains('span', 'Delete list')
    .click();

  cy
    .wait('@deleteList')
    .its('response.statusCode')
    .should('eq', 200);

});