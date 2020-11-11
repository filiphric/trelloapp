import createTestRoute from "./testRoutes";

export const getBoards = () =>
  createTestRoute({
    url: "http://localhost:3000/api/boards",
    method: "GET",
    status: 200,
    response: [
      {
        name: "New board",
        user: 0,
        id: 45277717721,
        starred: false,
        created: "2020-11-11",
      },
    ],
  });
