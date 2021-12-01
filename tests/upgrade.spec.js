const visit = (file) => cy.visit(`./html/upgrade/${file}.html`);

describe('Upgrade…', () => {
  it('Should work without any template', () => visit('empty'));
  it('Should work with a custom template', () => visit('custom'));
  it('Should work without shadow dom', () => visit('null'));
  it('Should work with references in light dom', () => visit('nullAndRefs'));
});
