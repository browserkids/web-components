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
    pattern: /^@(?:(?<target>window|document)\.)?(?<event>[^.]+)(?:\.(?<modifier>.+))?/i,
    cleanUp: true,
  };

  const { pattern, cleanUp } = { ...defaults, ...settings };
  const walker = document.createTreeWalker($el, NodeFilter.SHOW_ELEMENT);
  const get = (target, key) => key.split('.').reduce((o, i) => o?.[i], target);

  do {
    const $currentNode = walker.currentNode;
    const matches = findAttributes($currentNode, pattern);

    matches.forEach(({ name, value }) => {
      const { target = '', event, modifier = '' } = name.match(pattern).groups || {};

      if (event === undefined) {
        throw new Error('Pattern must include named group “event”.');
      }

      const fn = get(scope, value);

      if (typeof fn !== 'function') {
        throw new Error(`Event listener function “${value}” is invalid or undefined for this element.`);
      }

      if (cleanUp) {
        $currentNode.removeAttribute(name);
      }

      const isWindow = target.toLowerCase() === 'window';
      const isDocument = target.toLowerCase() === 'document';
      const isAway = modifier.includes('away');
      const isPrevent = modifier.includes('prevent');
      const isOnce = modifier.includes('once');
      const isSelf = modifier.includes('self');
      const isCapture = modifier.includes('capture');
      const isPassive = modifier.includes('passive');

      const $target = (isWindow && window) || (isDocument && document) || (isAway && window) || $currentNode;

      const handler = (e) => {
        if ((isSelf && $currentNode !== e.target) || (isAway && $currentNode.contains(e.target))) {
          return;
        }

        if (isPrevent) {
          e.preventDefault();
        }

        fn.call(scope, e);

        if (isOnce) {
          $target.removeEventListener(event, handler);
        }
      };

      $target.addEventListener(event, handler, {
        capture: isCapture,
        passive: isPassive,
      });
    });
  } while (walker.nextNode() !== null);
}
