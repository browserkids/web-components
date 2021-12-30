/* global bindAttributes, bindEventListeners, createShadowRoot, dispatch, findReferences */
export default function define(CustomElement) {
  const elementName = CustomElement
    ?.name
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    ?.toLowerCase();

  customElements.define(elementName, class extends CustomElement {
    #shadowRoot = null;

    dispatch = dispatch;

    constructor() {
      super();

      const { template, data } = this;
      const { settings = {} } = this.constructor;

      if (template) {
        this.#shadowRoot = createShadowRoot(this, template, settings?.createShadowRoot);
      }

      const $target = this.#shadowRoot ?? this;

      this.$refs = findReferences($target, settings?.findReferences);
      this.data = data ? bindAttributes($target, data, settings?.bindAttributes) : data;

      bindEventListeners($target, this, settings?.bindEventListeners);

      this.ready?.();
    }
  });
}
