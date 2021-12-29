<p align="center">
    <a href="https://github.com/browserkids/web-components">@browserkids/web-components</a>
</p>

<p align="center">
    <a href="https://badge.fury.io/js/%40browserkids%2Fdom"><img src="https://badge.fury.io/js/%40browserkids%2Fdom.svg" alt="npm version"></a>
    <a href="https://snyk.io/test/github/browserkids/web-components?targetFile=package.json"><img src="https://snyk.io/test/github/browserkids/web-components/badge.svg?targetFile=package.json" alt="Known Vulnerabilities"></a>
    <a href="https://travis-ci.org/browserkids/web-components"><img src="https://travis-ci.org/browserkids/web-components.svg?branch=master" alt="Build Status"></a>
    <a href="https://david-dm.org/browserkids/web-components"><img src="https://david-dm.org/browserkids/web-components.svg" alt="Dependency Status"></a>
    <a href="https://david-dm.org/browserkids/web-components/?type=dev"><img src="https://david-dm.org/browserkids/web-components/dev-status.svg" alt="devDependency Status"></a>
</p>

<br>

<p align="center">This is a collection of handy DOM functions. They are all written in ES9+ code and are <strong>not</strong> transpiled.</p>

<br>

## Installation

### Using a CDN

Fastest way to get going. See for yourself:

```html
<script type="module">
import { findReferences } from 'https://unpkg.com/@browserkids/web-components';

console.log(findReferences(document.body))
</script>
```

### Self hosted

Semi-fast way. [Download the files](https://github.com/browserkids/web-components/releases) and upload them to your server. Just make sure your import path is correct.

```js
import { findReferences } from './assets/@browserkids/web-components/index.js';
```

### Using a bundler

Semi-fast way as well. Just install it via [npm].

```shell
npm install -S @browserkids/web-components
```

Import the functions where you need them.

```js
import { findReferences } from '@browserkids/web-components';
```


## Browser support

*Almost* every function uses at least one feature of [ECMAScript 9] or above, but **no** ESNext features — promised. So support should be fine for “evergreen” browsers at the time of writing. This means that Internet Explorer is out of the game.

As this library is not transpiled nor ever will be you should use [polyfills](https://polyfill.io/) in case you need to support a specific browser version. 

<br>

## API

1. **[createShadowRoot($el, template = '', settings = {})](./src/createShadowRoot.js)**  
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

1. **[dispatch($el, name, detail, settings = {})](./src/dispatch.js)**  
    Triggers a custom event with the given data.

    This function has some sensible defaults like bubbling enabled or no trespassing of the event between the boundary of shadow and regular DOM.

1. **[findAttributes($el, name))](./src/findAttributes.js)**  
    Tries to find attributes that name is matching a given regular expression.
    
    ```html
    <main #container class="random-class">Just a random element.</main>
   
    <script type="module">
      import { findAttributes } from 'https://unpkg.com/@browserkids/web-components';
   
      // [{ name: '#container', value: '' }]
      console.log(findAttributes(document.querySelector('main'), /^#.+/));
    </script>
    ```

1. **[findReferences($el, settings = {})](./src/findReferences.js)**  
    Finds all elements within a given element that have `#referenceId` (by default) attributes.

    ```html
    <body>
      <header #header></header>
      <main #content>
        <h1 #headline></h1>
      </main>
      <footer #footer></footer>
    </body>
    
    <script type="module">
      import { findReferences } from 'https://unpkg.com/@browserkids/web-components';
    
      // { header: header, headline: h1, content: main, footer: footer }
      console.log(findReferences(document.body));
    </script>
    ```
   
    Available settings:
    - `pattern` (default: `/^#(?<id>.+)/`), adjust the RegEx pattern for finding references.
    - `cleanUp` (default: `true`), remove attributes after finding reference.



1. **[bindAttributes($el, scope = {}, settings = {})](./src/bindAttributes.js)**  
    Finds all elements that have `:name="key"` (by default) attributes and automatically two-way binds the values to the elements attributes.

    :warning: If you [single-import] this function, make sure to provide a `findAttributes()` function.

    ```html
    <body :class="classes">
      <main :text="welcome"></main>    
    </body>
    
    <script type="module">
      import { bindAttributes } from 'https://unpkg.com/@browserkids/dom';
   
      const defaults = { 
        classes: {
          'is-noon': (new Date()).getHours() >= 4,
        },
        welcome: 'Hello world.'
      };
    
      const state = bindAttributes(document.body, defaults);
      // ↪ <main :text="welcome"></main> will become <main>Hello world.</main>
      // ↪ <body :class="classes">…</body> will become <body class="is-noon">…</body> if current time is past 4pm
   
      state.welcome = 'Hello again.';
      // ↪ <main>Hello world</main> will become <main>Hello again.</main>
    </script>
    ```

    If the bound values are non-strings they will be converted to strings. Arrays and objects will be concatenated using spaces and values that are `falsey` will be dropped.

    Available settings:
    - `pattern` (default: `/^:(?<key>[^.]+)/`), adjust the RegEx pattern for finding bind hooks.
    - `cleanUp` (default: `true`), remove attributes after finding them.
    - `findAttributes`, function for finding attributes. This is **only** mandatory if you [single-import] this function.

1. **[bindEventListeners($el, scope = $el, settings = {})](./src/bindEventListeners.js)**  
    Finds all elements that have `@event[.modifier]="function"` (by default) attributes and automatically registers the event listeners to the elements.

    ```html
    <main @click="onClick">Just a random element.</main>
    
    <script type="module">
      import { bindEventListeners } from 'https://unpkg.com/@browserkids/web-components';
    
      bindEventListeners(document.body, {
        onClick() {
          console.log('I just got clicked.');
        }
      });
    </script>
    ```
   
    There are a few modifiers available:
        
    - `prevent` calls `e.preventDefault()` before running the event listener.
    - `self`, calls only when `event.target === event.currentTarget`. 
    - `away`, calls only when the `event.target` is not a child of event listener element.
    - `once`, calls the event listener only once.
    - `window`, attaches the event listener to the window object.
    - `document`, attaches the event listener to the document object.
   
    Available settings:
    - `pattern` (default: `/^@(?<event>[^.]+).?(?<modifier>.+)?/`), adjust the RegEx pattern for finding event hooks.
    - `cleanUp` (default: `true`), remove attributes after finding reference.
    
1. **[upgrade($el, template)](./src/upgrade.js)**

    All-in-one function that will run `createShadowRoot`, `findReferences`, `bindEventListeners` and `bindAttributes`.

    ```html
    <my-custom-element></my-custom-element>
   
    <script type="module">
      import { upgrade } from 'https://unpkg.com/@browserkids/web-components';
    
      customElements.define('my-custom-element', class MyCustomElement extends HTMLElement {
        constructor() {
          super();

          this.counter = 0;
          this.state = upgrade(this, '<button @click="onClick" :text="text"></button>', {
            text: 'Click me!'
          });
        }

        onClick() {
          this.counter += 1;
          this.state.text = `
            Please, no more clicks.
            ${this.counter} ${this.counter === 1 ? 'was' : 'where'} enough.
          `;
        }
    });
    </script>
    ```

[ECMAScript 9]: https://kangax.github.io/compat-table/es2016plus/
[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[npm]: https://www.npmjs.com/
[bounding rectangle]: https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
[single-import]: #single-import
