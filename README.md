<p align="center">
    <a href="https://github.com/browserkids/dom">@browserkids/dom</a>
</p>

<p align="center">
    <a href="https://snyk.io/test/github/browserkids/dom?targetFile=package.json"><img src="https://snyk.io/test/github/browserkids/dom/badge.svg?targetFile=package.json" alt="Known Vulnerabilities"></a>
    <a href="https://travis-ci.org/browserkids/dom"><img src="https://travis-ci.org/browserkids/dom.svg?branch=master" alt="Build Status"></a>
    <a href="https://david-dm.org/browserkids/dom"><img src="https://david-dm.org/browserkids/dom.svg" alt="Dependency Status"></a>
    <a href="https://david-dm.org/browserkids/dom/?type=dev"><img src="https://david-dm.org/browserkids/dom/dev-status.svg" alt="devDependency Status"></a>
</p>

<br>

This is a collection of handy DOM functions. They are all written in ES6+ code and are **not** transpiled. 

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

Semi-fast way. [Download the files](https://github.com/browserkids/dom/releases) and upload them to your server. Just make sure your import path is correct. For example:

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


   
## Browser support

*Almost* every function uses at least one feature of [ECMAScript 6] or above, but **no** ESNext features — promised. So support should be fine for “evergreen” browsers at the time of writing. This means that Internet Explorer is out of the game.

As this library is not transpiled nor ever will be you should use [polyfills](https://polyfill.io/) in case you need to support a specific browser version. 

## API

1. **[createShadowRoot()]**  
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
            <template>
              <style>
                :host::before {
                  content: 'My scoped styles…';
                }
              </style>
            
              <slot></slot>
            </template>
          `);
        }
      });
    </script>
    ```

1. **[dispatch()]**  
    Triggers a custom event with the given data.

    This function has some sensible defaults like bubbling enabled or no trespassing of the event between the boundary of shadow and regular DOM.

1. **[findAttributes()]**  
    Tries to find attributes that name is matching a given regular expression.
    
    ```html
    <main #container class="random-class">Just a random element.</main>
   
    <script type="module">
      import { findAttributes } from 'https://unpkg.com/@browserkids/dom';
   
      // [{ name: '#container', value: '' }]
      console.log(findAttributes(document.querySelector('main'), /^#.+/));
    </script>
    ```

1. **[findReferences()]**  
    Finds all elements that match the given pattern and returns them as a map.
    
    Based on `findAttributes()` this will return all elements within a given element that have `#referenceId` attributes. For example:
    
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

1. **[isElementInViewport()]**  
    Returns `true` if the given element is within the boundaries of the given viewport coordinates or at least the amount specified.
    
    You may adjust the following settings:
    
    - `amount`, specify minimum amount of overlapping/intersection between target element and viewport.
    - `viewport`, provide a custom viewport [bounding rectangle]. Default is `window` rectangle.

1. **[bindEventListeners()]**  
    Finds all elements that have event listeners defined and binds them automatically.
    
    Based on `findAttributes()` this function will find all elements that have `@event[.modifier]="function"` attributes and automatically registers the event listeners to the elements. For example:
    
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

1. **[lazyDefine()]**  
    Registers a custom element when it occurs for the first time in the DOM and lazy-loads their actual implementation.
    
    If you have lots of web components and you do not need them everywhere everytime, you could define/register them lazily and they will get loaded only when they actually appear in the (Shadow) DOM. For example: 
    
    ```html
    <script type="module">
      import { lazyDefine } from 'https://unpkg.com/@browserkids/dom';
    
      lazyDefine('my-button', () => import('../components/MyButton.js'));
      lazyDefine('my-link', () => import('../components/MyLink.js'));

      // Only my-button will be requested    
      document.body.append(
        document.createElement('my-button')
      );
    </script>
    ```


[ECMAScript 6]: https://kangax.github.io/compat-table/es6/
[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[npm]: https://www.npmjs.com/
[bounding rectangle]: https://developer.mozilla.org/en-US/docs/Web/API/DOMRect

[createShadowRoot()]: ./index.js#L30-L49
[dispatch()]: ./index.js#L51-L73
[findAttributes()]: ./index.js#L75-L102
[findReferences()]: ./index.js#L104-L145
[isElementInViewport()]: ./index.js#L147-L164
[bindEventListeners()]: ./index.js#L166-L231
[lazyDefine()]: ./index.js#L233-L291
