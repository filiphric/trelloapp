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

it('update board name', () => {

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .get('[data-cy="board-title"]')
    .should('have.value', 'new board')
    .clear()
    .type('updated board name{enter}')
    .should('have.value', 'updated board name');

});

it('adds, updates and deletes a task', () => {

  cy
    .addListApi({ boardIndex: 0, title: 'new list' });

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('click on add task button')
    .get('[data-cy="add-task"]')
    .click();

  cy
    .log('task options appear')
    .get('[data-cy="task-options"]')
    .should('be.visible');

  cy
    .log('type the task name')
    .get('[data-cy="task-input"]')
    .type('new task{enter}');

  cy
    .log('task is created')
    .get('[data-cy="task"]')
    .should('be.visible');

  cy
    .get('[data-cy="task"]')
    .click();

  cy
    .log('task module appears')
    .get('[data-cy="task-module"]')
    .should('be.visible');

  cy
    .log('change the task name')
    .get('[data-cy="task-module-name"]')
    .clear()
    .type('updated task name{enter}');

  cy
    .log('open dropdown')
    .get('[data-cy="task-module-close"]')
    .click();

  cy
    .log('dropdown appear')
    .get('[data-cy="task-dropdown"]');

  cy
    .contains('Delete task')
    .click();

  cy
    .log('task module diappears')
    .get('[data-cy="task-module"]')
    .should('not.be.visible');

  cy
    .log('task disappears')
    .get('[data-cy="task"]')
    .should('not.exist');

});