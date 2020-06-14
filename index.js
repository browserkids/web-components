/**
 * Merges two objects together and automatically
 * creates arrays for entries that are duplicates.
 *
 * @param {object} a Object a.
 * @param {object} b Object b.
 * @returns {object}
 */
function merge(a, b) {
  const result = { ...a };

  Object
    .entries(b)
    .forEach(([bId, bValue]) => {
      const aValue = result[bId];

      if (aValue === undefined) {
        result[bId] = bValue;
      } else {
        result[bId] = [
          ...(Array.isArray(aValue) ? aValue : [aValue]),
          ...(Array.isArray(bValue) ? bValue : [bValue]),
        ];
      }
    });

  return result;
}

/**
 * Creates a ShadowDOM for this element and
 * uses the given template as content.
 *
 * @param {HTMLElement} $el Element to create shadow root for.
 * @param {string} template Source template string.
 * @param {ShadowRootInit} settings Shadow DOM settings.
 */
export function createShadowRoot($el, template, settings = { mode: 'open' }) {
  const shadowRoot = $el.attachShadow(settings);

  shadowRoot.appendChild(
    (new DOMParser())
      .parseFromString(template, 'text/html')
      .querySelector('template')
      .content
      .cloneNode(true),
  );
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
      detail,
      ...defaults,
      ...settings,
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
    recursive: true,
    cleanUp: true,
  };

  const $refs = {};
  const { pattern, recursive, cleanUp } = { ...defaults, ...settings };

  if (recursive) {
    for (let i = 0, n = $el.childElementCount; i < n; i += 1) {
      merge($refs, findReferences($el.children[i], settings));
    }
  }

  const [ref] = findAttributes($el, pattern);

  if (ref === undefined) {
    return $refs;
  }

  const { id } = ref.name.match(pattern).groups || {};

  if (id === undefined) {
    throw new Error('Reference pattern must include named group “id”.');
  }

  if (cleanUp) {
    $el.removeAttribute(ref.name);
  }

  return merge($refs, { [id]: $el });
}

/**
 * Returns true if the given element is (fully) within the visible area of the viewport.
 *
 * @param {HTMLElement} $el Element to check for.
 * @returns {boolean}
 */
export function isElementInViewport($el) {
  const {
    top, left, bottom, right,
  } = $el.getBoundingClientRect();

  return (
    top >= 0
        && left >= 0
        && bottom <= (window.innerHeight || document.documentElement.clientHeight)
        && right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export default {
  createShadowRoot,
  dispatch,
  findAttributes,
  findReferences,
  isElementInViewport,
};