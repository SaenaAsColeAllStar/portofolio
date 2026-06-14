// cards.ts - Card 3D tilt, depth glow, hover lift & metadata reveal interactions
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Basic hover lift ──────────────────────────────────────────────────────────
export function initCardAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const cards = document.querySelectorAll('.card, [data-animate="card-hover"]');
	cards.forEach(card => {
		const el = card as HTMLElement;
		el.addEventListener('mouseenter', () => {
			el.animate([
				{ transform: 'translateY(0) scale(1)' },
				{ transform: 'translateY(-4px) scale(1.005)' }
			], { duration: 220, easing: EASING, fill: 'forwards' });
		});
		el.addEventListener('mouseleave', () => {
			el.animate([
				{ transform: 'translateY(-4px) scale(1.005)' },
				{ transform: 'translateY(0) scale(1)' }
			], { duration: 220, easing: EASING, fill: 'forwards' });
		});
	});
}

// ─── 3D Tilt + Depth Glow ────────────────────────────────────────────────────
export function initCardTilt() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	if ('ontouchstart' in window) return; // desktop only

	const cards = document.querySelectorAll('[data-tilt]');
	cards.forEach(card => {
		const el = card as HTMLElement;
		const strength = parseFloat(el.dataset.tiltStrength || '12');
		el.style.willChange = 'transform';
		el.style.transition = 'box-shadow 300ms ease';

		el.addEventListener('mousemove', (e: Event) => {
			const mouseEvent = e as MouseEvent;
			const rect = el.getBoundingClientRect();
			const x = mouseEvent.clientX - rect.left;
			const y = mouseEvent.clientY - rect.top;
			const cx = rect.width / 2;
			const cy = rect.height / 2;
			const rotateX = ((y - cy) / cy) * -strength;
			const rotateY = ((x - cx) / cx) * strength;

			el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;

			// Dynamic glow based on mouse position
			const glowX = (x / rect.width) * 100;
			const glowY = (y / rect.height) * 100;
			el.style.boxShadow = `
				0 20px 60px rgba(0,0,0,0.25),
				0 0 40px rgba(var(--accent-rgb, 212,175,55), 0.08),
				inset 0 0 0 1px rgba(255,255,255,0.04)
			`;
			el.style.setProperty('--glow-x', `${glowX}%`);
			el.style.setProperty('--glow-y', `${glowY}%`);
		});

		el.addEventListener('mouseleave', () => {
			el.animate([
				{ transform: el.style.transform },
				{ transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)' }
			], { duration: 400, easing: EASING, fill: 'forwards' });
			el.style.transform = '';
			el.style.boxShadow = '';
		});
	});
}

// ─── Metadata reveal on hover ─────────────────────────────────────────────────
export function initCardMetaReveal() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const cards = document.querySelectorAll('[data-card-meta-parent]');
	cards.forEach(card => {
		const el = card as HTMLElement;
		const meta = el.querySelector('[data-card-meta]') as HTMLElement | null;
		if (!meta) return;

		meta.style.opacity = '0';
		meta.style.transform = 'translateY(8px)';
		meta.style.transition = `opacity 220ms ${EASING}, transform 220ms ${EASING}`;

		el.addEventListener('mouseenter', () => {
			meta.style.opacity = '1';
			meta.style.transform = 'translateY(0)';
		});
		el.addEventListener('mouseleave', () => {
			meta.style.opacity = '0';
			meta.style.transform = 'translateY(8px)';
		});
	});
}
