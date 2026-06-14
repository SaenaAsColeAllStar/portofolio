// reveal.ts - Comprehensive scroll reveal system utilizing Web Animations API
// Supports: fade-up, fade-in, scale-reveal, mask-reveal, word-reveal, line-reveal, counter, stagger

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Reduced motion guard ────────────────────────────────────────────────────
function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Number counter animation ─────────────────────────────────────────────────
function animateCounter(el: HTMLElement) {
	const target = parseFloat(el.dataset.counterTarget || el.textContent || '0');
	const duration = parseInt(el.dataset.animateDuration || '1500', 10);
	const suffix = el.dataset.counterSuffix || '';
	const decimals = el.dataset.counterDecimals ? parseInt(el.dataset.counterDecimals, 10) : 0;
	const start = performance.now();

	function step(now: number) {
		const elapsed = now - start;
		const progress = Math.min(elapsed / duration, 1);
		// Ease out cubic
		const eased = 1 - Math.pow(1 - progress, 3);
		const value = (target * eased).toFixed(decimals);
		el.textContent = value + suffix;
		if (progress < 1) requestAnimationFrame(step);
	}
	requestAnimationFrame(step);
}

// ─── Word reveal ─────────────────────────────────────────────────────────────
function animateWordReveal(el: HTMLElement, delay: number) {
	const text = el.dataset.wordText || el.textContent || '';
	const words = text.split(' ');
	el.innerHTML = '';
	el.style.opacity = '1';

	words.forEach((word, idx) => {
		const span = document.createElement('span');
		span.style.display = 'inline-block';
		span.style.overflow = 'hidden';
		span.style.verticalAlign = 'bottom';
		const inner = document.createElement('span');
		inner.style.display = 'inline-block';
		inner.textContent = word + (idx < words.length - 1 ? '\u00a0' : '');
		span.appendChild(inner);
		el.appendChild(span);

		inner.animate([
			{ transform: 'translateY(110%)', opacity: 0 },
			{ transform: 'translateY(0)', opacity: 1 }
		], {
			duration: 500,
			delay: delay + idx * 60,
			easing: EASING,
			fill: 'forwards'
		});
	});
}

// ─── Stagger children reveal ──────────────────────────────────────────────────
function animateStagger(parent: HTMLElement, delay: number) {
	const children = Array.from(parent.children) as HTMLElement[];
	const staggerMs = parseInt(parent.dataset.animateStagger || '80', 10);
	const type = parent.dataset.animateChildren || 'fade-up';

	children.forEach((child, idx) => {
		const childDelay = delay + idx * staggerMs;
		const keyframes = getKeyframes(type);
		child.style.opacity = '0';
		child.animate(keyframes, {
			duration: parseInt(parent.dataset.animateDuration || '500', 10),
			delay: childDelay,
			easing: EASING,
			fill: 'forwards'
		});
	});
}

// ─── Keyframe map ─────────────────────────────────────────────────────────────
function getKeyframes(type: string): Keyframe[] {
	switch (type) {
		case 'fade-in':
			return [{ opacity: 0 }, { opacity: 1 }];
		case 'scale-reveal':
			return [
				{ opacity: 0, transform: 'scale(0.92)' },
				{ opacity: 1, transform: 'scale(1)' }
			];
		case 'mask-reveal':
			return [
				{ opacity: 0, clipPath: 'inset(0 100% 0 0)' },
				{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }
			];
		case 'line-reveal':
			return [
				{ opacity: 0, clipPath: 'inset(0 0 100% 0)' },
				{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }
			];
		case 'fade-up':
		default:
			return [
				{ opacity: 0, transform: 'translateY(20px)' },
				{ opacity: 1, transform: 'translateY(0)' }
			];
	}
}

// ─── Scroll indicator ─────────────────────────────────────────────────────────
function initScrollIndicator() {
	const indicator = document.getElementById('scroll-indicator');
	if (!indicator) return;
	const update = () => {
		const scrolled = window.scrollY;
		const total = document.documentElement.scrollHeight - window.innerHeight;
		const pct = total > 0 ? (scrolled / total) * 100 : 0;
		indicator.style.width = `${pct}%`;
	};
	window.addEventListener('scroll', update, { passive: true });
}

// ─── Main reveal init ─────────────────────────────────────────────────────────
export function initRevealAnimations() {
	// Scroll indicator always runs
	initScrollIndicator();

	if (prefersReducedMotion()) {
		// Make all animated elements visible immediately
		document.querySelectorAll('[data-animate]').forEach(el => {
			(el as HTMLElement).style.opacity = '1';
		});
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const el = entry.target as HTMLElement;
			const animType = el.dataset.animate || 'fade-up';
			const duration = parseInt(el.dataset.animateDuration || '600', 10);
			const delay = parseInt(el.dataset.animateDelay || '0', 10);

			if (animType === 'counter') {
				animateCounter(el);
			} else if (animType === 'word-reveal') {
				animateWordReveal(el, delay);
			} else if (animType === 'stagger') {
				animateStagger(el, delay);
			} else {
				const keyframes = getKeyframes(animType);
				el.animate(keyframes, {
					duration,
					delay,
					easing: EASING,
					fill: 'forwards'
				});
			}

			observer.unobserve(el);
		});
	}, {
		threshold: 0.08,
		rootMargin: '0px 0px -40px 0px'
	});

	document.querySelectorAll('[data-animate]').forEach(el => {
		const animType = (el as HTMLElement).dataset.animate || '';
		// Don't hide stagger parents — children will be set to opacity:0 on animate
		if (animType !== 'stagger' && animType !== 'word-reveal') {
			(el as HTMLElement).style.opacity = '0';
		}
		observer.observe(el);
	});
}
