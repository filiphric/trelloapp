import { Login } from '../support/pageObjects/login';
const login = new Login();

beforeEach(() => {

  cy
    .visit('/');

});

it('opens signup form', () => {

  login
    .open()
    .goToSignup();

});