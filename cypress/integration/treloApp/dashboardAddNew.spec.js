import * as dashboard from "./screens/dashboard";
import { ENDPOINT_BOARD, URL_LOCALHOST, URL_BOARD_ID } from "../../utils/endpoints";
import * as board from "./screens/board";
import * as task from "./screens/task";
import {
  deleteBoard,
  getDashboardWithRecord,
  getDashboardWithoutRecords,
  postBoardWithRecord,
  getBoardWithRecords,
} from "../../utils/testRoutes";

const dashboardUrlCheck = () => cy.url().should("eq", URL_LOCALHOST);
const boardUrlCheck = () => cy.url().should("eq", URL_BOARD_ID);
const firstDashboard = "First dashboard";
const addNewTask = ({ index, task }) => {
  board.getBoardAddNewTask().click();
  board.getTaskListAddTaskTitle().click().type(task);
  board.getBoardListAddTaskSaveButton().click();
  board.getBoardListTaskTitle().eq(index).should("have.text", task);
};
const createBoard = () => {
  dashboard.getDashboardCreateBoard().click();
  dashboard.getDashboardAddBoardTextBox().click().type(firstDashboard);
  cy.server().route(postBoardWithRecord).as("postBoard").route(getBoardWithRecords).as("getBoardRecords");

  dashboard.getDashboardSaveBoardButton().click("left");
  cy.wait(["@getBoardRecords", "@postBoard"]);
};

describe("Adding new dashboard and tasks withing board", () => {
  beforeEach(() => {
    cy.server().route(getDashboardWithoutRecords).as("getDashboard");
    dashboard.visitDashboard();
    cy.wait(["@getDashboard"]);
  });

  it("checks if board was successfully added", () => {
    createBoard();
    cy.server().route(getDashboardWithRecord).as("getBoardWithRecord");
    boardUrlCheck();
    board.getBoardDashboardButton().click();
    cy.wait(["@getBoardWithRecord"]);
    dashboard.getDashboardBoardTitle().should("have.text", firstDashboard);
  });

  it("checks if board was successfully deleted", () => {
    createBoard();
    cy.server().route(deleteBoard).as("deleteBoard").route(getDashboardWithoutRecords).as("getDashboard");
    board.getBoardDashboardOptions().click();
    board.getBoardDashboardOptionsDeleteBoard().click();
    dashboard.getDashboardBoardItem().should("not.exist");
    dashboardUrlCheck();
  });
  it("adds list and new tasks and checks overdue", () => {
    const list = "New list";
    const firstTask = "Homework";
    const secondTask = "Cook";
    const overdue = "Task overDue";
    createBoard();
    boardUrlCheck();
    board.getBoardCreateListTitle().click();
    board.getBoardCreateListTittleTextBox().click().type(list);
    board.getBoardSaveListButton().click();
    board.getBoardListItem().should("exist").should("be.visible");
    addNewTask({ index: 0, task: firstTask });
    addNewTask({ index: 1, task: secondTask });
    board.getBoardListTask().eq(0).click();
    task.getTaskDatePicker().click().type("1997-01-01");
    board.getBoardListTask().eq(0).invoke("attr", "class").should("contain", overdue);
  });
});
