Cypress.Commands.add('uiLoginUser', (email, password) => {
  cy.visit('/');
  cy.get('.Nav > :nth-child(3)').click();
  cy.get('#loginEmail').type(email);
  cy.get('#loginPassword').type(password);
  cy.get('[style=""] > .credentials > .LoginModule_buttons > .Button').click();
  cy.wait(1000);
});
