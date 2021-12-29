# @browserkids/web-components

[![npm version](https://badge.fury.io/js/@browserkids%2Fweb-components.svg)](https://badge.fury.io/js/@browserkids%2Fweb-components)
[![Known Vulnerabilities](https://snyk.io/test/github/browserkids/web-components/badge.svg?targetFile=package.json)](https://snyk.io/test/github/browserkids/web-components?targetFile=package.json)
[![Build Status](https://github.com/browserkids/web-components/actions/workflows/build.yml/badge.svg)](https://github.com/browserkids/web-components/actions)
[![Dependency Status](https://img.shields.io/librariesio/release/npm/@browserkids/web-components.svg)](https://libraries.io/npm/@browserkids/web-components)

This is a collection of useful web components helper functions. They are all written in latest/cutting edge [ECMAScript 2022] code and are <strong>not</strong> transpiled.

## Installation

### Using a CDN

Fastest way to get going. See for yourself:

```html
<script type="module">
import { define } from 'https://unpkg.com/@browserkids/web-components';

define(class MyElement extends HTMLElement {
  /* Your custom element logic. */
});
</script>
```

### Using a bundler

Semi-fast way as well. Just install it via [npm].

```shell
npm install -S @browserkids/web-components
```

Import the functions where you need them.

```js
import { define } from '@browserkids/web-components';
```


## Browser support

*Almost* every function uses at least one feature of [ECMAScript 2022] , but **no** ESNext features — promised. So support should be fine for “evergreen” browsers at the time of writing. This means that Internet Explorer is out of the game.

As this library is not transpiled nor ever will be, you should use [polyfills](https://polyfill.io/) in case you need to support a specific browser version. 

<br>

[ECMAScript 2022]: https://kangax.github.io/compat-table/es2016plus/
[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[npm]: https://www.npmjs.com/


## API

1. **[define(elementConstructor)](../src/define.js)**
The `define()` helper function registers a custom element constructor to the [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define). To reduce redundant tasks like [creating a ShadowDOM](./docs/createShadowRoot.md), [binding attributes](./docs/bindAttributes.md), [setting up event listeners](./docs/bindEventListeners.md) or fetching [DOM references](./docs/findReferences.md), the given element constructor will be extended and enhanced to have a consistent developing experience.

```html
<my-element></my-element>

<script type="module">
  import { define } from 'https://unpkg.com/@browserkids/web-components';

  define(class MyElement extends HTMLElement {
  // By default define() uses the class name as element name, 
  // you can override this by defining a custom name.
  // static elementName = 'my-element';

  // You can define a static settings field to override the settings 
  // for the individual functions that define() is using.
  static settings = {
    bindAttributes: {},
    bindEventListeners: {},
    createShadowRoot: {},
    findReferences: {},
  };
  
  // Will be used by bindAttributes and turns into a proxy object.
  data = {};

  // Will be used by createShadowRoot from shadow dom creation.
  template = '';
  
  // Will be called once the element has been inserted to the DOM,
  // and the constructor of that class has finished.
  ready() {}
});

</script>
```
