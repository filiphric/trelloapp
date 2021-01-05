Cypress.Commands.add('updateBoardApi', ({ name, index = 0 }) => {

  cy
    .request('PATCH', `/api/boards/${Cypress.env('boards')[index].id}`, {
      name
    })
    .then(({ body }) => {

      Cypress.env('boards')[index] = body;

    });

});