/**
 * Creates a ShadowDOM for this element and
 * uses the given template as content.
 *
 * @param {HTMLElement} $el Element to create shadow root for.
 * @param {string} template Source template string.
 * @param {ShadowRootInit} settings Shadow DOM settings.
 * @return {ShadowRoot}
 */
export function createShadowRoot($el, template = '<template></template>', settings = {}) {
  const defaults = { mode: 'open' };
  const shadowRoot = $el.attachShadow({ ...defaults, ...settings });

  shadowRoot.appendChild(
    (new DOMParser())
      .parseFromString(template, 'text/html')
      .querySelector('template')
      .content
      .cloneNode(true),
  );

  return shadowRoot;
}

/**
 * Triggers a custom event with the given data.
 *
 * @param {HTMLElement} $el Element to trigger event for.
 * @param {string} name Event name.
 * @param {*} detail Event details.
 * @param {CustomEventInit} settings Event settings.
 */
export function dispatch($el, name, detail, settings = {}) {
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

/**
 * Tries to find attributes that name is matching a given regular expression.
 *
 * @param {HTMLElement} $el Element to check attributes for matches.
 * @param {RegExp} name Regular expression for the attribute name.
 * @return {Attr[]} Returns a list of matching attributes.
 */
export function findAttributes($el, name) {
  if (name instanceof RegExp === false) {
    throw new Error('Attribute name must be a regular expression.');
  }

  const attributes = [];

  if ($el.attributes === null || $el.attributes === undefined || typeof $el.attributes[Symbol.iterator] !== 'function') {
    return attributes;
  }

  for (let i = 0, n = $el.attributes.length; i < n; i += 1) {
    const attribute = $el.attributes[i];

    if (name.test(attribute.name)) {
      attributes.push(attribute);
    }
  }

  return attributes;
}

/**
 * Finds all elements that match the given pattern and returns them as a map.
 *
 * @param {HTMLElement} $el Element to look for references.
 * @param {object} settings Settings for adjusting behaviour.
 * @returns {object}
 */
export function findReferences($el, settings = {}) {
  const defaults = {
    pattern: /^#(?<id>.+)/,
    cleanUp: true,
  };

  const { pattern, cleanUp } = { ...defaults, ...settings };
  const $refs = {};
  const walker = document.createTreeWalker($el, NodeFilter.SHOW_ELEMENT);

  do {
    const $currentNode = walker.currentNode;
    const [ref] = findAttributes($currentNode, pattern);

    if (ref === undefined) {
      continue;
    }

    const { id } = ref.name.match(pattern).groups || {};

    if (id === undefined) {
      throw new Error('Reference pattern must include named group “id”.');
    }

    if (cleanUp) {
      $currentNode.removeAttribute(ref.name);
    }

    const $oldRef = $refs[id];

    if (Array.isArray($oldRef)) {
      $oldRef.push($currentNode);
    } else {
      $refs[id] = $oldRef ? [$oldRef, $currentNode] : $currentNode;
    }
  } while (walker.nextNode() !== null);

  return $refs;
}

/**
 * Returns true if the given element is within the boundaries
 * of the given viewport coordinates or at least the amount specified.
 *
 * @param {HTMLElement} $el Element to check for.
 * @param {object} settings Settings for adjusting behaviour.
 * @returns {boolean}
 */
export function isElementInViewport($el, settings = {}) {
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

/**
 * Finds all elements that have event listeners defined and binds them automatically.
 *
 * @param {HTMLElement} $el Element to look for event listeners.
 * @param {object} scope Scope to use for finding the actual event listener functions.
 * @param {object} settings Settings for adjusting behaviour.
 */
export function bindEventListeners($el, scope = $el, settings = {}) {
  const defaults = {
    pattern: /^@(?<event>[^.]+).?(?<modifier>.+)?/,
    cleanUp: true,
  };

  const { pattern, cleanUp } = { ...defaults, ...settings };
  const walker = document.createTreeWalker($el, NodeFilter.SHOW_ELEMENT);

  do {
    const $currentNode = walker.currentNode;

    findAttributes($currentNode, pattern).forEach((attribute) => {
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

export default {
  createShadowRoot,
  dispatch,
  findAttributes,
  findReferences,
  isElementInViewport,
  bindEventListeners,
};
