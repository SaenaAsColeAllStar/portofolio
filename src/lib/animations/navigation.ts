// navigation.ts - Navigation Hover interactions utilizing Web Animations API
export function initNavigationAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const navItems = document.querySelectorAll('.internal-links a, .nav-item');
	navItems.forEach(item => {
		const el = item as HTMLElement;
		
		el.addEventListener('mouseenter', () => {
			el.animate([
				{ transform: 'scale(1)' },
				{ transform: 'scale(1.02)' }
			], {
				duration: 120,
				easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
				fill: 'forwards'
			});
		});

		el.addEventListener('mouseleave', () => {
			el.animate([
				{ transform: 'scale(1.02)' },
				{ transform: 'scale(1)' }
			], {
				duration: 120,
				easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
				fill: 'forwards'
			});
		});
	});
}
