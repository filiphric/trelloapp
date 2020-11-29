import '../support/commands/addBoardApi';

describe('Boards functionality', () => {

  beforeEach(() => {

    cy
      .request('POST', '/reset');

    cy
      .intercept('POST', '**/api/boards').as('createBoard')
      .intercept('GET', '**/api/boards').as('boardList')
      .intercept('GET', '**/api/boards/*').as('boardInfo')
      .intercept('PATCH', '**/api/boards/*').as('boardUpdate')
      .intercept('DELETE', '/api/boards/*').as('deleteBoard');

  });

  it('creates board via enter button', () => {

    cy
      .visit('/');

    cy
      .log('click on create a board button')
      .get('#new-board')
      .click();

    cy
      .log('type in bard name and hit enter')
      .get('.board_addBoard')
      .type('new board{enter}');

    cy
      .log('create board request is fired')
      .wait('@createBoard')
      .then(({ request, response }) => {

        expect(response.statusCode).to.eq(201);
        expect(request.body.name).to.eq('new board');
        expect(response.body.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(response.body.id).to.exist;
        expect(response.body.name).to.eq('new board');
        expect(response.body.starred).to.be.false;
        expect(response.body.user).to.eq(0);

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${response.body.id}`);

      });

  });

  it('creates board via save button', () => {

    cy
      .visit('/');

    cy
      .log('click on create a board button')
      .get('#new-board')
      .click();

    cy
      .log('type in bard name')
      .get('.board_addBoard')
      .type('new board');

    cy
      .log('click save button')
      .get('#new-board .Button')
      .click();

    cy
      .log('create board request is fired')
      .wait('@createBoard')
      .then(({ response, request }) => {

        expect(response.statusCode).to.eq(201);
        expect(request.body.name).to.eq('new board');
        expect(response.body.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(response.body.id).to.exist;
        expect(response.body.name).to.eq('new board');
        expect(response.body.starred).to.be.false;
        expect(response.body.user).to.eq(0);

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${response.body.id}`);

      });

  });

  it('starts to create board and cancels', () => {

    cy
      .visit('/');

    cy
      .log('click on create a board button')
      .get('#new-board')
      .click()
      .should('have.class', 'board_newItem-active');

    cy
      .log('type in board name')
      .get('.board_addBoard')
      .type('new board');

    cy
      .log('click on x button')
      .get('.board_options .Cancel')
      .click();

    cy
      .log('create board interface disappears')
      .get('#new-board')
      .should('not.have.class', 'board_newItem-active')
      .get('.board_addBoard')
      .should('not.be.visible');

    cy
      .log('click on create a board button')
      .get('#new-board')
      .click();

    cy
      .log('board name has input value stored')
      .get('.board_addBoard')
      .should('have.value', 'new board');

  });

  it('enters a board', () => {

    cy
      .log('create a new board via api')
      .addBoardApi('new board');

    cy
      .visit('/');

    cy
      .get('.board_item')
      .click();

    cy
      .wait('@boardInfo')
      .then(({ response }) => {

        expect(response.statusCode).to.eq(200);
        expect(response.body.name).to.eq('new board');
        expect(response.body.user).to.eq(0);
        expect(response.body.id).to.eq(Cypress.env('boards')[0].id);
        expect(response.body.starred).to.eq(false);
        expect(response.body.created).to.eq(Cypress.env('boards')[0].created);
        expect(response.body.lists).to.be.empty;
        expect(response.body.tasks).to.be.empty;

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${Cypress.env('boards')[0].id}`);

      });

    cy
      .log('board name is visible on board')
      .get('.boardDetail_title')
      .should('have.value', 'new board');

  });

  it('renames a board', () => {

    cy
      .log('create a new board via api')
      .addBoardApi('new board')
      .then(() => {

        cy
          .visit(`/board/${Cypress.env('boards')[0].id}`);

      });

    cy
      .get('.boardDetail_title')
      .clear()
      .type('updated board name{enter}');

    cy
      .wait('@boardUpdate')
      .then(({ request, response }) => {

        expect(response.statusCode).to.eq(200);
        expect(request.body.name).to.eq('updated board name');
        expect(response.body.id).to.exist;
        expect(response.body.name).to.eq('updated board name');
        expect(response.body.starred).to.be.false;
        expect(response.body.user).to.eq(0);

      });

    cy
      .log('board name is update')
      .get('.boardDetail_title')
      .should('have.value', 'updated board name');

  });

  it('stars/unstars board', () => {

    cy
      .log('create a new board via api')
      .addBoardApi('new board');

    cy
      .visit('/');

    cy
      .log('created board is visible')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 1);

    cy
      .log('click on star button')
      .get('.Star')
      .click({ force: true });

    cy
      .wait('@boardUpdate.1')
      .then(({ response, request }) => {

        expect(response.statusCode).to.eq(200);
        expect(request.body.starred).to.be.true;
        expect(response.body.id).to.exist;
        expect(response.body.name).to.eq('new board');
        expect(response.body.starred).to.be.true;
        expect(response.body.user).to.eq(0);

      });

    cy
      .log('starred section appears');

    cy
      .contains('h1.background_title', 'My Starred')
      .should('be.visible')
      .as('starredSection');

    cy
      .log('one item is present in starred section')
      .get('@starredSection')
      .next()
      .find('.board_item')
      .should('be.visible')
      .should('have.length', 1);

    cy
      .log('two board items are on page')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 2);

    cy
      .log('click on unstar button')
      .get('@starredSection')
      .next()
      .find('.Star')
      .click({ force: true });

    cy
      .wait('@boardUpdate.2')
      .then(({ request, response }) => {

        expect(response.statusCode).to.eq(200);
        expect(request.body.starred).to.be.false;
        expect(response.body.id).to.exist;
        expect(response.body.name).to.eq('new board');
        expect(response.body.starred).to.be.false;
        expect(response.body.user).to.eq(0);

      });

    cy
      .log('starred section disappears');

    cy
      .contains('h1.background_title', 'My Starred')
      .should('not.be.visible');

    cy
      .log('one board items are on page')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 1);

  });

  it('deletes board', () => {

    cy
      .log('create a new board via api')
      .addBoardApi('new board');

    cy
      .then(() => {

        cy
          .visit(`/board/${Cypress.env('boards')[0].id}`);

      });

    cy
      .log('click on board dropdown menu')
      .get('.boardDetail_info .dropdown')
      .click();

    cy
      .log('click on delete board item')
      .get('.boardDetail_info .delete')
      .should('contain.text', 'Delete board')
      .click();

    cy
      .wait('@deleteBoard')
      .then(({ response }) => {
        expect(response.statusCode).to.eq(200);
        expect(response.body).to.be.empty;
      });

    cy
      .log('user gets redirected to homepage')
      .location('pathname')
      .should('eq', '/');

  });

  it('closes delete board dropdown', () => {

    cy
      .log('create a new board via api')
      .addBoardApi('new board');

    cy
      .then(() => {

        cy
          .visit(`/board/${Cypress.env('boards')[0].id}`);

      });

    cy
      .log('click on board dropdown menu')
      .get('.boardDetail_info .dropdown')
      .click();

    cy
      .log('click on overlay')
      .get('.boardDetail_info .invisible-overlay')
      .click();

    cy
      .log('board dropdown menu disappears')
      .get('.boardDetail_info .delete')
      .should('not.be.visible');

    cy
      .log('overlay stops existing')
      .get('.boardDetail_info .invisible-overlay')
      .should('have.css', 'display', 'none');

  });

  it.skip('creates board via api', () => {

    cy
      .visit('/');

    cy
      .wait('@boardList')
      .its('response.body')
      .should('be.empty');

    cy
      .log('create a new board via api')
      .addBoardApi('new board');

    cy
      .log('created board is visible')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 1);

  });

  it('renames a board via api', () => {

    cy
      .log('create a new board via api')
      .addBoardApi('new board');

    cy
      .then(() => {

        cy
          .visit(`/board/${Cypress.env('boards')[0].id}`);

      });

    cy
      .log('board name is visible')
      .get('.boardDetail_title')
      .should('have.value', 'new board');

    cy
      .then(() => {

        cy
          .request('PATCH', `/api/boards/${Cypress.env('boards')[0].id}`, {
            name: 'updated board name'
          });

      });

    cy
      .log('board name is updated')
      .get('.boardDetail_title')
      .should('have.value', 'updated board name');

  });

  it.only('stars/unstars board via api', () => {

    cy
      .log('create a new board via api')
      .addBoardApi('new board');

    cy
      .visit('/');

    cy
      .log('created board is visible')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 1);

    cy
      .log('starred section appears')
      .contains('h1.background_title', 'My Starred')
      .should('be.visible')
      .as('starredSection');

    cy
      .log('one item is present in starred section')
      .get('@starredSection')
      .next()
      .find('.board_item')
      .should('be.visible')
      .should('have.length', 1);

    cy
      .log('two board items are on page')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 2);

    cy
      .request('PATCH', `/api/boards/${Cypress.env('boards')[0].id}`, { starred: false });

    cy
      .log('starred section disappears');

    cy
      .contains('h1.background_title', 'My Starred')
      .should('not.be.visible');

    cy
      .log('one board items are on page')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 1);

  });

  it('deletes board via api', () => {

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' })
      .as('createBoardRequest');

    cy
      .visit('/');

    cy
      .log('created board is visible')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 1);

    cy
      .get('@createBoardRequest')
      .then(({ body }) => {
        cy
          .request('DELETE', `/api/boards/${body.id}`)
          .then(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body).to.be.empty;
          });
      });

    cy
      .log('created board disappears')
      .get('.board_item')
      .should('have.length', 0);

  });

});