describe('Creating Shadow DOM…', () => {
  it('Empty one', () => cy.visit('./html/createShadowRoot/empty.html'))
  it('Two paragraphs', () => cy.visit('./html/createShadowRoot/tree.html'))
  it('Closed mode', () => cy.visit('./html/createShadowRoot/closed.html'))
})
