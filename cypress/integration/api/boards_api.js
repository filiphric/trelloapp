describe('Boards can be created, edited and deleted', () => {

  let boardId; 

  it('Should create a new board with name My board', () => {
    cy.request({
      method: 'POST',
      url: '/api/boards',
      body: {
        name: 'My board',
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.name).to.eq('My board');
      expect(res.body.user).to.eq(0);
      expect(res.body.starred).to.be.false;
      boardId = res.body.id;
    });
  });

  it('Should edit a name of created board', () => {
    cy.request({
      method: 'PATCH',
      url: `/api/boards/${boardId}`,
      body: {
        name: 'My board 1',
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.name).to.eq('My board 1');
      expect(res.body.user).to.eq(0);
      expect(res.body.starred).to.be.false;
    });
  });

  it('Should starred created board', () => {
    cy.request({
      method: 'PATCH',
      url: `/api/boards/${boardId}`,
      body: {
        starred: true,
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.name).to.eq('My board 1');
      expect(res.body.user).to.eq(0);
      expect(res.body.starred).to.be.true;
    });
  });

  it('Should delete a created board', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/boards/${boardId}`,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.empty;
    });
  });
});
