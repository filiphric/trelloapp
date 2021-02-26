import * as db from '../fixtures/twoBoards.json';

beforeEach(() => {

  cy
    .task('setupDb', db); // seed datbase

})

it('shows starred boards', () => {

  cy
    .intercept({
      method: 'GET',
      path: '/api/boards'
    }, ({ reply, headers }) => {

      delete headers['if-none-match'] // prevent caching
      reply(({ body }) => {
        body.map((board) => board.starred = true)
      })
    }).as('matchedUrl')

  cy
    .visit('/')

});