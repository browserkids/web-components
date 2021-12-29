# [findAttributes($el, name))](../src/findAttributes.js)  
Tries to find attributes that name is matching a given regular expression.

```html
<main #container class="random-class">Just a random element.</main>

<script type="module">
  import { findAttributes } from 'https://unpkg.com/@browserkids/web-components';

  console.log(findAttributes(document.querySelector('main'), /^#.+/));
  // ↪ [{ name: '#container', value: '' }]
</script>
```
