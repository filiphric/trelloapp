beforeEach(() => {

  cy
    .visit('/');

});

it('opens signup form', () => {

  cy
    .window()
    .then(({ app }) => {
      app.showLoginModule = true;
    });

  cy
    .component('Login')
    .then(login => {

      login.logSignSwitch();

    });

});