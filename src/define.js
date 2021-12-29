/* global bindAttributes, bindEventListeners, createShadowRoot, dispatch, findReferences */
export default function define(CustomElement) {
  const name = CustomElement.elementName ?? CustomElement.prototype.constructor.name ?? '';
  const elementName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  customElements.define(elementName, class extends CustomElement {
    dispatch = dispatch;

    constructor() {
      super();

      const { template, data, settings = {} } = this;

      if (template) {
        createShadowRoot(this, template, bindAttributes?.createShadowRoot);
      }

      const $target = this.shadowRoot ?? this;

      this.$refs = findReferences($target, settings?.findReferences);
      this.data = data ? bindAttributes($target, data, settings?.bindAttributes) : data;

      bindEventListeners($target, this, settings?.bindEventListeners);

      this.ready?.();
    }
  });
}
