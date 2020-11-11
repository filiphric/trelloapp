export const dashboardWithoutRecords = {
  url: "http://localhost:3000/api/boards",
  method: "GET",
  status: 200,
  response: [],
};

export const dashboardWithRecord = {
  url: "http://localhost:3000/api/boards",
  method: "GET",
  status: 200,
  response: [
    {
      name: "asdasd",
      user: 0,
      id: 45277717721,
      starred: false,
      created: "2020-11-11",
    },
  ],
};
