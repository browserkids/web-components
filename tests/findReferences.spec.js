const visit = file => cy.visit(`./html/findReferences/${file}.html`);

describe('Finding references…', () => {
  it('Should always return array', () => visit('empty'));
  it('Should return single match', () => visit('single'));
  it('Should return multiple matches', () => visit('multiple'));
  it('Should return results with different pattern', () => visit('pattern'));
  it('Should remove matching attributes from element', () => visit('cleanup'));
  it('Should throw error if regex group “id” is missing', () => visit('group'));
});
