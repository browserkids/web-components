/* global bindAttributes, bindEventListeners, createShadowRoot, findReferences */
export default function define(CustomElement) {
  const elementName = CustomElement
    ?.name
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    ?.toLowerCase();

  customElements.define(elementName, class extends CustomElement {
    constructor() {
      super();

      const { template, data } = this;
      const { settings = {} } = this.constructor;
      const $target = template ? createShadowRoot(this, template, settings?.createShadowRoot) : this;

      this.$refs = findReferences($target, settings?.findReferences);
      this.data = data ? bindAttributes($target, data, settings?.bindAttributes) : data;

      bindEventListeners($target, this, settings?.bindEventListeners);

      this.ready?.($target);
    }

    dispatchEvent(name, detail, settings = {}) {
      const defaults = {
        bubbles: true,
        composed: false,
        cancelable: false,
      };

      super.dispatchEvent(
        new CustomEvent(name, {
          ...defaults,
          ...settings,
          detail,
        }),
      );
    }
  });
}

define.async = async (name, settings = {}) => {
  const defaults = {
    key: 'default',
    path: import.meta?.url?.replace(/\/([^/]+\.m?js)?$/, '') ?? '.',
  };

  const { key, path } = { ...defaults, ...settings };

  define((await import(`${path}/${name}`))[key]);
};
