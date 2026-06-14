// cursor.ts - Interactive cursor aura/glow tracker utilizing Web Animations API
export function initCursorTracking() {
	if (typeof window === 'undefined') return;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Check if a cursor tracking element already exists
	let cursorGlow = document.getElementById('ctos-cursor-glow');
	if (!cursorGlow) {
		cursorGlow = document.createElement('div');
		cursorGlow.id = 'ctos-cursor-glow';
		cursorGlow.className = 'cursor-glow-pointer';
		document.body.appendChild(cursorGlow);
	}

	const cursor = cursorGlow;

	document.addEventListener('mousemove', (e) => {
		cursor.animate({
			left: `${e.clientX}px`,
			top: `${e.clientY}px`
		}, {
			duration: 250,
			easing: 'ease-out',
			fill: 'forwards'
		});
	}, { passive: true });
}
