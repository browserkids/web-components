# [findReferences($el, settings = {})](../src/findReferences.js)  
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

