// cursor.ts - Contextual cursor system with glow tracker and label states
// Desktop only — disabled on touch devices

const EASING = 'ease-out';

// ─── Cursor label state map ───────────────────────────────────────────────────
const CURSOR_LABELS: Record<string, string> = {
	'explore': 'Explore',
	'open': 'Open',
	'view-project': 'View Project',
	'view-case-study': 'View Case Study',
	'download-resume': 'Download',
	'read-note': 'Read Note',
	'view-cert': 'View Certificate',
	'send': 'Send',
};

// ─── Init cursor tracking + label states ─────────────────────────────────────
export function initCursorTracking() {
	if (typeof window === 'undefined') return;
	if ('ontouchstart' in window) return; // mobile: disable entirely
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Create or reuse cursor element
	let cursor = document.getElementById('ctos-cursor-glow');
	if (!cursor) {
		cursor = document.createElement('div');
		cursor.id = 'ctos-cursor-glow';
		cursor.className = 'cursor-glow-pointer';
		document.body.appendChild(cursor);
	}

	// Create label element inside cursor
	let label = cursor.querySelector('.cursor-label') as HTMLElement | null;
	if (!label) {
		label = document.createElement('span');
		label.className = 'cursor-label';
		cursor.appendChild(label);
	}

	const cursorEl = cursor;
	const labelEl = label;

	// ─── Mouse tracking ─────────────────────────────────────────────────────
	document.addEventListener('mousemove', (e) => {
		cursorEl.animate({
			left: `${e.clientX}px`,
			top: `${e.clientY}px`
		}, { duration: 250, easing: EASING, fill: 'forwards' });
	}, { passive: true });

	// ─── Label state binding ─────────────────────────────────────────────────
	const updateLabel = (text: string) => {
		if (text) {
			labelEl.textContent = text;
			labelEl.style.opacity = '1';
			labelEl.style.transform = 'translateY(0)';
			cursorEl.classList.add('cursor-active');
		} else {
			labelEl.style.opacity = '0';
			labelEl.style.transform = 'translateY(4px)';
			cursorEl.classList.remove('cursor-active');
		}
	};

	document.addEventListener('mouseover', (e) => {
		const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
		if (target) {
			const state = target.dataset.cursor || '';
			updateLabel(CURSOR_LABELS[state] || '');
		} else {
			updateLabel('');
		}
	});

	document.addEventListener('mouseout', (e) => {
		const target = (e.target as HTMLElement).closest('[data-cursor]') as HTMLElement | null;
		if (target) updateLabel('');
	});

	// ─── Click burst ─────────────────────────────────────────────────────────
	document.addEventListener('click', () => {
		cursorEl.animate([
			{ transform: 'translate(-50%, -50%) scale(1)' },
			{ transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0.6 },
			{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }
		], { duration: 300, easing: 'ease-out' });
	});
}
