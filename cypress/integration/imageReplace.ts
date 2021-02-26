it('will replace trello logo', () => {

  cy
    .intercept('/public/images/trello-logo.png', {
      fixture: 'cypressLogo.png'
    })

  cy
    .visit('/')

})