Cypress.Commands.add('createTestBoard', () => {
  cy.request({
    method: 'POST',
    url: '/api/boards',
    body: {
      name: 'Test board',
    }
  }).then((res) => {
    expect(res.status).to.eq(201);
    return res.body.id;
  });
});

Cypress.Commands.add('deleteTestBoard', (boardId) => {
  cy.request({
    method: 'DELETE',
    url: `/api/boards/${boardId}`,
  }).then((res) => {
    expect(res.status).to.eq(200);
    expect(res.body).to.be.empty;
  });
});
