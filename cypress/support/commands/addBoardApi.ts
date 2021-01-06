Cypress.Commands.add('addBoardApi', (name) => {

  cy
    .request('POST', '/api/boards', { name })
    .then(({ body }) => {

      Cypress.env('boards').push(body);

    });

});