# [createShadowRoot($el, template = '', settings = {})](../src/createShadowRoot.js)  
Creates a [Shadow DOM] for this element and uses the given template as content.

By default this creates an open Shadow DOM. A very simple example on how to use this would be:

```html
<my-custom-element>rock!</my-custom-element>

<script type="module">
  import { createShadowRoot } from 'https://unpkg.com/@browserkids/web-components';

  customElements.define('my-custom-element', class MyCustomElement extends HTMLElement {
    constructor() {
      super();
        
      createShadowRoot(this, `
        <style>
          :host::before {
            content: 'My scoped styles…';
          }
        </style>
        
        <slot></slot>
      `);
    }
  });
</script>
```



