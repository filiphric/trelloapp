import * as dashboard from "./screens/dashboard";
import { dashboardWithRecord, dashboardWithoutRecords } from "../../utils/testRoutes";

describe("Edit contract screen", () => {
  beforeEach(() => {
    cy.server().route(dashboardWithoutRecords).as("getDashboard");
    dashboard.visitDashboard();
    cy.wait(["@getDashboard"]);
  });

  it("edits contract correctly", () => {
    dashboard.getDashboardCreateBoard().click();
    dashboard.getDashboardAddBoardTextBox().click().type("test");
  });
});
