<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/zero-dependencies-orange" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/size-~3KB_gzipped-purple" alt="Size">
</p>

# XenonJS

A tiny, event-driven DOM toolkit for modern JavaScript — built for clean chaining, smart event handling, and zero overhead.

No framework. No dependencies. Just fast, expressive DOM control.
DOM manipulation, event handling, and more — without the overhead of a full framework.

## Why XenonJS?

- **Zero dependencies** — pure JavaScript, no bloat
- **Tiny footprint** — ships as a single ES module (~3KB gzipped)
- **Chainable API** — fluent interface for clean, readable code
- **Smart event system** — built-in deduplication, delegation, and scoped cleanup via an internal event bucket
- **Static methods** — use `X.hide('.ad')` for quick one-liners without chaining
- **Built-in context menus** — custom right-click menus out of the box
- **Modern** — ES2020+, built with Vite


## Why not just use vanilla JS?

Because XenonJS gives you:

- **Cleaner chaining**
```js
X('.card').addClass('active').css('opacity', '1')
```
vs
```js
document.querySelectorAll('.card').forEach(el => {
  el.classList.add('active')
  el.style.opacity = '1'
})
```

## Installation

```bash
npm install xenonjs
```

## Quick Start

```javascript
import X from 'xenonjs';

// Select and manipulate
X('.card').addClass('active').css('opacity', '1');

// Event handling with delegation
X('.list').on('click', '.item', (e, matched) => {
    console.log('Clicked:', matched.textContent);
});

// One-liner static methods
X.hide('.banner');
X.text('.title', 'Hello, Xenon!');
```



## Smart Event System (no duplicates, no leaks)

XenonJS automatically prevents duplicate listeners and tracks them internally.

```js
X('.btn').on('click', handler)
X('.btn').on('click', handler) // ← ignored, no duplicate
```

You also get:
- Delegation built-in
- Easy cleanup with .off()
- Memory-safe via WeakMap


## Built-in Context Menus (no plugin needed)

Create fully custom right-click menus in seconds:

```js
X('.canvas').context([
  { text: 'Copy', action: copy },
  { text: 'Paste', action: paste }
])
```

- Menus auto-position to stay within the viewport.
- Close on outside click, <kbd>Esc</kbd>, window blur, or resize.
- Supports `svg`, `icon` (image URL), and `action` (function or string stored as `data-context-action`).



## Example: Interactive List

```js
X('.list')
  .on('click', '.item', (e, el) => {
    X(el).toggleClass('active')
  })

X('.add-btn').on('click', () => {
  X('#list').append('<li class="item">New item</li>')
})
```



## API Reference

### Selection & Traversal

| Method | Description |
|--------|-------------|
| `X(selector)` | Select elements by CSS selector, Element, NodeList, or array |
| `.i(index)` | Get a wrapped element at a specific index |
| `.first()` | Get the first matched element (wrapped) |
| `.last()` | Get the last matched element (wrapped) |
| `.get(index?)` | Get the raw DOM element (default: index 0) |
| `.length()` | Number of matched elements |
| `.each(fn)` | Iterate over matched elements |
| `.find(selector)` | Find descendants matching a selector |
| `.parent()` | Get parent elements |
| `.closest(selector)` | Get nearest ancestor matching a selector |

```javascript
const items = X('.list-item');

items.first().addClass('highlight');
items.last().text('Final item');
items.i(2).css('color', 'red');

X('.child').closest('.container').addClass('found');
```

### DOM Manipulation

| Method | Description |
|--------|-------------|
| `.append(content)` | Insert content at the end of each element |
| `.prepend(content)` | Insert content at the start of each element |
| `.before(content)` | Insert content before each element |
| `.after(content)` | Insert content after each element |
| `.empty()` | Remove all child nodes |
| `.remove()` | Remove matched elements from the DOM |

Content can be an HTML string or a DOM Element.

```javascript
X('#list').append('<li>New item</li>');
X('.target').before('<hr>').after('<hr>');
X('.old-content').empty();
X('.disposable').remove();
```

### Attributes, Data & Properties

| Method | Description |
|--------|-------------|
| `.html(value?)` | Get/set innerHTML |
| `.text(value?)` | Get/set textContent |
| `.val(value?)` | Get/set form input value |
| `.attr(name, value?)` | Get/set an attribute |
| `.removeAttr(name)` | Remove an attribute |
| `.data(name, value?)` | Get/set a data attribute |
| `.removeData(name)` | Remove a data attribute |
| `.prop(name, value?)` | Get/set a DOM property |
| `.removeProp(name)` | Remove a DOM property |
| `.css(prop, value?)` | Get/set inline styles (string or object) |

```javascript
// Getter (no value argument)
const title = X('.heading').text();
const href  = X('a.link').attr('href');

// Setter (returns wrapper for chaining)
X('.heading').text('Updated!');
X('.box').css({ background: '#222', color: '#fff', padding: '1rem' });
X('.card').data('id', '42');
```

### Classes

| Method | Description |
|--------|-------------|
| `.addClass(names)` | Add one or more classes |
| `.removeClass(names)` | Remove one or more classes |
| `.toggleClass(names, force?)` | Toggle classes; optional boolean to force add/remove |
| `.hasClass(names)` | Check if the first element has all given classes |
| `.is(selector)` | Check if the first element matches a CSS selector |

Class names can be a space-separated string or an array.

```javascript
X('.item').addClass('active highlighted');
X('.item').toggleClass('open');
X('.item').hasClass('active'); // true / false
```

### Visibility

| Method | Description |
|--------|-------------|
| `.hide()` | Set `display: none` |
| `.show(display?)` | Restore display (default: `''`) |
| `.toggle(force?)` | Toggle visibility; optional boolean to force state |

```javascript
X('.modal').show();
X('.tooltip').toggle();
X('.ad').hide();
```

### State Helpers

| Method | Description |
|--------|-------------|
| `.checked(value?)` | Get/set the `checked` state of checkboxes/radios |
| `.disabled(value?)` | Get/set the `disabled` state of inputs/buttons |

```javascript
X('#agree').checked(true);
X('.submit-btn').disabled(false);
```

### Events

XenonJS uses an internal **event bucket** system built on a `WeakMap`. This prevents duplicate handler registration and enables precise cleanup — all without leaking memory.

| Method | Description |
|--------|-------------|
| `.on(event, [selector], callback, [options])` | Attach an event listener; optional delegation via selector |
| `.once(event, [selector], callback, [options])` | Like `.on()`, but fires only once |
| `.off(event?, [selector], [callback], [options])` | Remove specific or all listeners |
| `.onclick(callback)` | Shorthand for `.on('click', ...)` |
| `.onchange(callback)` | Shorthand for `.on('change', ...)` |
| `.trigger(eventName, detail?)` | Dispatch a `CustomEvent` on matched elements |

```javascript
// Basic event
X('.btn').on('click', (e, el) => console.log('Clicked!', el));

// Delegated event
X('.list').on('click', '.list-item', (e, matched) => {
    matched.classList.add('selected');
});

// One-time event
X('.welcome').once('click', () => alert('Hello!'));

// Cleanup
X('.btn').off('click');   // remove all click handlers
X('.btn').off();          // remove all handlers on element

// Custom events
X('.widget').on('data-loaded', (e) => console.log(e.detail));
X('.widget').trigger('data-loaded', { rows: 100 });
```

### Context Menus

Create custom right-click menus declaratively.

```javascript
X('.canvas').context([
    { text: 'Cut',    action: () => cut(),   svg: cutIcon },
    { text: 'Copy',   action: () => copy(),  svg: copyIcon },
    { text: 'Paste',  action: () => paste(), svg: pasteIcon },
], {
    id: 'editor-menu',
    className: 'dark-theme',
});
```

- Menus auto-position to stay within the viewport.
- Close on outside click, <kbd>Esc</kbd>, window blur, or resize.
- Supports `svg`, `icon` (image URL), and `action` (function or string stored as `data-context-action`).

### Static Methods

Every instance method is also available as a static method where the first argument is the selector:

```javascript
X.addClass('.nav', 'open');
X.hide('.banner');
X.text('.title', 'Hello');
X.on('.btn', 'click', () => { /* ... */ });
X.toggle('.sidebar');
```

### Bus Plugin — Decoupled Messaging

XenonJS ships with an optional event bus plugin for pub/sub communication between decoupled parts of your app.

```javascript
import 'xenonjs/bus'; // attaches X.bus automatically

// Subscribe
const unsub = X.bus.on('user:login', (data) => console.log(data.name));

// Publish (async pipeline — each listener transforms the value)
const result = await X.bus.emit('cart:total', 100);

// One-time listener
X.bus.once('app:ready', (cfg) => init(cfg));

// Cleanup
unsub();                     // single listener
X.bus.off('user:login');     // all listeners for event
X.bus.off();                 // full reset
```

Supports wildcards, async pipelines, `has()` checks, and convenient unsubscribe handles.  
See the full API and examples in [docs/bus.README.md](docs/bus.README.md).

## Project Structure

```
xenonjs/
├── src/
│   ├── index.js              # Core Wrapper class, X() factory, static API
│   ├── bus.js                # Event bus plugin (optional)
│   └── services/
│       ├── context.js         # Context menu system
│       └── util.js            # Shared helpers (class normalization, event keys)
├── index.html                 # Dev playground
├── vite.config.js             # Vite build config (ES module library output)
├── package.json
└── examples.md                # Extended usage examples
```

## Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build library to dist/
npm run build
```

The build outputs a single ES module at `dist/index.js`.

## License

[MIT](https://opensource.org/licenses/MIT) © Stelios Ignatiadis