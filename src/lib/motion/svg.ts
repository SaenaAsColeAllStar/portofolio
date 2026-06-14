// svg.ts - Reusable SVG path morphing utility utilizing Web Animations API
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
		], {
			duration,
			easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
			fill: 'forwards'
		});
	} catch (e) {
		// Fallback for browsers that don't support path() syntax inside keyframes
		pathElement.setAttribute('d', targetD);
	}
}
