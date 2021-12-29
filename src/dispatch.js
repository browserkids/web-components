/**
 * Triggers a custom event with the given data.
 *
 * @param {string} name Event name.
 * @param {*} detail Event details.
 * @param {CustomEventInit} settings Event settings.
 */
export default function dispatch(name, detail, settings = {}) {
  const defaults = {
    bubbles: true,
    composed: false,
    cancelable: false,
  };

  this.dispatchEvent(
    new CustomEvent(name, {
      ...defaults,
      ...settings,
      detail,
    }),
  );
}
