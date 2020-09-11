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
      .route('POST', '/api/lists').as('createList');

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

  it('renames a list', () => {

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