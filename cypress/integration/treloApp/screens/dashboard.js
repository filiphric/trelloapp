import { createTestSelector } from "../../../utils/createTestSelector";
import {
  TESTING_ID_DASHBOARD_NEW_BOARD,
  TESTING_ID_DASHBOARD_ADD_BOARD_TEXT_BOX,
  TESTING_ID_DASHBOARD_SAVE_BOARD_BUTTON,
  TESTING_ID_DASHBOARD_CANCEL_BOARD_BUTTON,
  TESTING_ID_DASHBOARD_BOARD_ITEM,
  TESTING_ID_DASHBOARD_STAR_BOARD,
} from "../../../utils/testingId";

export const visitDashboard = () => cy.visit("http://localhost:3000/api/boards");

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
