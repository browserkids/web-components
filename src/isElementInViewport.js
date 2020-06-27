/**
 * Returns true if the given element is within the boundaries
 * of the given viewport coordinates or at least the amount specified.
 *
 * @param {HTMLElement} $el Element to check for.
 * @param {object} settings Settings for adjusting behaviour.
 * @returns {boolean}
 */
export default function isElementInViewport($el, settings = {}) {
  const defaults = {
    amount: 1,
    viewport: {
      bottom: window.innerHeight,
      left: 0,
      right: window.innerWidth,
      top: 0,
    },
  };

  const { amount, viewport } = { ...defaults, ...settings };

  const target = $el.getBoundingClientRect();

  const diff = {
    x: Math.min(viewport.right, target.right) - Math.max(viewport.left, target.left),
    y: Math.min(viewport.bottom, target.bottom) - Math.max(viewport.top, target.top),
  };

  const sb = target.width * target.height;
  const si = Math.max(0, diff.x) * Math.max(0, diff.y);
  const overlap = (si / sb);

  return amount ? overlap >= amount : overlap === amount;
}
