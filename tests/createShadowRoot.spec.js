const visit = (file) => cy.visit(`./html/createShadowRoot/${file}.html`);

describe('Creating Shadow DOM…', () => {
  it('Empty one', () => visit('empty'));
  it('Two paragraphs', () => visit('tree'));
  it('Closed mode', () => visit('closed'));
});
