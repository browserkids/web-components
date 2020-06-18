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
 * @return {ShadowRoot}
 */
export function createShadowRoot($el, template, settings) {
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

  const { pattern, recursive, cleanUp } = { ...defaults, ...settings };

  let $refs = {};

  if (recursive) {
    for (let i = 0, n = $el.childElementCount; i < n; i += 1) {
      $refs = merge($refs, findReferences($el.children[i], settings));
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
    recursive: true,
    cleanUp: true,
  };

  const { pattern, recursive, cleanUp } = { ...defaults, ...settings };

  if (recursive) {
    for (let i = 0, n = $el.childElementCount; i < n; i += 1) {
      bindEventListeners($el.children[i], scope, settings);
    }
  }

  findAttributes($el, pattern).forEach((attribute) => {
    const { event, modifier = '' } = attribute.name.match(pattern).groups || {};

    if (event === undefined) {
      throw new Error('Reference pattern must include named group “event”.');
    }

    const fn = scope[attribute.value];

    if (typeof fn !== 'function') {
      throw new Error(`Event listener function “${attribute.value}” is invalid or undefined for this element.`);
    }

    if (cleanUp) {
      $el.removeAttribute(attribute.name);
    }

    const $target = (modifier.includes('window') && window)
      || (modifier.includes('document') && document)
      || (modifier.includes('away') && window)
      || $el;

    const handler = (e) => {
      if (
        (modifier.includes('self') && $el !== e.target)
        || (modifier.includes('away') && $el.contains(e.target))
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
}

/**
 * Registers custom elements when they occur for the
 * first time in the DOM and lazy-loads their actual implementation.
 *
 * @param {string} name Custom element name.
 * @param {function} importCallback A function returning a Promise that delivers the imported module which has the element’s constructor.
 */
export function lazyDefine(name, importCallback) {
  if (document.querySelector(name)) {
    (async () => {
      customElements.define(name, (await importCallback()).default);
    })();

    return;
  }

  lazyDefine.registry = (lazyDefine.registry || new Map()).set(name.toLowerCase(), importCallback);

  if (lazyDefine.observer instanceof MutationObserver) {
    return;
  }

  lazyDefine.observer = new MutationObserver((records) => {
    if (lazyDefine.registry.size < 1) {
      return;
    }

    for (const record of records) {
      for (const node of record.addedNodes) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);

        do {
          const tagName = walker.currentNode.tagName.toLowerCase();
          const elementConstructor = lazyDefine.registry.get(tagName);

          if (elementConstructor !== undefined) {
            lazyDefine.registry.delete(tagName);

            (async () => {
              customElements.define(tagName, (await elementConstructor()).default);
            })();
          }
        } while (walker.nextNode() !== null);
      }
    }
  });

  lazyDefine.observer.observe(document, { subtree: true, childList: true });

  const { attachShadow } = HTMLElement.prototype.attachShadow;

  HTMLElement.prototype.attachShadow = function observedAttachShadow(options) {
    const shadow = attachShadow.call(this, options);

    lazyDefine.observer.observe(shadow);

    return shadow;
  };
}

export default {
  createShadowRoot,
  dispatch,
  findAttributes,
  findReferences,
  isElementInViewport,
  bindEventListeners,
  lazyDefine,
};
