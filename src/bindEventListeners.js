/* global findAttributes */

/**
 * Finds all elements that have event listeners defined and binds them automatically.
 *
 * @param {HTMLElement} $el Element to look for event listeners.
 * @param {object} scope Scope to use for finding the actual event listener functions.
 * @param {object} settings Settings for adjusting behaviour.
 */
export default function bindEventListeners($el, scope = $el, settings = {}) {
  const defaults = {
    pattern: /^@(?<event>[^.]+).?(?<modifier>.+)?/,
    cleanUp: true,
  };

  const { pattern, cleanUp } = { ...defaults, ...settings };
  const walker = document.createTreeWalker($el, NodeFilter.SHOW_ELEMENT);

  do {
    const $currentNode = walker.currentNode;

    (settings.findAttributes || findAttributes)($currentNode, pattern).forEach((attribute) => {
      const { event, modifier = '' } = attribute.name.match(pattern).groups || {};

      if (event === undefined) {
        throw new Error('Reference pattern must include named group “event”.');
      }

      const fn = scope[attribute.value];

      if (typeof fn !== 'function') {
        throw new Error(`Event listener function “${attribute.value}” is invalid or undefined for this element.`);
      }

      if (cleanUp) {
        $currentNode.removeAttribute(attribute.name);
      }

      const $target = (modifier.includes('window') && window)
        || (modifier.includes('document') && document)
        || (modifier.includes('away') && window)
        || $currentNode;

      const handler = (e) => {
        if (
          (modifier.includes('self') && $currentNode !== e.target)
          || (modifier.includes('away') && $currentNode.contains(e.target))
        ) {
          return;
        }

        if (modifier.includes('prevent')) {
          e.preventDefault();
        }

        fn.call(scope, e);

        if (modifier.includes('once')) {
          $target.removeEventListener(event, handler);
        }
      };

      $target.addEventListener(event, handler);
    });
  } while (walker.nextNode() !== null);
}
