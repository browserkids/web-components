<p align="center">
    <a href="https://github.com/browserkids/web-components">@browserkids/web-components</a>
</p>

<p align="center">
    <a href="https://badge.fury.io/js/%40browserkids%2Fdom"><img src="https://badge.fury.io/js/%40browserkids%2Fdom.svg" alt="npm version"></a>
    <a href="https://snyk.io/test/github/browserkids/web-components?targetFile=package.json"><img src="https://snyk.io/test/github/browserkids/web-components/badge.svg?targetFile=package.json" alt="Known Vulnerabilities"></a>
    <a href="https://travis-ci.org/browserkids/web-components"><img src="https://travis-ci.org/browserkids/web-components.svg?branch=master" alt="Build Status"></a>
    <a href="https://libraries.io/npm/@browserkids/web-components"><img src="https://img.shields.io/librariesio/release/npm/@browserkids/web-components.svg" alt="Dependency Status"></a>
</p>

<br>

<p align="center">This is a collection of useful web components helper functions. They are all written in latest/cutting edge [ECMAScript 2022] code and are <strong>not</strong> transpiled.</p>

<br>

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
