declare namespace Cypress {
  interface Chainable {
    /**
     * will return a component object
    */
    component(value: 'root' | 'Login' | 'Navbar' | 'board' | 'board-collection'): Chainable<Element>
  }
}