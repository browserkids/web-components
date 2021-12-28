<p align="center">
    <a href="https://github.com/browserkids/dom">@browserkids/dom</a>
</p>

<p align="center">
    <a href="https://badge.fury.io/js/%40browserkids%2Fdom"><img src="https://badge.fury.io/js/%40browserkids%2Fdom.svg" alt="npm version"></a>
    <a href="https://snyk.io/test/github/browserkids/dom?targetFile=package.json"><img src="https://snyk.io/test/github/browserkids/dom/badge.svg?targetFile=package.json" alt="Known Vulnerabilities"></a>
    <a href="https://travis-ci.org/browserkids/dom"><img src="https://travis-ci.org/browserkids/dom.svg?branch=master" alt="Build Status"></a>
    <a href="https://david-dm.org/browserkids/dom"><img src="https://david-dm.org/browserkids/dom.svg" alt="Dependency Status"></a>
    <a href="https://david-dm.org/browserkids/dom/?type=dev"><img src="https://david-dm.org/browserkids/dom/dev-status.svg" alt="devDependency Status"></a>
</p>

<br>

<p align="center">This is a collection of handy DOM functions. They are all written in ES9+ code and are <strong>not</strong> transpiled.</p>

<br>

## Installation

### Using a CDN

Fastest way to get going. See for yourself:

```html
<script type="module">
import { isElementInViewport } from 'https://unpkg.com/@browserkids/dom';

console.log(isElementInViewport(document.body))
</script>
```

### Self hosted

Semi-fast way. [Download the files](https://github.com/browserkids/dom/releases) and upload them to your server. Just make sure your import path is correct.

```js
import { isElementInViewport } from './assets/@browserkids/dom/index.js';
```

### Using a bundler

Semi-fast way as well. Just install it via [npm].

```shell
npm install -S @browserkids/dom
```

Import the functions where you need them.

```js
import { isElementInViewport } from '@browserkids/dom';
```


### Single import

Just want to import a single function?

```html
<script type="module">
import isElementInViewport from 'https://unpkg.com/@browserkids/dom/isElementInViewport';

console.log(isElementInViewport(document.body))
</script>
```

:warning: Some functions depend on other @browserkids/dom functions. See [API](#api) chapter for details.

```html
<script type="module">
import findAttributes from 'https://unpkg.com/@browserkids/dom/findAttributes';
import findReferences from 'https://unpkg.com/@browserkids/dom/findReferences';

// Provide necessary functions via settings object.
console.log(findReferences(document.body, { findAttributes }))
</script>
```

<br>
   
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
      import { createShadowRoot } from 'https://unpkg.com/@browserkids/dom';
    
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
      import { findAttributes } from 'https://unpkg.com/@browserkids/dom';
   
      // [{ name: '#container', value: '' }]
      console.log(findAttributes(document.querySelector('main'), /^#.+/));
    </script>
    ```

1. **[findReferences($el, settings = {})](./src/findReferences.js)**  
    Finds all elements within a given element that have `#referenceId` (by default) attributes.
    
    :warning: If you [single-import] this function, make sure to provide a `findAttributes()` function.
    
    ```html
    <body>
      <header #header></header>
      <main #content>
        <h1 #headline></h1>
      </main>
      <footer #footer></footer>
    </body>
    
    <script type="module">
      import { findReferences } from 'https://unpkg.com/@browserkids/dom';
    
      // { header: header, headline: h1, content: main, footer: footer }
      console.log(findReferences(document.body));
    </script>
    ```
   
    Available settings:
    - `pattern` (default: `/^#(?<id>.+)/`), adjust the RegEx pattern for finding references.
    - `cleanUp` (default: `true`), remove attributes after finding reference.
    - `findAttributes`, function for finding attributes. This is **only** mandatory if you [single-import] this function.

1. **[isElementInViewport($el, settings = {})](./src/isElementInViewport.js)**  
    Returns `true` if the given element is within the boundaries of the given viewport coordinates or at least the amount specified.
    
    You may adjust the following settings:
    
    - `amount`, specify minimum amount of overlapping/intersection between target element and viewport.
    - `viewport`, provide a custom viewport [bounding rectangle]. Default is `window` rectangle.



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
    
    :warning: If you [single-import] this function, make sure to provide a `findAttributes()` function.
    
    ```html
    <main @click="onClick">Just a random element.</main>
    
    <script type="module">
      import { bindEventListeners } from 'https://unpkg.com/@browserkids/dom';
    
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
    - `findAttributes`, function for finding attributes. This is **only** mandatory if you [single-import] this function.
    
1. **[upgrade($el, template)](./src/upgrade.js)**

    All-in-one function that will run `createShadowRoot`, `bindEventListeners`, `findReferences`.

    :warning: If you [single-import] this function, make sure all necessary functions are known to the global scope.

    ```html
    <my-custom-element></my-custom-element>
   
    <script type="module">
      import { upgrade } from 'https://unpkg.com/@browserkids/dom';
    
      customElements.define('my-custom-element', class MyCustomElement extends HTMLElement {
        constructor() {
          super();
            
          upgrade(this, '<button @click="onClick" #button>Hit me</button>');

          console.log(this.$refs);
        }

        onClick() {
          console.log('I was clicked.');
        }
      });
    </script>
    ```

[ECMAScript 9]: https://kangax.github.io/compat-table/es2016plus/
[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[npm]: https://www.npmjs.com/
[bounding rectangle]: https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
[single-import]: #single-import
