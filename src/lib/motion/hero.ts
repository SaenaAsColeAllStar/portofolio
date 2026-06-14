// hero.ts - Hero system node map animations
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Hero container entrance ──────────────────────────────────────────────────
export function initHeroAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const heroContainer = document.querySelector('.hero-system-container');
	if (heroContainer) {
		heroContainer.animate([
			{ opacity: 0, transform: 'scale(0.97)' },
			{ opacity: 1, transform: 'scale(1)' }
		], { duration: 800, easing: EASING, fill: 'forwards' });
	}
}

// ─── Hero text stagger entrance ───────────────────────────────────────────────
export function initHeroTextStagger() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const heroTexts = document.querySelectorAll('[data-hero-text]');
	heroTexts.forEach((el, idx) => {
		const htmlEl = el as HTMLElement;
		htmlEl.style.opacity = '0';
		htmlEl.animate([
			{ opacity: 0, transform: 'translateY(24px)' },
			{ opacity: 1, transform: 'translateY(0)' }
		], {
			duration: 700,
			delay: 200 + idx * 120,
			easing: EASING,
			fill: 'forwards'
		});
	});
}

// ─── Hero node idle pulse ─────────────────────────────────────────────────────
export function initHeroNodePulse() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const nodes = document.querySelectorAll('[data-hero-node]');
	nodes.forEach((node, idx) => {
		const el = node as HTMLElement;
		const delay = idx * 300;

		// Staggered scale pulse
		const pulse = el.animate([
			{ transform: 'scale(1)', opacity: 1 },
			{ transform: 'scale(1.06)', opacity: 0.85 },
			{ transform: 'scale(1)', opacity: 1 }
		], {
			duration: 2800,
			delay,
			easing: 'ease-in-out',
			iterations: Infinity
		});

		// Pause on hover, resume on leave
		el.addEventListener('mouseenter', () => pulse.pause());
		el.addEventListener('mouseleave', () => pulse.play());
	});
}

// ─── CTA Magnetic effect ──────────────────────────────────────────────────────
export function initCTAMagnetic() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	// Only desktop
	if ('ontouchstart' in window) return;

	const magneticBtns = document.querySelectorAll('[data-magnetic]');
	magneticBtns.forEach(btn => {
		const el = btn as HTMLElement;
		const strength = parseFloat(el.dataset.magneticStrength || '0.35');

		el.addEventListener('mousemove', (e: Event) => {
			const mouseEvent = e as MouseEvent;
			const rect = el.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = (mouseEvent.clientX - cx) * strength;
			const dy = (mouseEvent.clientY - cy) * strength;
			el.style.transform = `translate(${dx}px, ${dy}px)`;
		});

		el.addEventListener('mouseleave', () => {
			el.animate([
				{ transform: el.style.transform },
				{ transform: 'translate(0, 0)' }
			], { duration: 400, easing: EASING, fill: 'forwards' });
			el.style.transform = '';
		});
	});
}

// ─── Dynamic Arrow hover direction-aware effect ────────────────────────────────
export function initDynamicArrows() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	if ('ontouchstart' in window) return;

	const arrowContainers = document.querySelectorAll('.button, [data-dynamic-arrow]');
	arrowContainers.forEach(container => {
		const el = container as HTMLElement;
		const arrow = el.querySelector('.btn-arrow') as HTMLElement | null;
		if (!arrow) return;

		el.addEventListener('mousemove', (e: Event) => {
			const mouseEvent = e as MouseEvent;
			const rect = arrow.getBoundingClientRect();
			const ax = rect.left + rect.width / 2;
			const ay = rect.top + rect.height / 2;
			const dx = mouseEvent.clientX - ax;
			const dy = mouseEvent.clientY - ay;
			const angleRad = Math.atan2(dy, dx);
			let angleDeg = angleRad * (180 / Math.PI);

			const arrowText = arrow.textContent?.trim() || '';
			if (arrowText === '↗') {
				angleDeg -= -45;
			}

			arrow.style.setProperty('--arrow-rotation', `${angleDeg}deg`);
		});

		el.addEventListener('mouseleave', () => {
			arrow.style.removeProperty('--arrow-rotation');
		});
	});
}

// ─── Section Scroll Indicator Dots ──────────────────────────────────────────────
export function initSectionIndicator() {
	if (typeof window === 'undefined') return;

	// Only run on the homepage (where .hero exists and there are multiple sections)
	const isHomepage = !!document.querySelector('.hero') && document.querySelectorAll('main > section, main > .section, section.hero').length > 2;
	if (!isHomepage) {
		const existing = document.getElementById('section-indicator-container');
		if (existing) existing.remove();
		return;
	}

	let container = document.getElementById('section-indicator-container');
	if (!container) {
		container = document.createElement('div');
		container.id = 'section-indicator-container';
		container.className = 'section-indicator';
		document.body.appendChild(container);
	} else {
		container.innerHTML = '';
	}

	const sections = Array.from(document.querySelectorAll('section.hero, main > section, main > .section'));
	if (sections.length === 0) return;

	const dots: HTMLElement[] = [];

	sections.forEach((section, idx) => {
		const secEl = section as HTMLElement;
		if (!secEl.id) {
			secEl.id = `section-idx-${idx}`;
		}

		const dot = document.createElement('div');
		dot.className = 'section-dot';
		if (idx === 0) dot.classList.add('active');

		const heading = secEl.querySelector('h1, h2');
		if (heading && heading.textContent) {
			dot.title = heading.textContent.trim();
		} else {
			dot.title = `Section ${idx + 1}`;
		}

		dot.addEventListener('click', () => {
			secEl.scrollIntoView({ behavior: 'smooth' });
		});

		container?.appendChild(dot);
		dots.push(dot);
	});

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const idx = sections.indexOf(entry.target as HTMLElement);
				if (idx !== -1) {
					dots.forEach((d, i) => {
						if (i === idx) d.classList.add('active');
						else d.classList.remove('active');
					});
				}
			}
		});
	}, {
		threshold: 0.2,
		rootMargin: '-25% 0px -35% 0px'
	});

	sections.forEach(section => observer.observe(section));
}
