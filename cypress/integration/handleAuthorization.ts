it('shows private boards', () => {

  cy
    .intercept('/api/*', ({ headers }) => {

      delete headers['if-none-match'] // prevent caching
      headers["Authorization"] = `Bearer ${Cypress.env('TOKEN')}`;
    }).as('matchedUrl')

  cy
    .visit('/')

});