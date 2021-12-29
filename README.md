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
import { findReferences } from 'https://unpkg.com/@browserkids/dom';

console.log(findReferences(document.body))
</script>
```

### Self hosted

Semi-fast way. [Download the files](https://github.com/browserkids/dom/releases) and upload them to your server. Just make sure your import path is correct.

```js
import { findReferences } from './assets/@browserkids/dom/index.js';
```

### Using a bundler

Semi-fast way as well. Just install it via [npm].

```shell
npm install -S @browserkids/dom
```

Import the functions where you need them.

```js
import { findReferences } from '@browserkids/dom';
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

1. **[bindEventListeners($el, scope = $el, settings = {})](./src/bindEventListeners.js)**  
    Finds all elements that have `@event[.modifier]="function"` (by default) attributes and automatically registers the event listeners to the elements.

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
    
1. **[upgrade($el, template)](./src/upgrade.js)**

    All-in-one function that will run `createShadowRoot`, `bindEventListeners`, `findReferences`.

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
