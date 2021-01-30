export class Login {

  open() {

    cy
      .get('[data-cy=login-menu]').wait(1000, { log: false })
      .click().wait(1000, { log: false });

    return this;

  }

  goToSignup() {

    cy
      .contains('Sign up here')
      .click().wait(1000, { log: false });

  }

}