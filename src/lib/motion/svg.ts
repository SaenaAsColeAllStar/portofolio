// svg.ts - SVG animation system: stroke-draw, node pulse, gradient shift, path morph
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Path morph utility ───────────────────────────────────────────────────────
export function morphPath(pathElement: SVGPathElement, targetD: string, duration = 300) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		pathElement.setAttribute('d', targetD);
		return;
	}
	try {
		const startD = pathElement.getAttribute('d') || '';
		pathElement.animate([
			{ d: `path("${startD}")` },
			{ d: `path("${targetD}")` }
		], { duration, easing: EASING, fill: 'forwards' });
	} catch {
		pathElement.setAttribute('d', targetD);
	}
}

// ─── Stroke draw reveal ───────────────────────────────────────────────────────
export function initSVGStrokeDraw() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const paths = document.querySelectorAll('[data-animate="stroke-draw"]');
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const path = entry.target as SVGPathElement;
			const length = path.getTotalLength?.() || 200;
			const duration = parseInt((path as HTMLElement).dataset?.animateDuration || '1200', 10);
			const delay = parseInt((path as HTMLElement).dataset?.animateDelay || '0', 10);

			path.style.strokeDasharray = `${length}`;
			path.style.strokeDashoffset = `${length}`;

			path.animate([
				{ strokeDashoffset: length },
				{ strokeDashoffset: 0 }
			], { duration, delay, easing: EASING, fill: 'forwards' });

			observer.unobserve(path);
		});
	}, { threshold: 0.1 });

	paths.forEach(path => observer.observe(path));
}

// ─── SVG node pulse ───────────────────────────────────────────────────────────
export function initSVGNodePulse() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const nodes = document.querySelectorAll('[data-animate="node-pulse"]');
	nodes.forEach((node, idx) => {
		const el = node as SVGElement;
		el.animate([
			{ opacity: 0.6, r: el.getAttribute('r') || '8' },
			{ opacity: 1, r: `${parseFloat(el.getAttribute('r') || '8') * 1.3}` },
			{ opacity: 0.6, r: el.getAttribute('r') || '8' }
		] as Keyframe[], {
			duration: 2000,
			delay: idx * 250,
			easing: 'ease-in-out',
			iterations: Infinity
		});
	});
}

// ─── Gradient hue shift ───────────────────────────────────────────────────────
export function initGradientShift() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const stops = document.querySelectorAll('[data-animate="gradient-shift"] stop');
	stops.forEach((stop, idx) => {
		const el = stop as SVGStopElement;
		el.animate([
			{ stopOpacity: 0.7 },
			{ stopOpacity: 1 },
			{ stopOpacity: 0.7 }
		], {
			duration: 3000,
			delay: idx * 500,
			easing: 'ease-in-out',
			iterations: Infinity
		});
	});
}

// ─── SVG connection pulse ───────────────────────────────────────────────────
export function initConnectionPulse() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	const paths = document.querySelectorAll('[data-animate="connection-pulse"]');
	paths.forEach((path, idx) => {
		const svgPath = path as SVGPathElement;
		try {
			const length = svgPath.getTotalLength?.() || 200;
			const clone = svgPath.cloneNode(true) as SVGPathElement;
			clone.removeAttribute('data-animate');
			clone.style.stroke = 'var(--accent, #6366f1)';
			clone.style.strokeWidth = `${parseFloat(svgPath.getAttribute('stroke-width') || '1.5') + 0.5}px`;
			clone.style.strokeDasharray = `30 ${length}`;
			clone.style.strokeDashoffset = `${length}`;
			clone.style.opacity = '0.9';
			
			svgPath.parentNode?.appendChild(clone);

			clone.animate([
				{ strokeDashoffset: length },
				{ strokeDashoffset: -30 }
			], {
				duration: parseInt(svgPath.dataset?.animateDuration || '3000', 10),
				delay: idx * 600,
				easing: 'linear',
				iterations: Infinity
			});
		} catch (e) {
			console.warn('Failed to initialize connection pulse on path:', svgPath, e);
		}
	});
}

