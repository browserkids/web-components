const visit = (file) => cy.visit(`./html/isElementInViewport/${file}.html`);

describe('See if element is in viewport…', () => {
  it('Should measure against several viewports', () => visit('viewports'));
  it('Should be fully outside or inside', () => visit('fully'));
  it('Should be partially outside or inside', () => visit('partially'));
  it('Should respect current scroll position', () => visit('scrolled'));
});
