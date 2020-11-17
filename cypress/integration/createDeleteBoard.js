describe("Creating new board and deleting it", () => {
  let boardId;
  it("creates New board", () => {
    cy.visit("http://localhost:3000");
    cy.server().route("POST", "http://localhost:3000/api/boards").as("postBoard");

    cy.get("[data-cy=create-board]").should("be.visible").click();
    cy.get(".board_addBoard").should("be.visible").click().type("New board");
    cy.get(".board_options > .Button").click();
    cy.wait("@postBoard").then((response) => {
      boardId = response.responseBody.id;
      cy.wait(1000);
      cy.get(".boardDetail_title")
        .should("be.visible")
        .invoke("val")
        .then((text) => {
          expect(text).to.eq("New board");
        });
      cy.url().should("contain", `board/${boardId}`);
      cy.get(".boardDetail_info").should("exist").should("be.visible");
      cy.get(".Nav_user").should("be.visible").should("exist");
      cy.get(".boardDetail_title").should("be.visible");
      cy.get(".Nav_boards").click();
      cy.get(`[data-id="board_${boardId}"]`).should("exist").and("be.visible");
    });
  });

  it("deletes board", () => {
    cy.get(`[data-id="board_${boardId}"]`).click();
    cy.get(".boardDetail_info > .dropdown > .options").click();
    cy.get(".boardDetail_info > .dropdown > #myDropdown > .delete").should("be.visible").click();
    cy.url().should("eq", "http://localhost:3000/");
    cy.get(`[data-id="board_${boardId}"]`).should("not.exist");
  });
});
