Cypress.Commands.add('deleteListApi', (index) => {

  cy
    .request('DELETE', `/api/lists/${Cypress.env('lists')[index].id}`);

});