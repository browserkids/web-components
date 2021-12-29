# [bindAttributes($el, scope = {}, settings = {})](../src/bindAttributes.js)  
Finds all elements that have `:name="key"` (by default) attributes and automatically two-way binds the values to the elements attributes.

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
