/**
 * Tries to find attributes that name is matching a given regular expression.
 *
 * @param {HTMLElement} $el Element to check attributes for matches.
 * @param {RegExp} name Regular expression for the attribute name.
 * @return {Attr[]} Returns a list of matching attributes.
 */
export default function findAttributes($el, name) {
  if (name instanceof RegExp === false) {
    throw new Error('Attribute name must be a regular expression.');
  }

  const attributes = [];

  if (typeof $el.hasAttributes !== 'function' || $el.hasAttributes() === false) {
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
