import * as db from '../fixtures/oneBoard.json';

beforeEach(() => {

  cy
    .task('setupDb', db); // seed datbase

})

it('shows board list', () => {

  cy
    .intercept({
      method: 'GET',
      path: '/api/boards'
    }).as('matchedUrl')

  cy
    .visit('/')

  cy
    .get('[data-cy=board-item]')
    .should('have.length', 0)

})