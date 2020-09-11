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
      .then(board => {

        expect(board.status).to.eq(201);
        expect(board.requestBody.name).to.eq('new board');
        expect(board.responseBody.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(board.responseBody.id).to.exist;
        expect(board.responseBody.name).to.eq('new board');
        expect(board.responseBody.starred).to.be.false;
        expect(board.responseBody.user).to.eq(0);

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${board.responseBody.id}`);

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
      .then(board => {

        expect(board.status).to.eq(201);
        expect(board.requestBody.name).to.eq('new board');
        expect(board.responseBody.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(board.responseBody.id).to.exist;
        expect(board.responseBody.name).to.eq('new board');
        expect(board.responseBody.starred).to.be.false;
        expect(board.responseBody.user).to.eq(0);

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${board.responseBody.id}`);

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
      .then(createBoardRequest => {

        cy
          .wait('@boardInfo')
          .then(boardInfo => {

            expect(boardInfo.status).to.eq(200);
            expect(boardInfo.responseBody.name).to.eq('new board');
            expect(boardInfo.responseBody.user).to.eq(0);
            expect(boardInfo.responseBody.id).to.eq(createBoardRequest.body.id);
            expect(boardInfo.responseBody.starred).to.eq(false);
            expect(boardInfo.responseBody.created).to.eq(createBoardRequest.body.created);
            expect(boardInfo.responseBody.lists).to.be.empty;
            expect(boardInfo.responseBody.tasks).to.be.empty;
          });

        cy
          .log('user is redirected into board')
          .location()
          .its('pathname')
          .should('eq', `/board/${createBoardRequest.body.id}`);

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
      .get('@createBoardRequest').then(board => {

        cy
          .visit(`/board/${board.body.id}`);

      });

    cy
      .get('.boardDetail_title')
      .clear()
      .type('updated board name{enter}');

    cy
      .wait('@boardUpdate.1')
      .then(boardUpdate => {

        expect(boardUpdate.status).to.eq(200);
        expect(boardUpdate.requestBody.name).to.eq('updated board name');
        expect(boardUpdate.responseBody.id).to.exist;
        expect(boardUpdate.responseBody.name).to.eq('updated board name');
        expect(boardUpdate.responseBody.starred).to.be.false;
        expect(boardUpdate.responseBody.user).to.eq(0);

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
      .then(boardUpdate => {

        expect(boardUpdate.status).to.eq(200);
        expect(boardUpdate.requestBody.starred).to.be.true;
        expect(boardUpdate.responseBody.id).to.exist;
        expect(boardUpdate.responseBody.name).to.eq('new board');
        expect(boardUpdate.responseBody.starred).to.be.true;
        expect(boardUpdate.responseBody.user).to.eq(0);

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
      .then(boardUpdate => {

        expect(boardUpdate.status).to.eq(200);
        expect(boardUpdate.requestBody.starred).to.be.false;
        expect(boardUpdate.responseBody.id).to.exist;
        expect(boardUpdate.responseBody.name).to.eq('new board');
        expect(boardUpdate.responseBody.starred).to.be.false;
        expect(boardUpdate.responseBody.user).to.eq(0);

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
      .get('@createBoardRequest').then(board => {

        cy
          .visit(`/board/${board.body.id}`);

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
      .then(deleteBoard => {
        expect(deleteBoard.status).to.eq(200);
        expect(deleteBoard.responseBody).to.be.empty;
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
      .get('@createBoardRequest').then(board => {

        cy
          .visit(`/board/${board.body.id}`);

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
      .then(board => {

        expect(board.status).to.eq(201);
        expect(board.body.name).to.eq('new board');
        expect(board.body.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(board.body.id).to.exist;
        expect(board.body.name).to.eq('new board');
        expect(board.body.starred).to.be.false;
        expect(board.body.user).to.eq(0);

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
      .get('@createBoardRequest').then(board => {

        cy
          .visit(`/board/${board.body.id}`);

      });

    cy
      .log('board name is visible')
      .get('.boardDetail_title')
      .should('have.value', 'new board');

    cy
      .get('@createBoardRequest').then(board => {

        cy
          .request('PATCH', `/api/boards/${board.body.id}`, {
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
      .then(createBoardRequest => {
        cy
          .request('PATCH', `/api/boards/${createBoardRequest.body.id}`, { starred: true })
          .then(boardUpdate => {

            expect(boardUpdate.status).to.eq(200);
            expect(boardUpdate.body.starred).to.be.true;
            expect(boardUpdate.body.id).to.exist;
            expect(boardUpdate.body.name).to.eq('new board');
            expect(boardUpdate.body.starred).to.be.true;
            expect(boardUpdate.body.user).to.eq(0);

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
      .then(createBoardRequest => {
        cy
          .request('PATCH', `/api/boards/${createBoardRequest.body.id}`, { starred: false })
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
      .then(createBoardRequest => {
        cy
          .request('DELETE', `/api/boards/${createBoardRequest.body.id}`)
          .then(deleteBoard => {
            expect(deleteBoard.status).to.eq(200);
            expect(deleteBoard.body).to.be.empty;
          });
      });

    cy
      .log('created board disappears')
      .get('.board_item')
      .should('have.length', 0);

  });

});