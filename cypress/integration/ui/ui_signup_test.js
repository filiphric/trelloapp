describe('User should be able to sign up', () => {

  let newUser;

  beforeEach(() => {
    cy.fixture('user').then((user) => {
      newUser = user;
    });
    cy.deleteAllUsers();
  });

  it('Should sign up new user (without a welcome email)', () => {
    cy.server();
    cy.route('/api/users').as('pageLoads');
    cy.visit('/');
    cy.get('.Nav > :nth-child(3)').click();
    cy.get('.LoginModule').should.exist;
    cy.get('[style=""] > .LoginModule_title').as('title').invoke('text').then((text) => {
      expect(text).to.eq('Log in to your account');
    });
    cy.get('[style=""] > .LoginModule_logSignSwitch > a').as('signupButton').invoke('text').then((text) => {
      expect(text).to.eq('Sign up here');
      cy.get('@signupButton').click();
    });
    cy.get('[style=""] > .LoginModule_title').invoke('text').then((text) => {
      expect(text).to.eq('Sign up to create a free account');
    });
    cy.get('.welcomeEmail .checkmark').should('not.be.checked');
    cy.get('#signupEmail').type(newUser.email);
    cy.get('#signupPassword').type(newUser.password);
    cy.get('[style=""] > .credentials > .LoginModule_buttons > .Button').click();
    cy.get('.Nav > [style=""]').invoke('text').then((text) => {
      expect(text).to.contains(newUser.email);
    });
  });

  it('Should sign up new user (with a welcome email)', () => {
    cy.server();
    cy.route('POST', '/welcomeemail').as('welcomeEmail');
    cy.visit('/');
    cy.get('.Nav > :nth-child(3)').click();
    cy.get('.LoginModule').should.exist;
    cy.get('[style=""] > .LoginModule_title').as('title').invoke('text').then((text) => {
      expect(text).to.eq('Log in to your account');
    });
    cy.get('[style=""] > .LoginModule_logSignSwitch > a').as('signupButton').invoke('text').then((text) => {
      expect(text).to.eq('Sign up here');
      cy.get('@signupButton').click();
    });
    cy.get('[style=""] > .LoginModule_title').invoke('text').then((text) => {
      expect(text).to.eq('Sign up to create a free account');
    });
    cy.get('.welcomeEmail .checkmark').click();
    cy.get('.welcomeEmail .checkmark').should('be.checked');
    cy.get('#signupEmail').type(newUser.email);
    cy.get('#signupPassword').type(newUser.password);
    cy.get('[style=""] > .credentials > .LoginModule_buttons > .Button').click();
    cy.wait('@welcomeEmail').then((res) => {
      expect(res.status).to.eq(201);
    });
  });
});
