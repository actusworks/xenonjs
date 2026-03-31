import X from './index.js';

if (!X.bus) {
	class EventBus {
		constructor() {
			this.events = new Map();
		}



		// MARK: ON
		// ─────────────────────────────────────
		on(event, callback) {
			this.#validateEvent(event, 'on');
			this.#validateCallback(callback, 'on');

			if (!this.events.has(event)) {
				this.events.set(event, new Set());
			}

			this.events.get(event).add(callback);

			// convenient unsubscribe
			return () => this.off(event, callback);
		}



		// MARK: ONCE
		// ─────────────────────────────────────
		once(event, callback) {
			this.#validateEvent(event, 'once');
			this.#validateCallback(callback, 'once');

			const wrapper = (...args) => {
				this.off(event, wrapper);
				callback(...args);
			};

			wrapper._original = callback;

			if (!this.events.has(event)) {
				this.events.set(event, new Set());
			}

			this.events.get(event).add(wrapper);

			return () => this.off(event, wrapper);
		}



		// MARK: OFF
		// ─────────────────────────────────────
		off(event, callback) {
			// off() => clear everything
			if (event == null) {
				this.events.clear();
				return this;
			}

			const set = this.events.get(event);
			if (!set) return this;

			// off('event') => clear whole event
			if (callback == null) {
				this.events.delete(event);
				return this;
			}

			for (const fn of set) {
				if (fn === callback || fn._original === callback) {
					set.delete(fn);
				}
			}

			if (set.size === 0) {
				this.events.delete(event);
			}

			return this;
		}



		// MARK: EMIT
		// ─────────────────────────────────────
		async emit(event, value, ...args) {
			this.#validateEvent(event, 'emit');

			const calls = [];

			// exact
			this.#collectListeners(event, calls);

			// wildcards
			const wildcardPatterns = this.#getWildcardPatterns(event);
			for (const pattern of wildcardPatterns) {
				this.#collectListeners(pattern, calls);
			}

			if (calls.length === 0) return value;

			const unique = [...new Set(calls)];

			let current = value;

			for (const fn of unique) {
				try {
					const res = fn(current, ...args, event);
					const resolved = res instanceof Promise ? await res : res;
					if (resolved !== undefined) current = resolved;
				} catch (err) {
					console.error(`X.bus.emit error in "${event}":`, err);
					throw err;
				}
			}

			return current;
		}



		// MARK: HAS
		// ─────────────────────────────────────
		has(event, callback) {
			const set = this.events.get(event);
			if (!set) return false;

			if (callback == null) return set.size > 0;

			for (const fn of set) {
				if (fn === callback || fn._original === callback) {
					return true;
				}
			}

			return false;
		}



		// MARK: LISTENERS
		// ─────────────────────────────────────
		listeners(event) {
			const set = this.events.get(event);
			return set ? [...set] : [];
		}



		// MARK: LISTENER COUNT
		// ─────────────────────────────────────
		listenerCount(event) {
			if (event == null) {
				let total = 0;
				for (const set of this.events.values()) {
					total += set.size;
				}
				return total;
			}

			return this.events.get(event)?.size || 0;
		}



		// MARK: CLEAR
		// ─────────────────────────────────────
		clear(event) {
			if (event == null) {
				this.events.clear();
			} else {
				this.events.delete(event);
			}
			return this;
		}



		// MARK: EVENT NAMES
		// ─────────────────────────────────────
		eventNames() {
			return [...this.events.keys()];
		}



		// MARK: COLLECT
		// ─────────────────────────────────────
		collect(event) {
			this.#validateEvent(event, 'collect');

			const calls = [];
			this.#collectListeners(event, calls);

			const wildcardPatterns = this.#getWildcardPatterns(event);
			for (const pattern of wildcardPatterns) {
				this.#collectListeners(pattern, calls);
			}

			return [...new Set(calls)];
		}









		// MARK: PRIVATE METHODS


		// ─────────────────────────────────────
		#collectListeners(event, output) {
			const set = this.events.get(event);
			if (!set) return;
			for (const fn of set) {
				output.push(fn);
			}
		}

		// ─────────────────────────────────────
		#getWildcardPatterns(event) {
			const parts = event.split(':');
			const patterns = ['*'];

			// email:new:important
			// -> email:new:*
			// -> email:*
			for (let i = parts.length - 1; i > 0; i--) {
				patterns.push(parts.slice(0, i).join(':') + ':*');
			}

			return patterns;
		}

		// ─────────────────────────────────────
		#validateEvent(event, method) {
			if (typeof event !== 'string' || !event.trim()) {
				throw new TypeError(`X.bus.${method}: event must be a non-empty string`);
			}
		}

		// ─────────────────────────────────────
		#validateCallback(callback, method) {
			if (typeof callback !== 'function') {
				throw new TypeError(`X.bus.${method}: callback must be a function`);
			}
		}


	}

	X.bus = new EventBus();
}

export default X.bus;