const visit = (file) => cy.visit(`./html/bindAttributes/${file}.html`);

describe('Binding attributes…', () => {
  it('Should do nothing if there is nothing', () => visit('empty'));
  it('Should match several attribute aliases', () => visit('aliases'));
  it('Should properly handle arrays as bound values', () => visit('arrays'));
  it('Should properly handle objects as bound values', () => visit('objects'));
  it('Should properly work on custom attributes', () => visit('custom'));
});
