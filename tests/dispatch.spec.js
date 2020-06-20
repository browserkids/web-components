const visit = (file) => cy.visit(`./html/dispatch/${file}.html`);

describe('Dispatching custom events…', () => {
  it('Basic event', () => visit('basic'));
});
