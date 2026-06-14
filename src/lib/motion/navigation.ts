// navigation.ts - Navigation hover + scroll hide/reveal behavior
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Nav item hover ───────────────────────────────────────────────────────────
export function initNavigationAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const navItems = document.querySelectorAll('.internal-links a, .nav-item');
	navItems.forEach(item => {
		const el = item as HTMLElement;

		el.addEventListener('mouseenter', () => {
			el.animate([
				{ transform: 'scale(1)' },
				{ transform: 'scale(1.02)' }
			], { duration: 120, easing: EASING, fill: 'forwards' });
		});

		el.addEventListener('mouseleave', () => {
			el.animate([
				{ transform: 'scale(1.02)' },
				{ transform: 'scale(1)' }
			], { duration: 120, easing: EASING, fill: 'forwards' });
		});
	});
}

// ─── Nav scroll hide / reveal ─────────────────────────────────────────────────
export function initNavScrollBehavior() {
	const header = document.querySelector('header') as HTMLElement | null;
	if (!header) return;

	let lastScrollY = window.scrollY;
	let ticking = false;
	let hidden = false;

	const THRESHOLD = 60; // px before we start hiding

	const update = () => {
		const currentY = window.scrollY;
		const delta = currentY - lastScrollY;

		if (currentY < THRESHOLD) {
			// Always visible near top
			if (hidden) {
				header.style.transform = 'translateY(0)';
				header.style.opacity = '1';
				hidden = false;
			}
		} else if (delta > 4 && !hidden) {
			// Scrolling down — hide
			header.style.transform = 'translateY(-100%)';
			header.style.opacity = '0';
			hidden = true;
		} else if (delta < -4 && hidden) {
			// Scrolling up — reveal
			header.style.transform = 'translateY(0)';
			header.style.opacity = '1';
			hidden = false;
		}

		lastScrollY = currentY;
		ticking = false;
	};

	// Apply smooth transition via inline style once
	header.style.transition = 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)';

	window.addEventListener('scroll', () => {
		if (!ticking) {
			requestAnimationFrame(update);
			ticking = true;
		}
	}, { passive: true });
}
