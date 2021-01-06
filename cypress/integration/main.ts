import '../support/commands/signupApi';

beforeEach(() => {

  cy
    .request('POST', '/reset');

});

it('signup new user with welcome email', () => {

  cy
    .intercept({
      method: 'POST',
      path: '/welcomeemail'
    }, 'success')
    .as('welcomeEmail');

  cy
    .visit('/');

  cy
    .get('[data-cy="login-menu"]')
    .click();

  cy
    .get('[data-cy="login-module"]')
    .should('be.visible');

  cy
    .get('[data-cy="close-login"]')
    .click();

  cy
    .get('[data-cy="login-menu"]')
    .click();

  cy
    .contains('Sign up here')
    .click();

  cy
    .get('[data-cy="signup-email"]')
    .type('filip@filiphric.sk');

  cy
    .get('[data-cy="signup-password"]')
    .type('abcd1234');

  cy
    .get('[data-cy="welcome-email-checkbox"]')
    .check();

  cy
    .get('[data-cy="signup"]')
    .click();

  cy
    .wait('@welcomeEmail');

  cy
    .get('[data-cy="login-module"]')
    .should('not.be.visible');

  cy
    .location('pathname')
    .should('eq', '/');

  cy
    .getCookie('trello_token')
    .should('exist');

});

it('signup user without welcome email', () => {

  cy
    .visit('/');

  cy
    .get('[data-cy="login-menu"]')
    .click();

  cy
    .get('[data-cy="login-module"]')
    .should('be.visible');

  cy
    .contains('Sign up here')
    .click();

  cy
    .get('[data-cy="signup-email"]')
    .type('filip@filiphric.sk');

  cy
    .get('[data-cy="signup-password"]')
    .type('abcd1234');

  cy
    .get('[data-cy="signup"]')
    .click();

  cy
    .get('[data-cy="login-module"]')
    .should('not.be.visible');

  cy
    .location('pathname')
    .should('eq', '/');

  cy
    .getCookie('trello_token')
    .should('exist');

});

it('signup existing user', () => {

  cy
    .signupApi({
      email: 'filip@filiphric.sk',
      password: 'abcd1234'
    });

  cy
    .visit('/');

  cy
    .get('[data-cy="login-menu"]')
    .click();

  cy
    .get('[data-cy="login-module"]')
    .should('be.visible');

  cy
    .contains('Sign up here')
    .click();

  cy
    .get('[data-cy="signup-email"]')
    .type('filip@filiphric.sk');

  cy
    .get('[data-cy="signup-password"]')
    .type('abcd1234');

  cy
    .get('[data-cy="signup"]')
    .click();

});

it('log in existing user', () => {

  cy
    .signupApi({
      email: 'filip@filiphric.sk',
      password: 'abcd1234'
    });

  cy
    .visit('/');

  cy
    .get('[data-cy="login-menu"]')
    .click();

  cy
    .get('[data-cy="login-module"]')
    .should('be.visible');

  cy
    .get('[data-cy="login-email"]')
    .type('filip@filiphric.sk');

  cy
    .get('[data-cy="login-password"]')
    .type('a');

  cy
    .get('[data-cy="login"]')
    .click();

  cy
    .get('[data-cy="login-password"]')
    .clear()
    .type('abcd1234');

  cy
    .get('[data-cy="login"]')
    .click();

  cy
    .get('[data-cy="login-module"]')
    .should('not.be.visible');

  cy
    .location('pathname')
    .should('eq', '/');

  cy
    .getCookie('trello_token')
    .should('exist');

  cy
    .get('[data-cy="logged-user"]')
    .click();

  cy
    .contains('Log out')
    .click();

  cy
    .getCookie('trello_token')
    .should('not.exist');

});

it('should handle not existing user', () => {

  cy
    .intercept('GET', '/api/users').as('user');

  cy
    .setCookie('trello_token', 'aaa');

  cy
    .visit('/');

  cy
    .wait('@user');

});