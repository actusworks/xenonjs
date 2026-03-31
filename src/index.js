import * as UT  		from './services/util'
import contextMenu		from './services/context'
// ════════════════════════════════════════════════════






// MARK: Wrapper
// ════════════════════════════════════════
class Wrapper {
	constructor(sel) {
		this.elements = UT.resolveElements(sel);
	}




	// MARK: SELECTION & TRAVERSAL


	// ─────────────────────────────────────
	i(idx) {
		return new Wrapper(this.elements[idx] ? [this.elements[idx]] : []);
	}

	// ─────────────────────────────────────
	first() {
		return new Wrapper(this.elements[0] ? [this.elements[0]] : []);
	}

	// ─────────────────────────────────────
	last() {
		const el = this.elements[this.elements.length - 1];
		return new Wrapper(el ? [el] : []);
	}

	// ─────────────────────────────────────
	each(callback) {
		this.elements.forEach((el, i) => callback(el, i));
		return this;
	}
		
	// ─────────────────────────────────────
	get(idx = 0) {
		return this.elements[idx];
	}

	// ─────────────────────────────────────
	length() {
		return this.elements.length;
	}




	// MARK: EVENTS


	// ─────────────────────────────────────
	on(event, selector, callback, options) {
		if (typeof selector === 'function') {
			options = callback;
			callback = selector;
			selector = null;
		}

		this.elements.forEach(el => {
			const bucket = UT.getEventBucket(el);
			const key = UT.getEventKey(event, selector, options);

			if (!bucket.has(key)) bucket.set(key, []);
			const handlers = bucket.get(key);

			// avoid duplicate registration of same callback for same event+selector+options
			if (handlers.some(h => h.callback === callback)) return;

			const wrapped = selector
				? (e) => {
					const matched = e.target?.closest?.(selector);
					if (matched && el.contains(matched)) {
						callback(e, matched);
					}
				}
				: (e) => callback(e, el);

			handlers.push({ callback, wrapped });
			el.addEventListener(event, wrapped, options);
		});

		return this;
	}


	// ─────────────────────────────────────
	once(event, selector, callback, options) {
		if (typeof selector === 'function') {
			options = callback;
			callback = selector;
			selector = null;
		}

		const onceOptions = typeof options === 'boolean'
			? { capture: options, once: true }
			: { ...(options || {}), once: true };

		return this.on(event, selector, callback, onceOptions);
	}


	// ─────────────────────────────────────
	off(event, selector, callback, options) {
		if (typeof selector === 'function') {
			options = callback;
			callback = selector;
			selector = null;
		}

		this.elements.forEach(el => {
			const bucket = UT.getEventBucket(el);
			if (!bucket) return;

			// off() -> remove all listeners registered through Xenon on this element
			if (event == null) {
				for (const [key, handlers] of bucket.entries()) {
					const eventName = key.split('::')[0];
					handlers.forEach(h => el.removeEventListener(eventName, h.wrapped));
				}
				bucket.clear();
				return;
			}

			const key = UT.getEventKey(event, selector, options);
			const handlers = bucket.get(key);
			if (!handlers?.length) return;

			// off('click') / off('click', '.item')
			if (!callback) {
				handlers.forEach(h => el.removeEventListener(event, h.wrapped, options));
				bucket.delete(key);
				return;
			}

			// off('click', handler) / off('click', '.item', handler)
			for (let i = handlers.length - 1; i >= 0; i--) {
				const h = handlers[i];
				if (h.callback === callback) {
					el.removeEventListener(event, h.wrapped, options);
					handlers.splice(i, 1);
				}
			}

			if (handlers.length === 0) bucket.delete(key);
		});

		return this;
	}


	// ─────────────────────────────────────
	onclick(callback, options) {
		return this.on('click', callback, options);
	}


	// ─────────────────────────────────────
	onchange(callback, options) {
		return this.on('change', callback, options);
	}
	
	
	// ─────────────────────────────────────
	trigger(eventName, detail) {
		this.elements.forEach(el => {
			el.dispatchEvent(new CustomEvent(eventName, {
				bubbles: true,
				cancelable: true,
				detail
			}));
		});
		return this;
	}


	// ─────────────────────────────────────
	contextMenu(items, options) { return context(items, options); }
	contextmenu(items, options) { return context(items, options); }
	context(items, options = {}) {
		return this.on('contextmenu', (e, el) => {
			e.preventDefault();
			contextMenu(e, items, options);
		});
	}




	
	// MARK: DOM MANIPULATION

	// ─────────────────────────────────────
	append(item) {
		this.elements.forEach(el => {
			if (typeof item === 'string') {
				el.insertAdjacentHTML('beforeend', item);
			} else if (item instanceof Element) {
				el.appendChild(item);
			}
		});
		return this;
	}

	// ─────────────────────────────────────
	prepend(item) {
		this.elements.forEach(el => {
			if (typeof item === 'string') {
				el.insertAdjacentHTML('afterbegin', item);
			} else if (item instanceof Element) {
				el.prepend(item);
			}
		});
		return this;
	}

	// ─────────────────────────────────────
	before(item) {
		this.elements.forEach(el => {
			if (typeof item === 'string') {
				el.insertAdjacentHTML('beforebegin', item);
			} else if (item instanceof Element) {
				el.before(item);
			}
		});
		return this;
	}

	// ─────────────────────────────────────
	after(item) {
		this.elements.forEach(el => {
			if (typeof item === 'string') {
				el.insertAdjacentHTML('afterend', item);
			} else if (item instanceof Element) {
				el.after(item);
			}
		});
		return this;
	}

	// ─────────────────────────────────────
	empty() {
		this.elements.forEach(el => { el.innerHTML = ''; });
		return this;
	}


	// ─────────────────────────────────────
	remove() {
		this.elements.forEach(el => {
			el.parentNode?.removeChild(el);
		});
		return this;
	}

	// ─────────────────────────────────────
	find(sel) {
		const found = [];
		this.elements.forEach(el => {
			found.push(...el.querySelectorAll(sel));
		});
		return new Wrapper(found);
	}

	// ─────────────────────────────────────
	parent() {
		const parents = this.elements
			.map(el => el.parentElement)
			.filter(Boolean);
		return new Wrapper([...new Set(parents)]);
	}

	// ─────────────────────────────────────
	closest(sel) {
		const matched = this.elements
			.map(el => el.closest(sel))
			.filter(Boolean);
		return new Wrapper([...new Set(matched)]);
	}




	// MARK: ATTRIBUTES & PROPERTIES
	
	// ─────────────────────────────────────
	html(value) {
		if (value === undefined) return this.elements[0]?.innerHTML ?? '';
		this.elements.forEach(el => { el.innerHTML = value; });
		return this;
	}

	// ─────────────────────────────────────
	text(value) {
		if (value === undefined) return this.elements[0]?.textContent ?? '';
		this.elements.forEach(el => { el.textContent = value; });
		return this;
	}

	// ─────────────────────────────────────
	val(value) {
		if (value === undefined) return this.elements[0]?.value;
		this.elements.forEach(el => { el.value = value; });
		return this;
	}

	// ─────────────────────────────────────
	attr(name, value) {
		if (value === undefined) return this.elements[0]?.getAttribute(name);
		this.elements.forEach(el => el.setAttribute(name, value));
		return this;
	}

	// ─────────────────────────────────────
	removeAttr(name) {
		this.elements.forEach(el => el.removeAttribute(name));
		return this;
	}

	// ─────────────────────────────────────
	data(name, value) {
		if (value === undefined) return this.elements[0]?.dataset?.[name];
		this.elements.forEach(el => { if (el.dataset) el.dataset[name] = value; });
		return this;
	}

	// ─────────────────────────────────────
	removeData(name) {
		this.elements.forEach(el => { if (el.dataset) delete el.dataset[name]; });
		return this;
	}

	// ─────────────────────────────────────
	prop(name, value) {
		if (value === undefined) return this.elements[0]?.[name];
		this.elements.forEach(el => { el[name] = value; });
		return this;
	}

	// ─────────────────────────────────────
	removeProp(name) {
		this.elements.forEach(el => { delete el[name]; });
		return this;
	}

	// ─────────────────────────────────────
	css(prop, value) {
		if (typeof prop === 'string' && value === undefined) {
			const el = this.elements[0];
			return el ? getComputedStyle(el)[prop] : undefined;
		}

		this.elements.forEach(el => {
			if (typeof prop === 'string') {
				el.style[prop] = value;
			} else if (prop && typeof prop === 'object') {
				for (const [k, v] of Object.entries(prop)) {
					el.style[k] = v;
				}
			}
		});
		return this;
	}

		


	// MARK: CLASSES


	// ─────────────────────────────────────
	addclass(className) { return this.addClass(className); }
	addClass(className) {
		const classes = UT.normalizeClasses(className);
		this.elements.forEach(el => el.classList.add(...classes));
		return this;
	}

	
	// ─────────────────────────────────────
	removeclass(className) { return this.removeClass(className); }
	removeClass(className) {
		const classes = UT.normalizeClasses(className);
		this.elements.forEach(el => el.classList.remove(...classes));
		return this;
	}


	// ─────────────────────────────────────
	toggleclass(className, force) { return this.toggleClass(className, force); }
	toggleClass(className, force) {
		const classes = UT.normalizeClasses(className);
		this.elements.forEach(el => {
			classes.forEach(cls => el.classList.toggle(cls, force));
		});
		return this;
	}

	// ─────────────────────────────────────
	hasclass(className) { return this.hasClass(className); }
	hasClass(className) {
		const el = this.elements[0];
		if (!el) return false;
		return UT.normalizeClasses(className).every(cls => el.classList.contains(cls));
	}

	// ─────────────────────────────────────
	is(sel) {
		const el = this.elements[0];
		if (!el) return false;
		return el.matches(sel);
	}





	// MARK: VISIBILITY

	// ─────────────────────────────────────
	hide() {
		this.elements.forEach(el => { el.style.display = 'none'; });
		return this;
	}

	// ─────────────────────────────────────
	show(display = '') {
		this.elements.forEach(el => { el.style.display = display; });
		return this;
	}

	// ─────────────────────────────────────
	toggle(force) {
		this.elements.forEach(el => {
			const hidden = getComputedStyle(el).display === 'none';
			const shouldShow = force ?? hidden;
			el.style.display = shouldShow ? '' : 'none';
		});
		return this;
	}




	// MARK: STATE


	// ─────────────────────────────────────
	checked(value) {
		if (value === undefined) return !!this.elements[0]?.checked;
		this.elements.forEach(el => { el.checked = !!value; });
		return this;
	}

	// ─────────────────────────────────────
	disabled(value) {
		if (value === undefined) return !!this.elements[0]?.disabled;
		this.elements.forEach(el => { el.disabled = !!value; });
		return this;
	}




}











// ════════════════════════════════════════
function X(sel) {
	return new Wrapper(sel);
}



X.Wrapper = Wrapper;



// MARK: Static API

X.i = (sel, idx) => X(sel).i(idx);
X.first = sel => X(sel).first();
X.last = sel => X(sel).last();
X.each = (sel, callback) => X(sel).each(callback);
X.get = (sel, idx = 0) => X(sel).get(idx);
//X.length = sel => X(sel).length();
X.find = (sel, subsel) => X(sel).find(subsel);
X.parent = sel => X(sel).parent();
X.closest = (sel, parentSel) => X(sel).closest(parentSel);

X.html = (sel, value) => X(sel).html(value);
X.text = (sel, value) => X(sel).text(value);
X.val = (sel, value) => X(sel).val(value);
X.attr = (sel, name, value) => X(sel).attr(name, value);
X.removeAttr = (sel, name) => X(sel).removeAttr(name);
X.data = (sel, name, value) => X(sel).data(name, value);
X.removeData = (sel, name) => X(sel).removeData(name);
X.prop = (sel, name, value) => X(sel).prop(name, value);
X.removeProp = (sel, name) => X(sel).removeProp(name);
X.css = (sel, prop, value) => X(sel).css(prop, value);

X.append = (sel, item) => X(sel).append(item);
X.remove = sel => X(sel).remove();
X.prepend = (sel, item) => X(sel).prepend(item);
X.before = (sel, item) => X(sel).before(item);
X.after = (sel, item) => X(sel).after(item);
X.empty = sel => X(sel).empty();

X.trigger = (sel, eventName, detail) => X(sel).trigger(eventName, detail);

X.addclass = (sel, className) => X(sel).addclass(className);
X.removeclass = (sel, className) => X(sel).removeclass(className);
X.toggleclass = (sel, className, force) => X(sel).toggleclass(className, force);
X.hasclass = (sel, className) => X(sel).hasclass(className);

X.addClass = (sel, className) => X(sel).addClass(className);
X.removeClass = (sel, className) => X(sel).removeClass(className);
X.toggleClass = (sel, className, force) => X(sel).toggleClass(className, force);
X.hasClass = (sel, className) => X(sel).hasClass(className);
X.is = (sel, testSel) => X(sel).is(testSel);

X.hide = sel => X(sel).hide();
X.show = (sel, display = '') => X(sel).show(display);
X.toggle = (sel, force) => X(sel).toggle(force);

X.checked = (sel, value) => X(sel).checked(value);
X.disabled = (sel, value) => X(sel).disabled(value);

X.onclick = (sel, callback) => X(sel).onclick(callback);
X.onchange = (sel, callback) => X(sel).onchange(callback);
X.on = (sel, event, selector, callback, options) => {
	if (typeof selector === 'function') {
		options = callback;
		callback = selector;
		selector = null;
	}
	return X(sel).on(event, selector, callback, options);
};
X.off = (sel, event, selector, callback, options) => {
	if (typeof selector === 'function') {
		options = callback;
		callback = selector;
		selector = null;
	}
	return X(sel).off(event, selector, callback, options);
};
X.once = (sel, event, selector, callback, options) => {
	if (typeof selector === 'function') {
		options = callback;
		callback = selector;
		selector = null;
	}
	return X(sel).once(event, selector, callback, options);
};
X.context = (sel, items, options = {}) => X(sel).context(items, options);
X.contextmenu = (sel, items, options = {}) => X(sel).context(items, options);
X.contextMenu = (sel, items, options = {}) => X(sel).context(items, options);



export default X;
