describe('User should be able to log in and log out', () => {

  let newUser;

  before(() => {
    cy.fixture('user').then((user) => {
      newUser = user;
      cy.deleteAllUsers();
      cy.signUpUser(newUser.email, newUser.password);
    });
  });

  it('Should log in user', () => {
    cy.server();
    cy.route('/api/users').as('pageLoads');
    cy.visit('/');
    cy.get('.Nav > :nth-child(3)').click();
    cy.get('.LoginModule').should.exist;
    cy.get('[style=""] > .LoginModule_title').as('title').invoke('text').then((text) => {
      expect(text).to.eq('Log in to your account');
    });
    cy.get('.welcomeEmail .checkmark').should('not.be.visible');
    cy.get('#loginEmail').type(newUser.email);
    cy.get('#loginPassword').type(newUser.password);
    cy.get('[style=""] > .credentials > .LoginModule_buttons > .Button').click();
    cy.get('.Nav > [style=""]').invoke('text').then((text) => {
      expect(text).to.contain(newUser.email);
    });
  });

  it('Should not log in user with bad credentials', () => {
    cy.server();
    cy.route('POST', '/login').as('login');
    cy.visit('/');
    cy.get('.Nav > :nth-child(3)').click();
    cy.get('.LoginModule').should.exist;
    cy.get('[style=""] > .LoginModule_title').as('title').invoke('text').then((text) => {
      expect(text).to.eq('Log in to your account');
    });
    cy.get('#loginEmail').type('newUser.email');
    cy.get('#loginPassword').type(newUser.password);
    cy.get('[style=""] > .credentials > .LoginModule_buttons > .Button').click();
    cy.wait('@login').then((res) => {
      expect(res.status).to.eq(400);
    });
    cy.get('.Nav > :nth-child(3)').invoke('text').then((text) => {
      expect(text).to.contain('Log in');
    });
  });
});
