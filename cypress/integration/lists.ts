import '../support/commands/addBoardApi';
import '../support/commands/addListApi';
import '../support/commands/deleteListApi';
import '../support/commands/renameListApi';
import '../support/commands/reorderListApi';

describe('List functionality', () => {

  beforeEach(() => {

    cy
      .request('POST', '/reset');

    cy
      .addBoardApi('new board');

    cy
      .intercept('POST', '**/api/lists').as('createList')
      .intercept('PATCH', '**/api/lists/*').as('updateList')
      .intercept('GET', '**/api/boards/*').as('boardInfo');

  });

  it('creates a list', () => {

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .get('.CreateList_title')
      .type('new list{enter}');

    cy
      .wait('@createList')
      .then(({ response }) => {

        expect(response.statusCode).to.eq(201);
        expect(response.body.boardId).to.eq(Cypress.env('boards')[0].id);
        expect(response.body.title).to.eq('new list');
        expect(response.body.boardId).to.eq(Cypress.env('boards')[0].id);
        expect(response.body.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(response.body.id).to.exist;
        expect(response.body.title).to.eq('new list');

      });

    cy
      .get('.List')
      .should('be.visible');

  });

  it('renames a list', () => {

    cy
      .addListApi('new list');

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .get('.taskTitle')
      .clear()
      .type('new list title{enter}');

    cy
      .wait('@updateList')
      .then(({ response, request }) => {

        expect(response.statusCode).to.eq(200);
        expect(request.body.title).to.eq('new list title');
        expect(response.body.created).to.eq(Cypress.env('boards')[0].created);
        expect(response.body.id).to.exist;
        expect(response.body.boardId).to.eq(Cypress.env('boards')[0].id);

      });

  });

  it('deletes a list', () => {

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .wait('@boardInfo')
      .its('response.body.lists')
      .should('be.empty');

    cy
      .addListApi('new list');

    cy
      .get('.List')
      .should('be.visible');

    cy
      .get('.List .options')
      .click();

    cy
      .get('.List .delete')
      .contains('Delete')
      .click();

    cy
      .get('.List')
      .should('not.exist');

  });

  it('renames a list via api', () => {

    const name1 = 'new list';
    const name2 = 'even newer list';

    cy
      .addListApi({ title: name1 });

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .wait('@boardInfo')
      .its('response.body.lists')
      .should('have.length', 1);

    cy
      .get('.List')
      .should('be.visible');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .should('have.value', name1);

    cy
      .renameListApi({ title: name2 });

    cy
      .log('changed name is visible')
      .get('.taskTitle')
      .should('have.value', name2);

  });

  it.only('deletes a list via api', () => {

    cy
      .addListApi({ title: 'new list' });

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .wait('@boardInfo')
      .its('response.body.lists')
      .should('have.length', 1);

    cy
      .get('.List')
      .should('be.visible');

    cy
      .deleteListApi(0);

    cy
      .get('.List')
      .should('not.exist');

  });

  it('changes list order', () => {

    cy
      .addListApi({ title: 'list 1' })
      .addListApi({ title: 'list 2' });

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .wait('@boardInfo')
      .its('response.body.lists')
      .should('have.length', 2);

    cy
      .get('.List')
      .should('be.visible');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(0).as('list1')
      .should('have.value', 'list 1');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(1).as('list2')
      .should('have.value', 'list 2');

    cy
      .get('@list1')
      .drag('@list2');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(0)
      .should('have.value', 'list 2');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(1)
      .should('have.value', 'list 1');

  });

  it.skip('changes list order via api', () => {

    cy
      .addListApi({ title: 'list 1' })
      .addListApi({ title: 'list 2' });

    cy
      .visit(`/board/${Cypress.env('boards')[0].id}`);

    cy
      .wait('@boardInfo')
      .its('responseBody.lists')
      .should('have.length', 2);

    cy
      .get('.List')
      .should('be.visible');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(0).as('list1')
      .should('have.value', 'list 1');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(1).as('list2')
      .should('have.value', 'list 2');

    cy
      .reorderListApi({ order: 1, index: 0 })
      .reorderListApi({ order: 0, index: 1 });

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(0)
      .should('have.value', 'list 2');

    cy
      .log('name is visible')
      .get('.taskTitle')
      .eq(1)
      .should('have.value', 'list 1');

  });

});