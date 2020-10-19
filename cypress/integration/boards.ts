describe('Boards functionality', () => {

  beforeEach(() => {

    cy
      .request('POST', '/reset');

    cy
      .server();

    cy
      .route('POST', '/api/boards').as('createBoard')
      .route('GET', '/api/boards').as('boardList');

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
      .then(({ status, requestBody, responseBody }) => {

        expect(status).to.eq(201);
        expect(requestBody.name).to.eq('new board');
        expect(responseBody.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(responseBody.id).to.exist;
        expect(responseBody.name).to.eq('new board');
        expect(responseBody.starred).to.be.false;
        expect(responseBody.user).to.eq(0);

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${responseBody.id}`);

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
      .then(({ responseBody, requestBody, status }) => {

        expect(status).to.eq(201);
        expect(requestBody.name).to.eq('new board');
        expect(responseBody.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(responseBody.id).to.exist;
        expect(responseBody.name).to.eq('new board');
        expect(responseBody.starred).to.be.false;
        expect(responseBody.user).to.eq(0);

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${responseBody.id}`);

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
      .route('/api/boards/*').as('boardInfo');

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' })
      .as('createBoardRequest');

    cy
      .visit('/');

    cy
      .get('.board_item')
      .click();

    cy
      .get('@createBoardRequest')
      .then(({ body }) => {

        cy
          .wait('@boardInfo')
          .then(({ responseBody, status }) => {

            expect(status).to.eq(200);
            expect(responseBody.name).to.eq('new board');
            expect(responseBody.user).to.eq(0);
            expect(responseBody.id).to.eq(body.id);
            expect(responseBody.starred).to.eq(false);
            expect(responseBody.created).to.eq(body.created);
            expect(responseBody.lists).to.be.empty;
            expect(responseBody.tasks).to.be.empty;
          });

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${body.id}`);

        cy
          .log('board name is visible on board')
          .get('.boardDetail_title')
          .should('have.value', 'new board');

      });

  });

  it('renames a board', () => {

    cy
      .route('PATCH', '/api/boards/*').as('boardUpdate');

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' })
      .as('createBoardRequest');

    cy
      .get('@createBoardRequest').then(({ body }) => {

        cy
          .visit(`/board/${body.id}`);

      });

    cy
      .get('.boardDetail_title')
      .clear()
      .type('updated board name{enter}');

    cy
      .wait('@boardUpdate.1')
      .then(({ status, responseBody, requestBody }) => {

        expect(status).to.eq(200);
        expect(requestBody.name).to.eq('updated board name');
        expect(responseBody.id).to.exist;
        expect(responseBody.name).to.eq('updated board name');
        expect(responseBody.starred).to.be.false;
        expect(responseBody.user).to.eq(0);

      });

    cy
      .log('board name is update')
      .get('.boardDetail_title')
      .should('have.value', 'updated board name');

  });

  it('stars/unstars board', () => {

    cy
      .route('PATCH', '/api/boards/*').as('boardUpdate');

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' });

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
      .then(({ status, requestBody, responseBody }) => {

        expect(status).to.eq(200);
        expect(requestBody.starred).to.be.true;
        expect(responseBody.id).to.exist;
        expect(responseBody.name).to.eq('new board');
        expect(responseBody.starred).to.be.true;
        expect(responseBody.user).to.eq(0);

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
      .then(({ responseBody, requestBody, status }) => {

        expect(status).to.eq(200);
        expect(requestBody.starred).to.be.false;
        expect(responseBody.id).to.exist;
        expect(responseBody.name).to.eq('new board');
        expect(responseBody.starred).to.be.false;
        expect(responseBody.user).to.eq(0);

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
      .route('DELETE', '/api/boards/*').as('deleteBoard');

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' })
      .as('createBoardRequest');

    cy
      .get('@createBoardRequest').then(({ body }) => {

        cy
          .visit(`/board/${body.id}`);

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
      .then(({ status, responseBody }) => {
        expect(status).to.eq(200);
        expect(responseBody).to.be.empty;
      });

    cy
      .log('user gets redirected to homepage')
      .location('pathname')
      .should('eq', '/');

  });

  it('closes delete board dropdown', () => {

    cy
      .route('DELETE', '/api/boards/*').as('deleteBoard');

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' })
      .as('createBoardRequest');

    cy
      .get('@createBoardRequest').then(({ body }) => {

        cy
          .visit(`/board/${body.id}`);

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

  it('creates board via api', () => {

    cy
      .visit('/');

    cy
      .wait('@boardList')
      .its('responseBody')
      .should('be.empty');

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' })
      .then(({ status, body }) => {

        expect(status).to.eq(201);
        expect(body.name).to.eq('new board');
        expect(body.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(body.id).to.exist;
        expect(body.name).to.eq('new board');
        expect(body.starred).to.be.false;
        expect(body.user).to.eq(0);

      });

    cy
      .log('created board is visible')
      .get('.board_item')
      .should('be.visible')
      .should('have.length', 1);

  });

  it('renames a board via api', () => {

    cy
      .log('create a new board via api')
      .request('POST', '/api/boards', { name: 'new board' })
      .as('createBoardRequest');

    cy
      .get('@createBoardRequest').then(({ body }) => {

        cy
          .visit(`/board/${body.id}`);

      });

    cy
      .log('board name is visible')
      .get('.boardDetail_title')
      .should('have.value', 'new board');

    cy
      .get('@createBoardRequest').then(({ body }) => {

        cy
          .request('PATCH', `/api/boards/${body.id}`, {
            name: 'updated board name'
          });

      });

    cy
      .log('board name is updated')
      .get('.boardDetail_title')
      .should('have.value', 'updated board name');

  });

  it('stars/unstars board via api', () => {

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
          .request('PATCH', `/api/boards/${body.id}`, { starred: true })
          .then(({ status, body }) => {

            expect(status).to.eq(200);
            expect(body.starred).to.be.true;
            expect(body.id).to.exist;
            expect(body.name).to.eq('new board');
            expect(body.starred).to.be.true;
            expect(body.user).to.eq(0);

          });
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
      .get('@createBoardRequest')
      .then(({ body }) => {
        cy
          .request('PATCH', `/api/boards/${body.id}`, { starred: false })
          .then(boardUpdate => {

            expect(boardUpdate.status).to.eq(200);
            expect(boardUpdate.body.starred).to.be.false;
            expect(boardUpdate.body.id).to.exist;
            expect(boardUpdate.body.name).to.eq('new board');
            expect(boardUpdate.body.starred).to.be.false;
            expect(boardUpdate.body.user).to.eq(0);

          });

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