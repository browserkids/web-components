# [bindEventListeners($el, scope = $el, settings = {})](../src/bindEventListeners.js)  
Finds all elements that have `@[target.]event[.modifier]="function"` (by default) attributes and automatically registers the event listeners to the elements.

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

- `away`, calls only when the `event.target` is not a child of event listener element.
- `capture`, will dispatch to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
- `once`, calls the event listenser only once.
- `passive`, indicates that the function specified by listener will never call `preventDefault()`.
- `prevent` calls `e.preventDefault()` before running the event listener.
- `self`, calls only when `event.target === event.currentTarget`.

If no target is given it will fall back to the element itself, you can choose between:

- `document`, attaches the event listener to the document object.
- `window`, attaches the event listener to the window object.

Available settings:
- `pattern` (default: `^@(?:(?<target>window|document)\.)?(?<event>[^.]+)(?:\.(?<modifier>.+))?`), adjust the RegEx pattern for finding event hooks.
- `cleanUp` (default: `true`), remove attributes after finding reference.
