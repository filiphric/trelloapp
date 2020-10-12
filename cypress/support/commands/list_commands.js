Cypress.Commands.add('createTestList', (boardId) => {
  cy.request({
    method: 'POST',
    url: '/api/lists/',
    body: {
      boardId: boardId,
      title: 'New test list'
    }
  }).then((res) => {
    expect(res.status).to.eq(201);
    return res.body.id;
  });
});
