/* global findAttributes */

/**
 * Finds all elements that match the given pattern and returns them as a map.
 *
 * @param {HTMLElement} $el Element to look for references.
 * @param {object} settings Settings for adjusting behaviour.
 * @returns {object}
 */
export default function findReferences($el, settings = {}) {
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
      throw new Error('Pattern must include named group “id”.');
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
