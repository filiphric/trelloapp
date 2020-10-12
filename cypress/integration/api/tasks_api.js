describe('Lists can be created, edited and deleted in existing board', () => {

  let boardId;
  let listId;
  let taskId;

  before(() => {
    cy.createTestBoard().then((newBoardId) => {
      boardId = newBoardId;
      cy.createTestList(boardId).then((newListId) => {
        listId = newListId;
      });
    });
  });

  it('Should create a new task in existing board with existing list', () => {
    cy.request({
      method: 'POST',
      url: '/api/tasks/',
      body: {
        boardId: boardId,
        listId: listId,
        title: 'New task',

      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.boardId).to.eq(boardId);
      expect(res.body.listId).to.eq(listId);
      expect(res.body.title).to.eq('New task');
      taskId = res.body.id;
    });
  });

  it('Should edit a New task in existing board', () => {
    cy.request({
      method: 'PATCH',
      url: `/api/tasks/${taskId}`,
      body: {
        title: 'New task 1'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.boardId).to.eq(boardId);
      expect(res.body.listId).to.eq(listId);
      expect(res.body.id).to.eq(taskId);
      expect(res.body.title).to.eq('New task 1');
    });
  });

  it('Should edit a description in New task', () => {
    cy.request({
      method: 'PATCH',
      url: `/api/tasks/${taskId}`,
      body: {
        description: 'This is description of my new task'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.boardId).to.eq(boardId);
      expect(res.body.listId).to.eq(listId);
      expect(res.body.id).to.eq(taskId);
      expect(res.body.description).to.eq('This is description of my new task');
    });
  });

  it('Should delete a New task from existing list', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/tasks/${taskId}`,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.empty;
    });
  });

  after(() => {
    cy.deleteTestBoard(boardId);
  });
});
