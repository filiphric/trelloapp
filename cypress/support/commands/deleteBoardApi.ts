Cypress.Commands.add('deleteBoardApi', (index = 0) => {

  cy
    .request('DELETE', `/api/boards/${Cypress.env('boards')[index].id}`)
    .then(() => {

      Cypress.env('boards').splice(index, 1);

    });

});