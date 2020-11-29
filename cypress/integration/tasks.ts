import '../support/commands/addBoardApi';
import '../support/commands/addListApi';
import '../support/commands/addTaskApi';

describe('Tasks behavior', () => {

  beforeEach(() => {

    cy
      .request('POST', '/api/reset');

    cy
      .intercept('POST', '**/api/tasks').as('createTask')
      .intercept('DELETE', '**/api/tasks/*').as('deleteTask');

    cy
      .addBoardApi('hello board')
      .addListApi({ title: 'hello list' });

  });

  it('create a task', () => {

    const taskName = 'new task';

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .get('.List_addTask')
      .click();

    cy
      .get('.ListContainer .TextArea')
      .should('be.visible')
      .type(`${taskName}{enter}`);

    cy
      .wait('@createTask')
      .then(({ response, request }) => {

        expect(response.statusCode).eq(201);
        expect(response.body.boardId).to.exist;
        expect(response.body.completed).to.be.false;
        expect(response.body.created).to.exist;
        expect(response.body.deadline).to.exist;
        expect(response.body.description).to.be.empty;
        expect(response.body.id).to.exist;
        expect(response.body.listId).to.exist;
        expect(response.body.title).to.eq(taskName);

        expect(request.body.boardId).to.exist;
        expect(request.body.completed).to.be.false;
        expect(request.body.description).to.be.empty;
        expect(request.body.listId).to.exist;
        expect(request.body.title).to.eq(taskName);

      });

    cy
      .get('.Task')
      .should('be.visible');

  });

  it.only('deletes a task', () => {

    cy
      .addTaskApi({ title: 'new task' });

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .get('.Task')
      .should('be.visible');

    cy
      .contains('.Task', 'new task')
      .click();

    cy
      .log('modal appears')
      .get('.TaskModule')
      .should('be.visible');

    cy
      .log('click on three dots')
      .get('.TaskModule .dropdown')
      .click();

    cy
      .contains('span', 'Delete')
      .click();

    cy
      .wait('@deleteTask')
      .its('response.statusCode')
      .should('eq', 200);

    cy
      .get('.Task')
      .should('not.exist');

  });

});