import { ENDPOINT_BOARD, ENDPOINT_BOARD_ID, ENDPOINT_LISTS } from "../utils/endpoints";

export const getDashboardWithoutRecords = {
  url: "http://localhost:3000/api/boards",
  method: "GET",
  status: 200,
  response: [],
};

export const getDashboardWithRecord = {
  url: ENDPOINT_BOARD,
  method: "GET",
  status: 200,
  response: [
    {
      name: "First dashboard",
      user: 0,
      id: 35893852650,
      starred: false,
      created: "2020-11-12",
    },
  ],
};

export const postBoardWithRecord = {
  url: ENDPOINT_BOARD,
  method: "POST",
  status: 201,
  response: {
    name: "First dashboard",
    user: 0,
    id: 35893852650,
    starred: false,
    created: "2020-11-12",
  },
};

export const getBoardWithRecords = {
  url: ENDPOINT_BOARD_ID,
  method: "GET",
  status: 200,
  response: {
    name: "First dashboard",
    user: 0,
    id: 35893852650,
    starred: false,
    created: "2020-11-12",
    lists: [],
    tasks: [],
  },
};

export const deleteBoard = {
  url: ENDPOINT_BOARD_ID,
  method: "DELETE",
  status: 200,
  response: {},
};

export const postLists = {
  url: ENDPOINT_LISTS,
  method: "POST",
  status: 201,
  response: {
    boardId: 35893852650,
    title: "New list",
    id: 63270422703,
    created: "2020-11-12",
  },
};
