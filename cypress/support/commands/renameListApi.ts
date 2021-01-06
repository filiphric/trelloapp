Cypress.Commands.add('renameListApi', ({ title, index = 0 }) => {

  cy
    .request('PATCH', `/api/lists/${Cypress.env('lists')[index].id}`, {
      title
    });

});