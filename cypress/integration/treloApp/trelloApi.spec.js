import { getDashboardWithRecord, postBoardWithRecord, postLists } from "../../utils/testRoutes";

describe("Adding new dashboard and tasks withing board", () => {
  let boardId;
  it("GET boards in dashboard", () => {
    const response = {
      name: "First dashboard",
      user: 0,
      id: 35893852650,
      starred: false,
      created: "2020-11-12",
    };
    cy.request(getDashboardWithRecord).then((response) => {
      expect(response).contains(response);
    });
  });
  it("POST boards in dashboard", () => {
    const response = {
      name: "First dashboard",
      user: 0,
      id: boardId,
      starred: false,
      created: "2020-11-12",
    };
    cy.request(postBoardWithRecord).then((response) => {
      expect(response).contains(response);
      boardId = response.body.id;
    });
  });
  it("Should delete a created board", () => {
    cy.request({
      method: "DELETE",
      url: `http://localhost:3000/api/boards/${boardId}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.empty;
    });
  });

  it("POST lists in board", () => {
    const response = {
      boardId: boardId,
      title: "New list",
      id: 63270422703,
      created: "2020-11-12",
    };
    cy.request(postLists).then((response) => {
      expect(response).contains(response);
    });
  });
});
