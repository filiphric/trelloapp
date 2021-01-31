export class Login {

  open() {

    cy
      .get('[data-cy=login-menu]')
      .click();

    return this;

  }

  goToSignup() {

    cy
      .contains('Sign up here')
      .click();

  }

}