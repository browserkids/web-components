describe('Finding attributes with regex…', () => {
  it('Should always return array', () => cy.visit('./html/findAttributes/empty.html'))
  it('Should return single match', () => cy.visit('./html/findAttributes/single.html'))
  it('Should return multiple matches', () => cy.visit('./html/findAttributes/multiple.html'))
})
