Cypress.Commands.add('addBoardApi', (name) => {

  cy
    .request('PATCH', '/api/boards/${}', { name })
    .then(({ body }) => {

      Cypress.env('boards').push(body);

    });

});