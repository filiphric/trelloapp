describe('User should be able to create, edit or delete list from the board', () => {

  let newUser;
  let boardId;
  let listId;

  before(() => {
    cy.fixture('user').then((user) => {
      newUser = user;
      cy.deleteAllUsers();
      cy.signUpUser(newUser.email, newUser.password);
      cy.createTestBoard().then((newBoardId) => {
        boardId = newBoardId;
      });
    });
  });

  it('User should be able to create a new list on the board', () => {
    cy.server();
    cy.route('POST', '/api/lists').as('createList');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.CreateList_title').click();
    cy.get('.CreateList_input').should('be.visible').type('My new list');
    cy.get('.CreateList_input').invoke('val').then((text) => {
      expect(text).to.eq('My new list');
    });
    cy.get('.CreateList_options > .Button').click();
    cy.wait('@createList').then((res) => {
      listId = res.responseBody.id;
      cy.get(`[data-id="${listId}"]`).should('be.visible');
      cy.get('.List_addTask').should('contain', 'Add new task').and('be.visible');
    });
  });

  it('User should be able to edit created list on the board', () => {
    cy.server();
    cy.route('PATCH', `api/lists/${listId}`).as('updateList');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.wait(1000);
    cy.get(`[data-id="${listId}"] > .Input`)
      .click()
      .clear()
      .type('Mine new list');
    cy.get('.ListContainer').click();
    cy.wait('@updateList').then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('User should be able to delete created list', () => {
    cy.server();
    cy.route('DELETE', `api/lists/${listId}`).as('deleteList');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get(`[data-id="${listId}"] > .dropdown > .options`).click();
    cy.get(`[data-id="${listId}"] > .dropdown > #myDropdown > .delete`).click();
    cy.wait('@deleteList').then((res) => {
      expect(res.status).to.eq(200);
      cy.get(`[data-id="${listId}"]`).should('not.exist');
    });
  });

  after(() => {
    cy.deleteTestBoard(boardId);
  });
});
