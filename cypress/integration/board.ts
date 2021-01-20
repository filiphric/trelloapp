import '../support/commands/addBoardApi';
import '../support/commands/addListApi';
import '../support/commands/addTaskApi';

beforeEach(() => {

  cy
    .request('POST', '/reset');

  cy
    .addBoardApi('new board');

});

it('adds a new list', () => {

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  // start typing and cancel
  cy
    .log('add a list')
    .get('[data-cy=add-list]')
    .click();

  cy
    .log('options appear')
    .get('[data-cy=add-list-options]')
    .should('be.visible');

  cy
    .get('[data-cy=cancel]')
    .click();

  cy
    .log('options disappear')
    .get('[data-cy=add-list-options]')
    .should('not.be.visible');

  // type empty name of list
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

  // create a new list
  cy
    .log('add a list')
    .get('[data-cy=add-list]')
    .click();

  cy
    .log('type the list name')
    .get('[data-cy=add-list-input]')
    .type('new list{enter}');

  cy
    .log('list is visible')
    .get('[data-cy=list]')
    .should('be.visible');

  // update list name
  cy
    .log('change list name')
    .get('[data-cy=list-name]')
    .clear()
    .type('renamed list{enter}');

  cy
    .log('change list name')
    .get('[data-cy=list] .dropdown')
    .click();

  cy
    .get('[data-cy="copy-list-properties"]')
    .realClick()
    .task('getClipboard')
    .should('contain', 'title')
    .should('contain', 'id')
    .should('contain', 'created')
    .should('contain', 'boardId');

  cy
    .contains('span', 'Delete list')
    .click();

  cy
    .log('list is disappears')
    .get('[data-cy=list]')
    .should('not.exist');

});

it('adds, updates, checks, and deletes a task', () => {

  cy
    .addListApi({ boardIndex: 0, title: 'new list' });

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .log('click on add task button')
    .get('[data-cy="new-task"]')
    .click();

  cy
    .log('task options appear')
    .get('[data-cy="task-options"]')
    .should('be.visible');

  cy
    .get('[data-cy="add-task"]')
    .click();

  cy
    .log('task options appear')
    .get('[data-cy="task-options"]')
    .should('not.be.visible');

  cy
    .log('click on add task button')
    .get('[data-cy="new-task"]')
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
    .get('[data-cy="task-done"]')
    .check();

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

it('opens task detail', () => {

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .addListApi({ boardIndex: 0, title: 'new list' })
    .addTaskApi({ boardIndex: 0, listIndex: 0, title: 'new task' });

  cy
    .get('[data-cy="task"]')
    .click();

  cy
    .get('[data-cy="task-module"]')
    .should('be.visible');

  cy
    .get('[data-cy="task-description"]')
    .click();

  cy
    .get('[data-cy="task-description-input"]')
    .type('hello world');

  cy
    .get('[data-cy="task-description-save"]')
    .click();

  cy
    .get('[data-cy="task-deadline"]')
    .focus()
    .type(Cypress.moment().format('YYYY-MM-DD'))
    .blur();

  cy
    .get('[type="file"]')
    .attachFile('cypressLogo.png');

  cy
    .get('[data-cy="remove-image"]')
    .click();

  cy
    .log('open dropdown')
    .get('[data-cy="task-module-close"]')
    .click();

  cy
    .log('dropdown appear')
    .get('[data-cy="task-dropdown"]');

  cy
    .contains('Close task')
    .click();

});

it('sorts tasks and lists', () => {

  cy
    .addListApi({ boardIndex: 0, title: 'list 1' })
    .addListApi({ boardIndex: 0, title: 'list 2' })
    .addTaskApi({ boardIndex: 0, listIndex: 0, title: 'task 1' })
    .addTaskApi({ boardIndex: 0, listIndex: 0, title: 'task 2' });

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .get('[data-cy="task"]')
    .eq(0)
    .as('task1');

  cy
    .get('[data-cy="task"]')
    .eq(1)
    .as('task2');

  cy
    .get('@task1')
    .drag('@task2');

  cy
    .get('[data-cy="tasks-list"]')
    .eq(0)
    .as('taskList1');

  cy
    .get('[data-cy="tasks-list"]')
    .eq(1)
    .as('taskList2');

  cy
    .get('[data-cy="task"]')
    .drag('@taskList2');

  cy
    .get('[data-cy="list"]')
    .eq(0)
    .as('list1');

  cy
    .get('[data-cy="list"]')
    .eq(1)
    .as('list2');

  cy
    .get('@list2')
    .drag('@list1');

});

it('shows an error message when there’s a network error on creating list', () => {

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
    .clock();

  cy
    .log('type the list name')
    .get('[data-cy=add-list-input]')
    .type('new list{enter}');

  cy
    .log('error message appears')
    .get('#errorMessage')
    .should('be.visible');

  cy
    .tick(4000);

  cy
    .log('error message disappears')
    .get('#errorMessage')
    .should('not.be.visible');

});

it('shows an error message when there’s a network error on creating task', () => {

  cy
    .intercept('POST', '/api/tasks', {
      forceNetworkError: true
    }).as('createList');

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .addListApi({ boardIndex: 0, title: 'new list' });

  cy
    .log('add a list')
    .get('[data-cy=new-task]')
    .click();

  cy
    .clock();

  cy
    .log('type the list name')
    .get('[data-cy=task-input]')
    .type('new list{enter}');

  cy
    .log('error message appears')
    .get('#errorMessage')
    .should('be.visible');

  cy
    .tick(4000);

  cy
    .log('error message disappears')
    .get('#errorMessage')
    .should('not.be.visible');

});

it('update board name and delete board', () => {

  cy
    .visit(`/board/${Cypress.env('boards')[0].id}`);

  cy
    .get('[data-cy="board-title"]')
    .should('have.value', 'new board')
    .clear()
    .type('updated board name{enter}')
    .should('have.value', 'updated board name');

  cy
    .get('[data-cy="board-options"]')
    .click();

  cy
    .contains('Delete board')
    .click();

});