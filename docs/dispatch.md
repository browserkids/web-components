# [dispatch(name, detail, settings = {})](../src/dispatch.js)  
Triggers a custom event called `name`, with `detail` as payload and the provided `settings`. By default it tries to dispatch the event on `this`. 

This function has some sensible defaults like bubbling enabled or no trespassing of the event between the boundary of shadow and regular DOM.
