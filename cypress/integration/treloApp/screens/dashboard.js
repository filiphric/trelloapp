import { createTestSelector } from "../../../utils/createTestSelector";
import {
  TESTING_ID_DASHBOARD_NEW_BOARD,
  TESTING_ID_DASHBOARD_ADD_BOARD_TEXT_BOX,
  TESTING_ID_DASHBOARD_SAVE_BOARD_BUTTON,
  TESTING_ID_DASHBOARD_CANCEL_BOARD_BUTTON,
  TESTING_ID_DASHBOARD_BOARD_ITEM,
  TESTING_ID_DASHBOARD_STAR_BOARD,
  TESTING_ID_DASHBOARD_BOARD_TITLE,
} from "../../../utils/testingId";
import { ENDPOINT_BOARD, ENDPOINT_BOARD_ID } from "../../../utils/endpoints";

export const visitDashboard = () => cy.visit(ENDPOINT_BOARD);
export const visitBoard = () => cy.visit(ENDPOINT_BOARD_ID);
export const getDashboardCreateBoard = () => {
  return cy.get(createTestSelector(TESTING_ID_DASHBOARD_NEW_BOARD));
};
export const getDashboardAddBoardTextBox = () => {
  return cy.get(createTestSelector(TESTING_ID_DASHBOARD_ADD_BOARD_TEXT_BOX));
};

export const getDashboardSaveBoardButton = () => {
  return cy.get(createTestSelector(TESTING_ID_DASHBOARD_SAVE_BOARD_BUTTON));
};
export const getDashboardCancelBoardButton = () => {
  return cy.get(createTestSelector(TESTING_ID_DASHBOARD_CANCEL_BOARD_BUTTON));
};
export const getDashboardBoardItem = () => {
  return cy.get(createTestSelector(TESTING_ID_DASHBOARD_BOARD_ITEM));
};
export const getDashboardStarBoard = () => {
  return cy.get(createTestSelector(TESTING_ID_DASHBOARD_STAR_BOARD));
};

export const getDashboardBoardTitle = () => {
  return cy.get(createTestSelector(TESTING_ID_DASHBOARD_BOARD_TITLE));
};

export const getOverdue = (overdue) => {
  return getBoardListTask().closest(`[class='${overdue}']`);
};
