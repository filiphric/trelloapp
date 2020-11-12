import { createTestSelector } from "../../../utils/createTestSelector";
import {
  TESTING_ID_BOARD_DETAIL_TITLE,
  TESTING_ID_BOARD_CREATE_LIST_TITLE,
  TESTING_ID_BOARD_CREATE_LIST_TITTLE_TEXT_BOX,
  TESTING_ID_BOARD_SAVE_LIST_BUTTON,
  TESTING_ID_BOARD_CANCEL_LIST_BUTTON,
  TESTING_ID_BOARD_ADD_NEW_TASK,
  TESTING_ID_BOARD_DASHBOARD_BUTTON,
  TESTING_ID_BOARD_LIST_OPTIONS,
  TESTING_ID_BOARD_DASHBOARD_OPTIONS,
  TESTING_ID_BOARD_DASHBOARD_OPTIONS_DELETE_BOARD,
  TESTING_ID_BOARD_LIST_OPTIONS_DELETE_LIST,
  TESTING_ID_BOARD_LIST_ITEM,
  TESTING_ID_BOARD_LIST_CHECKBOX,
  TESTING_ID_BOARD_LIST_TASK,
  TESTING_ID_BOARD_LIST_ADD_TASK_SAVE_BUTTON,
  TESTING_ID_BOARD_LIST_TASK_TITLE,
  TESTING_ID_TASK_LIST_ADD_TASK_TITLE,
} from "../../../utils/testingId";

export const getTaskListAddTaskTitle = () => {
  return cy.get(createTestSelector(TESTING_ID_TASK_LIST_ADD_TASK_TITLE));
};
export const getBoardListTaskTitle = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_LIST_TASK_TITLE));
};

export const getBoardListAddTaskSaveButton = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_LIST_ADD_TASK_SAVE_BUTTON));
};

export const getBoardDashboardButton = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_DASHBOARD_BUTTON));
};

export const getBoardDetailTitle = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_DETAIL_TITLE));
};

export const getBoardCreateListTitle = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_CREATE_LIST_TITLE));
};

export const getBoardCreateListTittleTextBox = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_CREATE_LIST_TITTLE_TEXT_BOX));
};

export const getBoardCancelListButton = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_CANCEL_LIST_BUTTON));
};

export const getBoardAddNewTask = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_ADD_NEW_TASK));
};

export const getBoardSaveListButton = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_SAVE_LIST_BUTTON));
};

export const getBoardListOptions = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_LIST_OPTIONS));
};

export const getBoardDashboardOptions = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_DASHBOARD_OPTIONS));
};

export const getBoardDashboardOptionsDeleteBoard = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_DASHBOARD_OPTIONS_DELETE_BOARD));
};

export const getBoardListOptionsDeleteList = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_LIST_OPTIONS_DELETE_LIST));
};

export const getBoardListItem = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_LIST_ITEM));
};
export const getBoardListCheckbox = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_LIST_CHECKBOX));
};

export const getBoardListTask = () => {
  return cy.get(createTestSelector(TESTING_ID_BOARD_LIST_TASK));
};
