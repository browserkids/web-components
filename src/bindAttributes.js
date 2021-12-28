/* global findAttributes */
const createProxy = (target, bindings, updateAttribute) => new Proxy(target, {
  set: (context, property, newValue) => {
    context[property] = newValue;

    for (const [$node, key] of bindings.get(property) ?? []) {
      updateAttribute($node, key, newValue);
    }

    return true;
  },
});

const deep = (target, key) => key.split('.').reduce((o, i) => o?.[i], target);

const updateAttribute = ($node, key, value) => {
  let properKey = key;
  let properValue = value;

  if (/^text(Content)?$/i.test(key)) {
    properKey = 'textContent';
  } else if (/^(inner)?HTML$/i.test(key)) {
    properKey = 'innerHTML';
  } else if (/^class(Name)?$/i.test(key)) {
    properKey = 'className';
  }

  if (Array.isArray(value)) {
    properValue = value
      .filter(Boolean)
      .join(' ');
  } else if (typeof value === 'object' && value !== null) {
    properValue = Object
      .entries(value)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(' ');
  }

  if ($node[properKey] === properValue) {
    return;
  }

  Object.assign($node, { [properKey]: properValue });
};

export default function bindAttributes($el, scope = {}, settings = {}) {
  const defaults = {
    pattern: /^:(?<key>[^.]+)/,
    cleanUp: true,
  };

  const { pattern, cleanUp } = { ...defaults, ...settings };
  const bindings = new Map();
  const walker = document.createTreeWalker($el, NodeFilter.SHOW_ELEMENT);

  do {
    const $currentNode = walker.currentNode;
    const matches = (settings.findAttributes || findAttributes)($currentNode, pattern);

    matches.forEach(({ name, value }) => {
      const { key } = name.match(pattern).groups || {};

      if (key === undefined) {
        throw new Error('Pattern must include named group “key”.');
      }

      // See if we have already a map of nodes for this value
      const values = bindings.get(value) || new Map();

      // Add current node to the map of values and the bound key/attribute
      values.set($currentNode, key);

      // Update bindings for this value with the map of nodes
      bindings.set(value, values);

      updateAttribute($currentNode, key, deep(scope, value));

      if (cleanUp) {
        $currentNode.removeAttribute(name);
      }
    });
  } while (walker.nextNode() !== null);

  return createProxy(scope, bindings, updateAttribute);
}
