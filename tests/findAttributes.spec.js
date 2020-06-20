const visit = (file) => cy.visit(`./html/findAttributes/${file}.html`);

describe('Finding attributes with regex…', () => {
  it('Should always return array', () => visit('empty'));
  it('Should return single match', () => visit('single'));
  it('Should return multiple matches', () => visit('multiple'));
});
