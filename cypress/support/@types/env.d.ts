// Arbitrary export is necessary to create module context, otherwise the declaration merging doesn't work here
export { };

declare global {
  namespace Cypress {

    export interface Cypress {

      /**
       * Returns all environment variables set with CYPRESS_ prefix or in "env" object in "cypress.json"
       *
       * @see https://on.cypress.io/env
       */
      env(): Partial<EnvKeys>;
      /**
       * Returns specific environment variable or undefined
       * @see https://on.cypress.io/env
       * @example
       *    // cypress.json
       *    { "env": { "foo": "bar" } }
       *    Cypress.env("foo") // => bar
       */
      env<T extends keyof EnvKeys>(key: T): EnvKeys[T];
      /**
       * Set value for a variable.
       * Any value you change will be permanently changed for the remainder of your tests.
       * @see https://on.cypress.io/env
       * @example
       *    Cypress.env("host", "http://server.dev.local")
       */
      env<T extends keyof EnvKeys>(key: T, value: EnvKeys[T]): void;

      /**
       * Set values for multiple variables at once. Values are merged with existing values.
       * @see https://on.cypress.io/env
       * @example
       *    Cypress.env({ host: "http://server.dev.local", foo: "foo" })
       */
      env(object: Partial<EnvKeys>): void;

    }

  }
}

interface EnvKeys {
  'boards': Array<{
    created: string;
    id: number;
    name: string;
    starred: boolean;
    user: number;
  }>;
  'lists': Array<{
    boardId: number
    title: string
    id: number
    created: string
  }>;
  'tasks': Array<{
    boardId: number;
    description: string;
    completed: boolean;
    listId: number;
    title: string;
    id: number;
    created: string;
    deadline: string;
    image: string;
  }>;
  'users': Array<{
    email: string;
    password: string;
    id: number;
  }>;
}
