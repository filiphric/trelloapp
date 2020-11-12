import { createTestSelector } from "../../../utils/createTestSelector";
import {
  TESTING_ID_TASK_TITLE_TEXT_BOX,
  TESTING_ID_TASK_DESCRIPTION_TEXT_BOX,
  TESTING_ID_TASK_DATE_PICKER,
  TESTING_ID_TASK_UPLOAD_FILE,
} from "../../../utils/testingId";

export const getTaskTitleTextBox = () => {
  return cy.get(createTestSelector(TESTING_ID_TASK_TITLE_TEXT_BOX));
};
export const getTaskDescriptionTextBox = () => {
  return cy.get(createTestSelector(TESTING_ID_TASK_DESCRIPTION_TEXT_BOX));
};
export const getTaskDatePicker = () => {
  return cy.get(createTestSelector(TESTING_ID_TASK_DATE_PICKER));
};
export const getTaskUploadFile = () => {
  return cy.get(createTestSelector(TESTING_ID_TASK_UPLOAD_FILE));
};
