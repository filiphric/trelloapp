it('displays a empty list', () => {

  cy
    .intercept({
      method: 'GET',
      path: '/api/boards'
    }, {
      body: []
    }).as('matchedUrl')

  cy
    .visit('/')

})