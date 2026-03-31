




const EVENT_STORE = new WeakMap();




// Normalize class names from various input formats
// (string, array, etc.) into a flat array of class names.
// ─────────────────────────────────────
export function normalizeClasses(className) {
	if (Array.isArray(className)) {
		return className.flatMap(x => String(x).split(' ').filter(Boolean));
	}
	return String(className).split(' ').filter(Boolean);
}



// Resolve elements from various input formats
// (selector string, Element, NodeList, etc.)
// ─────────────────────────────────────
export function resolveElements(sel) {
	if (typeof sel === 'string') return [...document.querySelectorAll(sel)];
	if (sel instanceof Element) return [sel];
	if (Array.isArray(sel)) return sel.filter(el => el instanceof Element);
	if (sel instanceof NodeList) return [...sel].filter(el => el instanceof Element);
	return [];
}




// Get or create an event bucket for an element
// (used for storing event listeners and related data)
// ─────────────────────────────────────
export function getEventBucket(el) {
	let bucket = EVENT_STORE.get(el);
	if (!bucket) {
		bucket = new Map();
		EVENT_STORE.set(el, bucket);
	}
	return bucket;
}

// Normalize event options into a consistent string format
// (used for generating unique keys for event listeners)
// ─────────────────────────────────────
function normalizeEventOptions(options) {
	if (options === undefined) return '';
	if (typeof options === 'boolean') return JSON.stringify({ capture: options });
	return JSON.stringify({
		capture: !!options.capture,
		once: !!options.once,
		passive: !!options.passive,
	});
}


// Get a unique key for an event listener based on event type, selector, and options
// ─────────────────────────────────────
export function getEventKey(event, selector, options) {
	return `${event}::${selector ?? ''}::${normalizeEventOptions(options)}`;
}












