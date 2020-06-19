describe('Finding references…', () => {
  it('Should always return array', () => cy.visit('./html/findReferences/empty.html'))
  it('Should return single match', () => cy.visit('./html/findReferences/single.html'))
  it('Should return multiple matches', () => cy.visit('./html/findReferences/multiple.html'))
  it('Should return results with different pattern', () => cy.visit('./html/findReferences/pattern.html'))
  it('Should remove matching attributes from element', () => cy.visit('./html/findReferences/cleanup.html'))
  it('Should throw error if regex group “id” is missing', () => cy.visit('./html/findReferences/group.html'))
})
