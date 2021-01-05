Cypress.Commands.add('signupApi', ({ email, password }) => {

  cy
    .request('POST', '/api/signup', {
      email, password
    }).then(({ body }) => {
      Cypress.env('users').push(body);
    });

});