





let menuState = 0;


// MARK: Context Menu
// ────────────────────────────────────
export default function contextMenu(ev, items, options){
	document.getElementById('x-context-menu')?.remove();
	menuState = 0;

	let selectedItem = ev.currentTarget;

	let menu = createMenu( items )
	let onDocClick, onKeyUp, onResize;

	toggleMenuOn();



	// Close Context Menu when outside of menu clicked
	onDocClick = (e) => {
		if (!menu.contains(e.target)) {
			toggleMenuOff();
		}
	};

	// Close Context Menu on Esc key press
	onKeyUp = (e) => {
		if (e.key === 'Escape') {
			toggleMenuOff();
		}
	};

	document.addEventListener('click', onDocClick);
	window.addEventListener('keyup', onKeyUp);
	let onBlur = () => toggleMenuOff();
	window.addEventListener('blur', onBlur);


	
	// Turns the custom context menu on.
	function toggleMenuOn() {
		if (menuState === 1) return;

		menuState = 1;
		document.body.appendChild(menu);

		onResize = () => toggleMenuOff();
		window.addEventListener('resize', onResize);

		requestAnimationFrame(() => positionMenu(ev));
	}

	// Turns the custom context menu off.
	function toggleMenuOff() {
		if (menuState !== 0) {
			menuState = 0;
			menu.remove()
				
			if (onDocClick) {
				document.removeEventListener('click', onDocClick);
				onDocClick = null;
			}

			if (onKeyUp) {
				window.removeEventListener('keyup', onKeyUp);
				onKeyUp = null;
			}

			if (onResize) {
				window.removeEventListener('resize', onResize);
				onResize = null;
			}

			if (onBlur) {
				window.removeEventListener('blur', onBlur);
				onBlur = null;
			}

		}
	}

	// Get the position of the right click in window and returns the X and Y coordinates
	function getPosition(e) {
		return {
			x: e.clientX,
			y: e.clientY
		};
	}

	// Position the Context Menu in right position.
	function positionMenu(e) {
		const { x, y } = getPosition(e);

		const menuWidth = menu.offsetWidth;
		const menuHeight = menu.offsetHeight;

		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const margin = 4;

		let left = x;
		let top = y;

		if (left + menuWidth + margin > viewportWidth) {
			left = viewportWidth - menuWidth - margin;
		}

		if (top + menuHeight + margin > viewportHeight) {
			top = viewportHeight - menuHeight - margin;
		}

		left = Math.max(margin, left);
		top = Math.max(margin, top);

		menu.style.left = `${left}px`;
		menu.style.top = `${top}px`;
	}




	// MARK: Create Menu
	// ─────────────────────────
	function createMenu( items ){

		contextMenuStyles()

		let menu = document.createElement('div');
		menu.id = options?.id || 'x-context-menu';
		menu.className = 'x-context-menu';
		if ( options?.className ) menu.classList.add( options.className );

		let ul = document.createElement('ul');
		menu.appendChild(ul);

		items.forEach((item,i) => {
			let li = document.createElement('li');
			li.setAttribute('data-id', selectedItem.dataset.id || '' );
			li.setAttribute('data-idx', i);
			if (typeof item.action === 'string') {
				li.setAttribute('data-context-action', item.action);
			}
			ul.appendChild(li);


			li.addEventListener('click', e => {
				e.stopPropagation();
				let idx = e.currentTarget.getAttribute('data-idx');
				const item = items[idx] || {}
				
				if ( typeof item.action === 'function' )
					item.action(
						item.args || {},
						selectedItem,
						ev,
					);
					toggleMenuOff();
			})

			if (item.svg) {
				li.innerHTML = item.svg;
			}
			if (item.icon) {
				let img = document.createElement('img');
				img.src = item.icon;
				li.appendChild(img);
			}

			let label = document.createElement('label');
			label.textContent = item.text || item.name || item.title || item.label || '';
			li.appendChild(label);
		});


		return menu;

	}



}






function contextMenuStyles() {

	// check if the styles are already added
	let exists = document.getElementById('x-context-menu-styles');
	if (exists) return;


	let styleSheet = document.createElement("style");
	styleSheet.id = 'x-context-menu-styles';
	styleSheet.innerText = `
		.x-context-menu {
			position: fixed;
			background: white;
			border: 1px solid #ccc;
			box-shadow: 2px 2px 5px #999;
			padding: 8px 0;
			margin: 0;
			z-index: 1000;
		}
		.x-context-menu ul {
			padding: 0;
			margin: 0;
		}
		.x-context-menu ul li {
			display: flex;
			align-items: center;
			list-style: none;
			padding: 0 8px;
			margin: 0;
			font-size: 15px;
			cursor: pointer;
		}
		.x-context-menu ul li label {
			display: block;
			padding: 6px 8px;
			text-decoration: none;
			color: black;
			cursor: pointer;
		}
		.x-context-menu ul li:hover {
			background-color: #f0f0f0;
		}
		.x-context-menu ul li svg {
			width: 20px;
			height: 20px;
			margin: 0 2px 0 8px;
			fill: hsla(0, 0%, 0%, 0.5);
		}
		.x-context-menu ul li .svg-stroke {
			fill: transparent;
			stroke: hsla(0, 0%, 0%, 0.5);
		}
	`;
	document.head.appendChild(styleSheet);

}
