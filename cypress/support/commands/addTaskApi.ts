Cypress.Commands.add('addTaskApi', ({ title, boardIndex = 0, listIndex = 0 }) => {

  cy
    .request('POST', '/api/tasks', {
      title,
      boardId: Cypress.env('boards')[boardIndex].id,
      listId: Cypress.env('lists')[listIndex].id
    })
    .then(({ body }) => {

      Cypress.env('tasks').push(body);

    });

});