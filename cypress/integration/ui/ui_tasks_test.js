describe('User should be able to create, edit or delete list from the board', () => {

  let newUser;
  let boardId;
  let taskId;

  before(() => {
    cy.fixture('user').then((user) => {
      newUser = user;
      cy.deleteAllUsers();
      cy.signUpUser(newUser.email, newUser.password);
      cy.createTestBoard().then((newBoardId) => {
        boardId = newBoardId;
        cy.createTestList(newBoardId);
      });
    });
  });

  it('User should be able to create a new task on the list', () => {
    cy.server();
    cy.route('POST', '/api/tasks').as('createTask');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.List_addTask').click();
    cy.get('.List > .TextArea').type('My new task');
    cy.get('.List_newTaskOptions > .Button').click();
    cy.wait('@createTask').then((res) => {
      expect(res.status).to.eq(201);
      taskId = res.responseBody.id;
      cy.get('.List_tasks > .Task').should('exist').and('be.visible');
      cy.get('.List_tasks > .Task > .container > .Task_title').invoke('text').then((text) => {
        expect(text).to.eq('My new task');
      });
    });
  });

  it('User should be able to edit a task on the list', () => {
    cy.server();
    cy.route('PATCH', `/api/tasks/${taskId}`).as('updateTask');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.Task').click();
    cy.get('.TaskModule').should('be.visible');
    cy.log('Editing title of the task');
    cy.get('.TaskModule > .Input').click()
      .clear()
      .type('My task');
    cy.get('.TaskModule > :nth-child(4)').click();
    cy.wait('@updateTask').then((res) => {
      expect(res.status).to.eq(200);
    });
    cy.get('.TaskModule_list').invoke('text').then((text) => {
      expect(text).to.contains('in list New test list');
    });
    cy.log('Editing description of the task');
    cy.get('.TaskModule_description').click();
    cy.get('.TaskModule > .TextArea').should('be.visible').type('This is my task!');
    cy.get('.TaskModule_options > .Button').click();
    cy.wait('@updateTask').then((res) => {
      expect(res.status).to.eq(200);
      cy.get('.TaskModule_description').invoke('text').then((text) => {
        expect(text).to.contains('This is my task!');
      });
    });
    cy.log('Choosing a date');
    cy.get('input[type="date"]').type('2020-10-17');
    cy.get('input[type="date"]').invoke('val').then((text) => {
      expect(text).to.eq('2020-10-17');
    });
  });

  // Test skipped because of image cannot be uploaded in current app version
  it.skip('User should be able to upload an image to a task', () => {
    cy.server();
    cy.route('POST', '/api/upload').as('uploadImage');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.Task').click();
    cy.get(':nth-child(11) > .TaskModule_descriptionTitle').should('be.visible')
      .invoke('text').then((text) => { expect(text).to.eq('Upload image'); });
    cy.fixture('test.jpeg', 'base64').then(fileContent => {
      cy.get('input[type="file"]').attachFile(
        { fileContent, fileName: 'test.jpeg', mimeType: 'image/jpg' },
        { subjectType: 'input' },
      ).then(() => {
        cy.wait('@uploadImage').then((res) => {
          expect(res.status).to.eq(201);
        });
      });
    });
  });

  it('User should be able to close a task on the list', () => {
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.Task').click();
    cy.get('.TaskModule_exit > .dropdown > .options').click();
    cy.get('.TaskModule_exit > .dropdown > #myDropdown > :nth-child(1)').click();
    cy.get('.TaskModule').should('not.be.visible');
  });
  
  it('User should be able to delete a task on the list', () => {
    cy.server();
    cy.route('DELETE', `/api/tasks/${taskId}`).as('deleteTask');
    cy.uiLoginUser(newUser.email, newUser.password);
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get('.Task').click();
    cy.get('.TaskModule_exit > .dropdown > .options').click();
    cy.get('.TaskModule_exit > .dropdown > #myDropdown > .delete').click();
    cy.wait('@deleteTask').then((res) => {
      expect(res.status).to.eq(200);
      cy.get('.Task').should('not.exist');
    });
  });

  after(() => {
    cy.deleteTestBoard(boardId);
  });
});
