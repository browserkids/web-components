describe('Finding references…', () => {
  it('Should always return array', () => cy.visit('./html/findReferences/empty.html'))
  it('Should return single match', () => cy.visit('./html/findReferences/single.html'))
  it('Should return multiple matches', () => cy.visit('./html/findReferences/multiple.html'))
  it('Using different pattern', () => cy.visit('./html/findReferences/pattern.html'))
  it('Should remove matching attributes from element', () => cy.visit('./html/findReferences/cleanup.html'))
})
