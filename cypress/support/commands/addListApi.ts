Cypress.Commands.add('addListApi', ({ title, boardIndex = 0 }) => {

  cy
    .request('POST', '/api/lists', {
      boardId: Cypress.env('boards')[boardIndex].id,
      title,
    }).then(({ body }) => {
      Cypress.env('lists').push(body);
    });

});