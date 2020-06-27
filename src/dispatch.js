/**
 * Triggers a custom event with the given data.
 *
 * @param {HTMLElement} $el Element to trigger event for.
 * @param {string} name Event name.
 * @param {*} detail Event details.
 * @param {CustomEventInit} settings Event settings.
 */
export default function dispatch($el, name, detail, settings = {}) {
  const defaults = {
    bubbles: true,
    composed: false,
    cancelable: false,
  };

  $el.dispatchEvent(
    new CustomEvent(name, {
      ...defaults,
      ...settings,
      detail,
    }),
  );
}
