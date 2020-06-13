# DOM

This is a collection of handy DOM functions.

## Installation

`npm install -S @mzdr/dom`

## API

**[createShadowRoot()]**  
Creates a ShadowDOM for this element and uses the given template as content.

**[findAttributes()]**  
Tries to find attributes that name is matching a given regular expression.

**[toggleAttribute()]**  
Toggles a given attribute on a bound element.

**[dispatch()]**  
Triggers a custom event with the given data.

**[isElementInViewport()]**  
Returns true if the given element is (fully) within the visible area of the viewport.


[createShadowRoot()]: ./index.js#L9
[findAttributes()]: ./index.js#L28
[toggleAttribute()]: ./index.js#L57
[dispatch()]: ./index.js#L73
[isElementInViewport()]: ./index.js#L95