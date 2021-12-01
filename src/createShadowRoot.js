/**
 * Creates a ShadowDOM for this element and
 * uses the given template as content.
 *
 * @param {HTMLElement} $el Element to create shadow root for.
 * @param {string} template Source template string.
 * @param {ShadowRootInit} settings Shadow DOM settings.
 * @return {ShadowRoot}
 */
export default function createShadowRoot($el, template = '', settings = {}) {
  const defaults = { mode: 'open' };
  const shadowRoot = $el.attachShadow({ ...defaults, ...settings });

  shadowRoot.appendChild(
    (new DOMParser())
      .parseFromString(`<template>${template}</template>`, 'text/html')
      .querySelector('template')
      .content
      .cloneNode(true),
  );

  return shadowRoot;
}
