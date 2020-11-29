declare namespace Cypress {
  interface Chainable<Subject> {

    wait(alias: string, options?: Partial<Loggable & Timeoutable & TimeoutableXHR>): Chainable<WaitXHRObject>;

    wait(alias: string[], options?: Partial<Loggable & Timeoutable & TimeoutableXHR>): Chainable<WaitXHRObject[]>;

  }
}

interface WaitXHRObject extends Cypress.WaitXHR {
  request: {
    body: Cypress.ObjectLike;
    headers: Cypress.ObjectLike;
  };
  requestBody: Cypress.ObjectLike;
  response: {
    body: Cypress.ObjectLike;
    headers: Cypress.ObjectLike;
  };
  responseBody: Cypress.ObjectLike;
}
