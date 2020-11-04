describe('List functionality', () => {

  beforeEach(() => {

    cy
      .request('POST', '/reset');

    cy
      .request('POST', '/api/boards', {
        name: 'new board'
      }).then(board => {
        Cypress.env('boards', board.body);
      });

    cy
      .server();

    cy
      .route('POST', '/api/lists').as('createList')
      .route('PATCH', '/api/lists/*').as('updateList');

  });

  it('creates a list', () => {

    cy
      .visit(`/board/${Cypress.env('boards').id}`);

    cy
      .get('.CreateList_title')
      .type('new list{enter}');

    cy
      .wait('@createList')
      .then(list => {

        expect(list.status).to.eq(201);
        expect(list.responseBody.boardId).to.eq(Cypress.env('boards').id);
        expect(list.responseBody.title).to.eq('new list');
        expect(list.responseBody.boardId).to.eq(Cypress.env('boards').id);
        expect(list.responseBody.created).to.eq(Cypress.moment().format('YYYY-MM-DD'));
        expect(list.responseBody.id).to.exist;
        expect(list.responseBody.title).to.eq('new list');

      });

    cy
      .get('.List')
      .should('be.visible');

  });

  it.only('renames a list', () => {

    cy
      .request('POST', '/api/lists', {
        boardId: Cypress.env('boards').id,
        title: 'new list'
      }).then(({ body }) => {
        Cypress.env('lists', body);
      });

    cy
      .visit(`/board/${Cypress.env('boards').id}`);

    cy
      .get('.taskTitle')
      .clear()
      .type('new list title{enter}');

    cy
      .wait('@updateList')
      .then(({ status, requestBody, responseBody }) => {

        expect(status).to.eq(200);
        expect(requestBody.title).to.eq('new list title');
        expect(responseBody.created).to.eq(Cypress.env('boards').created);
        expect(responseBody.id).to.exist;
        expect(responseBody.boardId).to.eq(Cypress.env('boards').id);

      });

  });

  it('deletes a list', () => {

  });

  it('creates a list via api', () => {

  });

  it('renames a list via api', () => {

  });

  it('deletes a list via api', () => {

  });

});