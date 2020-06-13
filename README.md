# DOM

This is a collection of handy DOM functions. They are all written in ES6+ code and are **not** transpiled. 

## Installation

Running locally or need to install it? Just run…

`npm install -S @mzdr/dom`

Want to use it directly on your website? Try this…

```html
<script type="module">
import { isElementInViewport } from 'https://unpkg.com/@mzdr/dom/index.js';

console.log(isElementInViewport(document.body))
</script>
```

## API

**[createShadowRoot()]**  
Creates a ShadowDOM for this element and uses the given template as content.

**[findAttributes()]**  
Tries to find attributes that name is matching a given regular expression.

**[dispatch()]**  
Triggers a custom event with the given data.

**[isElementInViewport()]**  
Returns true if the given element is (fully) within the visible area of the viewport.


[createShadowRoot()]: ./index.js#L9
[findAttributes()]: ./index.js#L28
[dispatch()]: ./index.js#L58
[isElementInViewport()]: ./index.js#L80