describe("Creates and deletes list", () => {
  let boardId;
  let listId;
  it("Creates new list and task", () => {
    cy.visit("http://localhost:3000/");
    cy.server().route("POST", "http://localhost:3000/api/boards").as("postBoard");

    cy.get("[data-cy=create-board]").should("be.visible").click();
    cy.get(".board_addBoard").should("be.visible").click().type("New board");
    cy.get(".board_options > .Button").click();
    cy.wait("@postBoard").then((response) => {
      boardId = response.responseBody.id;

      cy.wait(1000);
      cy.get(".CreateList_title").click();
      cy.get(".CreateList_input").type("List");
      cy.get(".Button").eq(3).click();
      cy.get(".List_addTask").click();
      cy.get(".List > .TextArea").type("New Task");
      cy.get(".List_newTaskOptions > .Button").click();
      cy.get(".List_tasks > .Task").should("exist").should("be.visible");
      cy.get(".options").eq(2).click();
      cy.get(".delete").eq(2).click();
      cy.get(".List").should("not.exist");

      // Clean up
      cy.get(".options").eq(1).click();
      cy.get(".delete").eq(1).click();
      cy.get(".board_item").should("not.exist");
    });
  });
});
