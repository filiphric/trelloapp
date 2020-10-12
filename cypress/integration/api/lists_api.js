describe('Lists can be created, edited and deleted in existing board', () => {

  let boardId;
  let listId;

  before(() => {
    cy.createTestBoard().then((newBoardId) => {
      boardId = newBoardId;
    });
  });

  it('Should create a new list in existing board', () => {
    cy.request({
      method: 'POST',
      url: '/api/lists/',
      body: {
        boardId: boardId,
        title: 'New list'
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.boardId).to.eq(boardId);
      expect(res.body.title).to.eq('New list');
      listId = res.body.id;
    });
  });

  it('Should edit a New list in existing board', () => {
    cy.request({
      method: 'PATCH',
      url: `/api/lists/${listId}`,
      body: {
        boardId: boardId,
        title: 'New list 1'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.boardId).to.eq(boardId);
      expect(res.body.title).to.eq('New list 1');
    });
  });

  it('Should delete a New list from existing board', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/lists/${listId}`,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.empty;
    });
  });

  after(() => {
    cy.deleteTestBoard(boardId);
  });
});
