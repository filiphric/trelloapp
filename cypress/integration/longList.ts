it('displays a long list', () => {

  cy
    .intercept({
      method: 'GET',
      path: '/api/boards'
    }, {
      fixture: 'longList'
    }).as('matchedUrl')

  cy
    .visit('/')

})