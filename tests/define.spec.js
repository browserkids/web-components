const visit = (file) => cy.visit(`./html/define/${file}.html`);

describe('Custom defined web components…', () => {
  it('Should properly use public field “template” for shadow dom creation', () => visit('shadow'));
  it('Should properly use public field “data” for data binding', () => visit('data'));
  it('Should properly use public static field “elementName” for customElementRegistry', () => visit('elementName'));
});
