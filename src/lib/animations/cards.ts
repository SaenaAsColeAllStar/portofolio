// cards.ts - Card Hover interactions utilizing Web Animations API
export function initCardAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const cards = document.querySelectorAll('.card, [data-animate="card-hover"]');
	cards.forEach(card => {
		const el = card as HTMLElement;
		
		el.addEventListener('mouseenter', () => {
			el.animate([
				{ transform: 'translateY(0) scale(1)' },
				{ transform: 'translateY(-4px) scale(1.005)' }
			], {
				duration: 220,
				easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
				fill: 'forwards'
			});
		});

		el.addEventListener('mouseleave', () => {
			el.animate([
				{ transform: 'translateY(-4px) scale(1.005)' },
				{ transform: 'translateY(0) scale(1)' }
			], {
				duration: 220,
				easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
				fill: 'forwards'
			});
		});
	});
}
