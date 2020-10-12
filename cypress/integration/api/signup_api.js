describe('Sign up user', () => {

  let newUser;

  before(() => {
    cy.deleteAllUsers();
    cy.fixture('user').then((user) => {
      newUser = user;
    });
  });

  it('Should not sign up new user without email filled in', () => {
    cy.request({
      method: 'POST',
      url: '/signup',
      failOnStatusCode: false,
      body: {
        email: '',
        password: newUser.password
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.eq('Email and password are required');
    });
  });

  it('Should not sign up new user without password filled in', () => {
    cy.request({
      method: 'POST',
      url: '/signup',
      failOnStatusCode: false,
      body: {
        email: newUser.email,
        password: ''
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.eq('Email and password are required');
    });
  });

  it('Should not sign up new user with email in wrong format', () => {
    cy.request({
      method: 'POST',
      url: '/signup',
      failOnStatusCode: false,
      body: {
        email: 'emailIn.wrong.format',
        password: newUser.password
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.eq('Email format is invalid');
    });
  });

  it('Should not sign up new user with short password', () => {
    cy.request({
      method: 'POST',
      url: '/signup',
      failOnStatusCode: false,
      body: {
        email: newUser.email,
        password: 'pas'
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.eq('Password is too short');
    });
  });

  it('Should sign up new user', () => {
    cy.request({
      method: 'POST',
      url: '/signup',
      failOnStatusCode: false,
      body: {
        email: newUser.email,
        password: newUser.password
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('accessToken');
    });
  });

  it('Should not sign up new user with already existing email', () => {
    cy.request({
      method: 'POST',
      url: '/signup',
      failOnStatusCode: false,
      body: {
        email: newUser.email,
        password: newUser.password
      }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.eq('Email already exists');
    });
  });
});
