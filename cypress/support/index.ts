Cypress.Commands.add('component', (name) => {

  let log = Cypress.log({
    'displayName': 'component',
    name
  });

  cy
    .window({ log: false })
    .then($win => {
      const component = name === 'root' ? $win.app : $win.app.$children.find(e => e.$vnode.tag.includes(name));
      log.set({
        consoleProps: () => {
          return { component };
        }
      });
      return component;
    });

});