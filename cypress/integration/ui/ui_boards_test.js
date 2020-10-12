describe('User should be able to create, edit or delete board on the page', () => {

  let newUser;
  let boardId;

  before(() => {
    cy.fixture('user').then((user) => {
      newUser = user;
      cy.deleteAllUsers();
      cy.signUpUser(newUser.email, newUser.password);
    });
  });

  it('User should be able to create new board', () => {
    cy.server();
    cy.route('POST', '/api/boards').as('createBoard');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get('[data-cy=create-board]').should('exist').and('be.visible').click();
    cy.get('.board_addBoard').should('exist').and('be.visible');
    cy.get('.board_addBoard').type('My new board');
    cy.get('.board_options > .Button').click();
    cy.wait('@createBoard').then((res) => {
      boardId = res.responseBody.id;
      cy.url().should('contain', `board/${boardId}`);
      cy.get('.boardDetail_info').should('exist').and('be.visible');
      cy.wait(1000);
      cy.get('.boardDetail_title').should('be.visible').invoke('val').then((text) => {
        expect(text).to.eq('My new board');
      });
      cy.get('.Nav_boards').click();
      cy.get(`[data-id="board_${boardId}"]`).should('exist').and('be.visible');
    });
  });

  it('User should be able to edit created board', () => {
    cy.visit('/');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.boardDetail_title')
      .click()
      .clear()
      .type('Mine new board');
    cy.get('.ListContainer').click();
    cy.get('.Nav_boards').click();
    cy.get(`[data-id="board_${boardId}"] > .board_title`).invoke('text').then((text) => {
      expect(text).to.eq('Mine new board');
    });
  });

  it('User should be able to delete created board', () => {
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.boardDetail_info > .dropdown > .options').click();
    cy.get('.boardDetail_info > .dropdown > #myDropdown > .delete').should('be.visible').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.get(`[data-id="board_${boardId}"]`).should('not.exist');
  });
});
