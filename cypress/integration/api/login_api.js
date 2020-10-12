describe('Log in user', () => {

  let newUser;

  before(() => {
    cy.fixture('user').then((user) => {
      newUser = user;
      cy.deleteAllUsers();
      cy.signUpUser(newUser.email, newUser.password);
    });
  });

  it('Should log in user with correct credentials', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      body: {
        email: newUser.email,
        password: newUser.password
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.accessToken).to.exist;
    });
  });

  it('Should not log in user with wrong email', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      body: {
        email: 'wrong-email@gmail.com',
        password: newUser.password
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.eq('Cannot find user');
    });
  });

  it('Should not log in user with wrong password', () => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false,
      body: {
        email: newUser.email,
        password: 'WrongPassword123'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.eq('Incorrect password');
    });
  });
});
