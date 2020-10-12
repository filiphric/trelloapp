Cypress.Commands.add('deleteAllUsers', () => { 
  cy.request({
    method: 'DELETE',
    url: '/api/users',
  }).then((res) => {
    expect(res.status).to.eq(204);
  });
});

Cypress.Commands.add('signUpUser', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/signup',
    body: {
      email: email,
      password: password
    }
  }).then((res) => {
    expect(res.status).to.eq(201);
  });
});

Cypress.Commands.add('loginUser', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/login',
    body: {
      email: email,
      password: password
    }
  }).then((res) => {
    expect(res.status).to.eq(200);
  });
});
