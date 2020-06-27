const visit = (file) => cy.visit(`./html/separateImports/${file}.html`);

describe('Separate imports…', () => {
  it('Should work with one single import', () => visit('single'));
  it('Should work imports that have dependencies', () => visit('dependent'));
});
