const visit = (file) => cy.visit(`./html/lazyDefine/${file}.html`);

describe('Lazy define custom elements...', () => {
  it('Should store constructor in registry', () => visit('store'));
  it('Should load immediately if elements exist', () => visit('exists').then((window) => window.testPromise));
  it('Should upgrade elements after registering', () => visit('upgrade').then((window) => window.testPromise));
  it('Should upgrade elements in shadow trees', () => visit('shadow').then((window) => window.testPromise));
});
