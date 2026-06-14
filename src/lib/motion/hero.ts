// hero.ts - Hero system node map animations
export function initHeroAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Centralize any manual canvas, node, or grid entrance animations
	const heroContainer = document.querySelector('.hero-system-container');
	if (heroContainer) {
		heroContainer.animate([
			{ opacity: 0, transform: 'scale(0.98)' },
			{ opacity: 1, transform: 'scale(1)' }
		], {
			duration: 800,
			easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
			fill: 'forwards'
		});
	}
}
