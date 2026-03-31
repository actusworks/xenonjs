# X.bus — Event Bus Plugin

A lightweight, namespaced event bus that extends XenonJS with decoupled pub/sub messaging. Supports wildcard listeners, async pipelines, one-time subscriptions, and convenient unsubscribe handles.

## Setup

Import the plugin once — it attaches itself to `X.bus` automatically:

```javascript
import 'xenonjs/src/services/bus.js';
// or, if you need a direct reference:
import bus from 'xenonjs/src/services/bus.js';
```

After import, `X.bus` is available globally wherever you import `X`.

---

## API

### `on(event, callback)` — Subscribe

Register a listener for an event. Returns an **unsubscribe function**.

```javascript
const unsub = X.bus.on('user:login', (data) => {
    console.log('Logged in:', data.name);
});

// Later — clean up with the returned handle
unsub();
```

### `once(event, callback)` — Subscribe Once

Like `on()`, but the listener fires exactly once and then removes itself.

```javascript
X.bus.once('app:ready', (config) => {
    console.log('App initialized with:', config);
});
```

The returned unsubscribe function works here too, in case you need to cancel before it fires.

### `off(event?, callback?)` — Unsubscribe

Flexible removal at three granularity levels:

```javascript
const handler = (data) => { /* ... */ };
X.bus.on('order:created', handler);

// Remove a specific callback from an event
X.bus.off('order:created', handler);

// Remove ALL listeners for an event
X.bus.off('order:created');

// Remove ALL listeners for ALL events (full reset)
X.bus.off();
```

`off()` also correctly removes `once()` wrappers when you pass the original callback.

### `emit(event, value, ...args)` — Publish (async pipeline)

Emit an event, passing a value through all listeners as a **sequential pipeline**. Each listener receives the return value of the previous one. Async listeners (`Promise`) are awaited automatically.

```javascript
// Single value
X.bus.on('cart:total', (total) => {
    return total * 1.1; // add 10% tax
});

X.bus.on('cart:total', (total) => {
    return Math.round(total * 100) / 100; // round
});

const final = await X.bus.emit('cart:total', 100);
console.log(final); // 110
```

Listeners receive: `(currentValue, ...extraArgs, eventName)`.

```javascript
X.bus.on('transform', (value, multiplier, eventName) => {
    console.log(`Event "${eventName}" fired`);
    return value * multiplier;
});

await X.bus.emit('transform', 5, 3); // 15
```

If any listener throws, the error is logged and re-thrown — the pipeline stops.

### `has(event, callback?)` — Check Existence

```javascript
X.bus.has('user:login');          // true if any listeners exist
X.bus.has('user:login', handler); // true if this specific handler is registered
```

Also detects `once()` wrappers by original callback reference.

### `listeners(event)` — Get All Listeners

Returns an array of all registered callbacks for an event.

```javascript
const fns = X.bus.listeners('user:login');
console.log(`${fns.length} listeners registered`);
```

### `listenerCount(event?)` — Count Listeners

```javascript
X.bus.listenerCount('user:login'); // count for one event
X.bus.listenerCount();             // total across ALL events
```

### `eventNames()` — List All Events

```javascript
const names = X.bus.eventNames();
// e.g. ['user:login', 'user:logout', 'cart:*']
```

### `clear(event?)` — Clean Up

```javascript
X.bus.clear('user:login'); // remove all listeners for this event
X.bus.clear();             // remove everything
```

### `collect(event)` — Gather Listeners

Returns all listeners that would fire for a given event, including wildcard matches — without actually calling them.

```javascript
const fns = X.bus.collect('email:new:important');
// Includes listeners on: 'email:new:important', 'email:new:*', 'email:*', '*'
```

---

## Wildcard / Namespace Events

Events use `:` as a namespace separator. When you emit an event, the bus also notifies listeners registered with wildcard patterns:

| Emitted Event | Also Notifies |
|---|---|
| `email:new` | `email:*`, `*` |
| `email:new:important` | `email:new:*`, `email:*`, `*` |
| `app:module:loaded` | `app:module:*`, `app:*`, `*` |

### Example

```javascript
// Catch-all for every event in the system
X.bus.on('*', (value) => {
    console.log('[bus] something happened');
    return value;
});

// Catch all email events
X.bus.on('email:*', (value) => {
    console.log('[bus] email event');
    return value;
});

// Specific event
X.bus.on('email:new', (value) => {
    console.log('[bus] new email');
    return value;
});

await X.bus.emit('email:new', { subject: 'Hello' });
// Logs:
//   [bus] new email
//   [bus] email event
//   [bus] something happened
```

---

## Patterns & Recipes

### Module Communication

Decouple modules that don't know about each other:

```javascript
// notifications.js
X.bus.on('user:login', (user) => {
    showWelcome(user.name);
    return user;
});

// analytics.js
X.bus.on('user:login', (user) => {
    trackEvent('login', { id: user.id });
    return user;
});

// auth.js
await X.bus.emit('user:login', { id: 1, name: 'Ada' });
```

### Middleware Pipeline

Use `emit()` as a transform pipeline — each handler refines the data:

```javascript
// Validate
X.bus.on('form:submit', (data) => {
    if (!data.email) throw new Error('Email required');
    return data;
});

// Sanitize
X.bus.on('form:submit', (data) => {
    return { ...data, email: data.email.trim().toLowerCase() };
});

// Save
X.bus.on('form:submit', async (data) => {
    await api.save(data);
    return data;
});

try {
    const result = await X.bus.emit('form:submit', formData);
    console.log('Saved:', result);
} catch (err) {
    console.error('Pipeline failed:', err.message);
}
```

### Temporary Listeners with Auto-Cleanup

```javascript
function initFeature() {
    const unsubs = [
        X.bus.on('data:refresh', reload),
        X.bus.on('ui:resize', layout),
        X.bus.on('config:change', reconfigure),
    ];

    // Tear down everything when the feature is destroyed
    return () => unsubs.forEach(fn => fn());
}

const destroy = initFeature();
// ...later
destroy(); // all three listeners removed
```

### Debugging Active Listeners

```javascript
console.log('Active events:', X.bus.eventNames());
console.log('Total listeners:', X.bus.listenerCount());
console.log('Login listeners:', X.bus.listenerCount('user:login'));
console.log('Would fire for "email:new:vip":', X.bus.collect('email:new:vip'));
```

---

## Error Handling

- `on()` and `once()` throw a `TypeError` if `event` is not a non-empty string or `callback` is not a function.
- `emit()` validates the event name. If a listener throws, the error is logged to `console.error` and re-thrown — halting the pipeline.
- All other methods (`off`, `has`, `clear`, etc.) fail silently with safe no-ops when given non-existent events.