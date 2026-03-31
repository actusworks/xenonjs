# XenonJS — Complete Usage Examples

Practical, copy-paste-ready examples covering the full XenonJS API.  
Every snippet assumes you've imported the library:

```javascript
import X from 'xenonjs';
```

---

## Table of Contents

1. [Selection & Traversal](#1-selection--traversal)
2. [DOM Manipulation](#2-dom-manipulation)
3. [Attributes, Data & Properties](#3-attributes-data--properties)
4. [Styling with CSS](#4-styling-with-css)
5. [Classes](#5-classes)
6. [Visibility](#6-visibility)
7. [State Helpers](#7-state-helpers)
8. [Events](#8-events)
9. [Custom Events](#9-custom-events)
10. [Context Menus](#10-context-menus)
11. [Static Methods](#11-static-methods)
12. [Real-World Recipes](#12-real-world-recipes)

---

## 1. Selection & Traversal

### Creating a Wrapper

`X()` accepts a CSS selector string, a DOM Element, a NodeList, or an array of Elements.

```javascript
// From a CSS selector — selects all matches
const cards = X('.card');

// From a single DOM element
const hero = X(document.getElementById('hero'));

// From a NodeList
const inputs = X(document.querySelectorAll('input'));

// From an array of elements
const pair = X([document.body, document.head]);
```

### Picking Individual Elements

```javascript
const tabs = X('.tab');

// By zero-based index — returns a new Wrapper
const second = tabs.i(1);

// First & last shortcuts
const first = tabs.first();
const last  = tabs.last();

// Get the raw DOM node (defaults to index 0)
const rawFirst = tabs.get();      // same as tabs.get(0)
const rawThird = tabs.get(2);
```

### Counting Matches

```javascript
const count = X('.notification').length();
console.log(`You have ${count} notifications`);
```

### Iterating

```javascript
X('.list-item').each((el, index) => {
    el.textContent = `Item #${index + 1}`;
});
```

### DOM Traversal

```javascript
// Find descendants within the matched elements
X('.sidebar').find('.nav-link');

// Get parent elements (de-duplicated)
X('.child').parent();

// Find the nearest matching ancestor
X('.deeply-nested').closest('.section');
```

### Chaining Traversal

```javascript
X('.container')
    .find('.card')
    .first()
    .addClass('featured');
```

---

## 2. DOM Manipulation

### Inserting Content

Content can be an **HTML string** or a **DOM Element**.

```javascript
// Append inside — adds to the end of children
X('#messages').append('<div class="msg">Hello!</div>');

// Prepend inside — adds to the beginning of children
X('#messages').prepend('<div class="msg system">Welcome back</div>');

// Insert adjacent — before the element
X('.divider').before('<h2>Section Title</h2>');

// Insert adjacent — after the element
X('.divider').after('<p>Section content goes here.</p>');
```

### Inserting a DOM Element

```javascript
const badge = document.createElement('span');
badge.className = 'badge';
badge.textContent = 'New';

X('.product-title').after(badge);
```

### Clearing and Removing

```javascript
// Remove all child nodes, keeping the element itself
X('#container').empty();

// Remove the matched elements entirely from the DOM
X('.old-alert').remove();
```

### Finding & Moving Content

```javascript
// Find all links inside a nav, then add a class
X('nav').find('a').addClass('nav-link');

// Get parent of active tab
X('.tab.active').parent().addClass('has-active');

// Find nearest section wrapper
X('.error-msg').closest('.form-group').addClass('has-error');
```

---

## 3. Attributes, Data & Properties

### HTML, Text, and Value

```javascript
// Get inner HTML of the first matched element
const markup = X('.content').html();

// Set inner HTML on all matched elements
X('.content').html('<p>Updated content</p>');

// Get / set text content
const label = X('.label').text();
X('.label').text('New Label');

// Get / set form input value
const email = X('#email').val();
X('#email').val('user@example.com');
```

### Attributes

```javascript
// Read an attribute
const href = X('a.logo').attr('href');

// Set an attribute on all matched links
X('a.external').attr('target', '_blank');

// Remove an attribute
X('a.external').removeAttr('rel');
```

### Data Attributes

Reads and writes to the element's `dataset` (HTML5 `data-*` attributes).

```javascript
// Set data-id="42" on all cards
X('.card').data('id', '42');

// Read data-id from the first card
const cardId = X('.card').data('id'); // "42"

// Remove data-id
X('.card').removeData('id');
```

### DOM Properties

```javascript
// Set a property
X('#terms').prop('checked', true);

// Read a property
const isChecked = X('#terms').prop('checked'); // true

// Remove a custom property
X('#terms').removeProp('myCustomFlag');
```

---

## 4. Styling with CSS

### Single Property

```javascript
// Set a single CSS property
X('.box').css('background-color', '#1a1a2e');

// Read a computed style value
const bg = X('.box').css('background-color');
```

### Multiple Properties (Object)

```javascript
X('.card').css({
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '1.5rem',
    transition: 'transform 0.2s ease',
});
```

### Chaining with Other Methods

```javascript
X('.hero')
    .css('min-height', '80vh')
    .addClass('loaded')
    .text('Welcome');
```

---

## 5. Classes

Class names can be a **space-separated string** or an **array**.

### Adding Classes

```javascript
X('.item').addClass('active');
X('.item').addClass('bold italic');         // space-separated
X('.item').addClass(['highlight', 'large']); // array
```

### Removing Classes

```javascript
X('.item').removeClass('highlight');
X('.item').removeClass('bold italic');
```

### Toggling Classes

```javascript
// Toggle — adds if missing, removes if present
X('.menu').toggleClass('open');

// Force add (true) or force remove (false)
X('.menu').toggleClass('open', true);   // always adds
X('.menu').toggleClass('open', false);  // always removes
```

### Checking Classes

```javascript
if (X('.item').hasClass('active')) {
    console.log('Item is active');
}

// Check multiple — returns true only if ALL are present
X('.item').hasClass('active bold'); // true if both exist
```

### Matching a Selector

```javascript
if (X('.field').is(':focus')) {
    console.log('Field is focused');
}

if (X('.btn').is('.primary')) {
    console.log('This is a primary button');
}
```

### Case-Insensitive Aliases

XenonJS also provides lowercase aliases: `addclass`, `removeclass`, `toggleclass`, `hasclass`.

```javascript
X('.item').addclass('active');     // same as addClass
X('.item').removeclass('active');  // same as removeClass
X('.item').toggleclass('active');  // same as toggleClass
X('.item').hasclass('active');     // same as hasClass
```

---

## 6. Visibility

### Show / Hide

```javascript
// Hide elements (sets display: none)
X('.tooltip').hide();

// Show elements (restores display)
X('.tooltip').show();

// Show with a specific display value
X('.modal').show('flex');
```

### Toggle

```javascript
// Auto-toggle based on current computed display
X('.panel').toggle();

// Force show (true) or force hide (false)
X('.panel').toggle(true);   // guarantees visible
X('.panel').toggle(false);  // guarantees hidden
```

### Practical Example

```javascript
X('#toggle-btn').onclick((e, el) => {
    X('.sidebar').toggle();
});
```

---

## 7. State Helpers

Convenience getters/setters for common boolean states.

### Checked

```javascript
// Check a checkbox
X('#agree').checked(true);

// Read checked state
if (X('#agree').checked()) {
    console.log('User agreed');
}
```

### Disabled

```javascript
// Disable a button
X('.submit-btn').disabled(true);

// Enable it
X('.submit-btn').disabled(false);

// Read disabled state
const isDisabled = X('.submit-btn').disabled();
```

### Combining with Events

```javascript
X('#agree').onchange((e, el) => {
    const agreed = X('#agree').checked();
    X('.submit-btn').disabled(!agreed);
});
```

---

## 8. Events

### Basic Event Binding

The callback receives the native Event and the matched element.

```javascript
X('.btn').on('click', (e, el) => {
    console.log('Clicked:', el.textContent);
});
```

### Shorthands

```javascript
X('.btn').onclick((e, el) => {
    console.log('Button clicked');
});

X('select#country').onchange((e, el) => {
    console.log('Country changed to:', el.value);
});
```

### Event Delegation

Listen on a parent, fire only when the click target matches a child selector.

```javascript
X('.todo-list').on('click', '.todo-item', (e, matchedItem) => {
    matchedItem.classList.toggle('completed');
});

// Works for dynamically added children too — the listener is on the parent
```

### One-Time Events

```javascript
X('.intro').once('click', (e, el) => {
    el.textContent = 'You clicked! This won\'t fire again.';
});
```

### With Options

Standard `addEventListener` options (`capture`, `passive`, etc.) are supported.

```javascript
// Capture phase
X('.wrapper').on('focus', (e, el) => {
    console.log('Focus captured');
}, true);

// Passive listener (for scroll performance)
X(document).on('scroll', (e) => {
    console.log('Scrolling...');
}, { passive: true });
```

### Removing Event Listeners

```javascript
const handler = (e, el) => console.log('Hover!');

// Attach
X('.card').on('mouseenter', handler);

// Remove a specific handler
X('.card').off('mouseenter', handler);

// Remove ALL mouseenter handlers
X('.card').off('mouseenter');

// Remove ALL event handlers registered via XenonJS on this element
X('.card').off();
```

### Removing Delegated Listeners

```javascript
const itemHandler = (e, matched) => console.log(matched);

X('.list').on('click', '.item', itemHandler);

// Remove this specific delegated handler
X('.list').off('click', '.item', itemHandler);

// Remove all delegated click handlers for '.item'
X('.list').off('click', '.item');
```

### Duplicate Prevention

XenonJS's event bucket system automatically prevents the same callback from being registered twice for the same event + selector + options combination.

```javascript
const logClick = (e) => console.log('click');

X('.btn').on('click', logClick);
X('.btn').on('click', logClick); // silently ignored — no duplicate
```

---

## 9. Custom Events

### Dispatching Custom Events

`trigger()` dispatches a `CustomEvent` that bubbles and is cancelable.

```javascript
// Fire a custom event with data
X('.widget').trigger('data-loaded', { rows: 150, source: 'api' });
```

### Listening for Custom Events

```javascript
X('.widget').on('data-loaded', (e, el) => {
    console.log('Rows:', e.detail.rows);       // 150
    console.log('Source:', e.detail.source);    // "api"
});
```

### Building a Mini Event Bus

```javascript
// Use a single invisible element as an event bus
const bus = document.createElement('div');

X(bus).on('user:login', (e) => {
    console.log('User logged in:', e.detail.name);
});

X(bus).on('user:logout', (e) => {
    console.log('User logged out');
});

// Broadcast from anywhere
X(bus).trigger('user:login', { name: 'Ada' });
X(bus).trigger('user:logout');
```

---

## 10. Context Menus

### Basic Context Menu

```javascript
X('.canvas').context([
    { text: 'Undo',   action: () => undo() },
    { text: 'Redo',   action: () => redo() },
    { text: 'Delete', action: () => deleteSelection() },
]);
```

### With Icons (SVG or Image URL)

```javascript
X('.editor').context([
    {
        text: 'Cut',
        svg: '<svg viewBox="0 0 24 24"><path d="M..."/></svg>',
        action: () => cut(),
    },
    {
        text: 'Copy',
        icon: '/icons/copy.png',
        action: () => copy(),
    },
    {
        text: 'Paste',
        svg: '<svg viewBox="0 0 24 24"><path d="M..."/></svg>',
        action: () => paste(),
    },
]);
```

### String Actions (via `data-context-action`)

When `action` is a string, it's stored as a `data-context-action` attribute on the menu item `<li>`, useful for delegation.

```javascript
X('.item-row').context([
    { text: 'Edit',   action: 'edit' },
    { text: 'Delete', action: 'delete' },
    { text: 'Share',  action: 'share' },
]);
```

### Function Actions with Arguments

When `action` is a function, it receives `(item.args, rightClickedElement, originalEvent)`.

```javascript
X('.file').context([
    {
        text: 'Rename',
        action: (args, targetEl, originalEvent) => {
            const fileName = targetEl.dataset.name;
            const newName = prompt('New name:', fileName);
            if (newName) targetEl.dataset.name = newName;
        },
        args: { mode: 'inline' },
    },
    {
        text: 'Delete',
        action: (args, targetEl) => {
            if (confirm(`Delete ${targetEl.dataset.name}?`)) {
                targetEl.remove();
            }
        },
    },
]);
```

### Custom ID and Styling

```javascript
X('.workspace').context([
    { text: 'New File',   action: () => createFile() },
    { text: 'New Folder', action: () => createFolder() },
], {
    id: 'workspace-menu',
    className: 'dark-theme',
});

// Style it with CSS targeting:
// .dark-theme { background: #1e1e1e; }
// .dark-theme li label { color: #ccc; }
```

### How It Works

- The menu auto-positions to stay within the viewport.
- It closes on **outside click**, **Esc**, **window blur**, or **window resize**.
- Only one context menu exists at a time — opening a new one removes the previous.

---

## 11. Static Methods

Every instance method is also available as a static method where the **first argument is the selector**.

### Selection & Traversal

```javascript
X.first('.tab');                     // wrapped first .tab
X.last('.tab');                      // wrapped last .tab
X.i('.tab', 2);                     // wrapped third .tab
X.get('.tab', 0);                   // raw DOM element
X.find('.sidebar', '.link');         // find .link inside .sidebar
X.parent('.child');                  // parent of .child
X.closest('.nested', '.container');  // nearest .container ancestor
X.each('.item', (el, i) => { /* ... */ });
```

### Content & Attributes

```javascript
X.html('.content', '<p>New content</p>');
X.text('.label', 'Updated');
X.val('#email', 'user@example.com');
X.attr('a.external', 'target', '_blank');
X.removeAttr('a.external', 'rel');
X.data('.card', 'id', '42');
X.removeData('.card', 'id');
X.prop('#checkbox', 'checked', true);
X.removeProp('#checkbox', 'myFlag');
```

### DOM Manipulation

```javascript
X.append('#list', '<li>New item</li>');
X.prepend('#list', '<li>First item</li>');
X.before('.divider', '<h2>Title</h2>');
X.after('.divider', '<p>Content</p>');
X.empty('#container');
X.remove('.unwanted');
```

### Styling & Classes

```javascript
X.css('.box', 'background', '#333');
X.addClass('.nav', 'open');
X.removeClass('.nav', 'open');
X.toggleClass('.nav', 'open');
X.hasClass('.nav', 'open');     // true or false
X.is('.btn', '.primary');       // true or false
```

### Visibility & State

```javascript
X.hide('.ad');
X.show('.modal', 'flex');
X.toggle('.sidebar');
X.checked('#agree', true);
X.disabled('.btn', true);
```

### Events

```javascript
X.on('.btn', 'click', (e, el) => { /* ... */ });
X.once('.intro', 'click', (e, el) => { /* ... */ });
X.off('.btn', 'click');

// With delegation
X.on('.list', 'click', '.item', (e, matched) => { /* ... */ });

// Shorthands
X.onclick('.btn', (e, el) => { /* ... */ });
X.onchange('select', (e, el) => { /* ... */ });

// Custom events
X.trigger('.widget', 'refresh', { force: true });

// Context menu
X.context('.canvas', [
    { text: 'Edit', action: () => edit() },
]);
```

---

## 12. Real-World Recipes

### Accordion

```javascript
X('.accordion-header').onclick((e, el) => {
    const parent = X(el).parent();
    const body = parent.find('.accordion-body');

    // Close all other panels
    X('.accordion-body').hide();
    X('.accordion-header').removeClass('open');

    // Toggle this one
    body.toggle();
    X(el).toggleClass('open');
});
```

### Tab Switcher

```javascript
X('.tab-bar').on('click', '.tab', (e, tab) => {
    const target = X(tab).data('target'); // e.g. "panel-1"

    // Update tabs
    X('.tab').removeClass('active');
    X(tab).addClass('active');

    // Update panels
    X('.tab-panel').hide();
    X(`#${target}`).show();
});
```

### Todo List

```javascript
// Add a new item
X('#add-btn').onclick(() => {
    const text = X('#todo-input').val();
    if (!text) return;

    X('#todo-list').append(`
        <li class="todo-item">
            <span>${text}</span>
            <button class="delete-btn">✕</button>
        </li>
    `);

    X('#todo-input').val('');
});

// Toggle completed (delegated — works for items added later)
X('#todo-list').on('click', '.todo-item span', (e, span) => {
    X(span).parent().toggleClass('completed');
});

// Delete item (delegated)
X('#todo-list').on('click', '.delete-btn', (e, btn) => {
    X(btn).parent().remove();
});
```

### Form Validation

```javascript
X('#signup-form').on('submit', (e) => {
    e.preventDefault();

    const email = X('#email').val();
    const pass  = X('#password').val();

    // Reset
    X('.field').removeClass('error');
    X('.error-msg').remove();

    if (!email.includes('@')) {
        X('#email').parent().addClass('error');
        X('#email').after('<span class="error-msg">Invalid email</span>');
    }

    if (pass.length < 8) {
        X('#password').parent().addClass('error');
        X('#password').after('<span class="error-msg">Min 8 characters</span>');
    }
});
```

### Dynamic Table Row Context Menu

```javascript
X('table.data').context([
    {
        text: 'Edit Row',
        svg: '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>',
        action: (args, row) => {
            const id = row.dataset.id;
            openEditModal(id);
        },
    },
    {
        text: 'Delete Row',
        action: (args, row) => {
            if (confirm('Delete this row?')) {
                X(row).remove();
            }
        },
    },
    {
        text: 'Duplicate Row',
        action: (args, row) => {
            const clone = row.cloneNode(true);
            X(row).after(clone);
        },
    },
], { className: 'table-context-menu' });
```

### Lazy Image Loading via Intersection Observer

```javascript
// XenonJS wraps the selection, then native APIs do the rest
X('img[data-src]').each((img) => {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            X(img).attr('src', X(img).data('src'));
            X(img).removeData('src');
            X(img).addClass('loaded');
            observer.disconnect();
        }
    });
    observer.observe(img);
});
```

### Dark Mode Toggle

```javascript
X('#dark-mode-toggle').onclick(() => {
    X('body').toggleClass('dark');
    const isDark = X('body').hasClass('dark');
    X('#dark-mode-toggle').text(isDark ? '☀️ Light' : '🌙 Dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Restore on page load
if (localStorage.getItem('theme') === 'dark') {
    X('body').addClass('dark');
    X('#dark-mode-toggle').text('☀️ Light');
}
```

### Keyboard Shortcuts

```javascript
X(document).on('keydown', (e) => {
    // Ctrl+K → focus search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        X('#search-input').get().focus();
    }

    // Escape → close modal
    if (e.key === 'Escape') {
        X('.modal.open').removeClass('open').hide();
    }
});
```

---

That covers the full XenonJS API. Every method shown here works both as an instance method on a `X()` wrapper and as a static method on `X` itself.