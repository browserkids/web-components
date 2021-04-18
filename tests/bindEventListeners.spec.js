const visit = (file) => cy.visit(`./html/bindEventListeners/${file}.html`);

describe('Binding event listeners…', () => {
  it('Should do nothing if there is nothing', () => visit('empty'));
  it('Should throw error if listener function is not callable', () => visit('undefined'));
  it('Should call event listener', () => visit('event'));
  it('Should call event listener only once', () => visit('once'));
  it('Should call event listener only when clicked outside', () => visit('away'));
  it('Should call event listener only when clicked on element itself', () => visit('self'));
  it('Should consider multiple event listeners', () => visit('multiple-events'));
  it('Should consider multiple modifiers', () => visit('multiple-modifiers'));
  it('Should prevent default behaviour', () => visit('prevent'));
  it('Should support dot notation', () => visit('dot-notation'));
});
