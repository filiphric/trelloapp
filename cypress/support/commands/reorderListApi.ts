Cypress.Commands.add('reorderListApi', ({ order, index = 0 }) => {

  cy
    .request('PATCH', `/api/lists/${Cypress.env('lists')[index].id}`, {
      order
    });

});