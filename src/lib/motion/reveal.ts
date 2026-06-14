// reveal.ts - Scroll Reveal animations utilizing Web Animations API
export function initRevealAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		const animatedElements = document.querySelectorAll('[data-animate="reveal"]');
		animatedElements.forEach(el => {
			(el as HTMLElement).style.opacity = '1';
		});
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const el = entry.target as HTMLElement;
				const durationAttr = el.dataset.animateDuration;
				const delayAttr = el.dataset.animateDelay;
				
				const duration = durationAttr ? parseInt(durationAttr, 10) : 600;
				const delay = delayAttr ? parseInt(delayAttr, 10) : 0;
				
				el.animate([
					{ opacity: 0, transform: 'translateY(16px)' },
					{ opacity: 1, transform: 'translateY(0)' }
				], {
					duration,
					delay,
					easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
					fill: 'forwards'
				});
				
				observer.unobserve(el);
			}
		});
	}, {
		threshold: 0.05,
		rootMargin: '0px 0px -40px 0px'
	});

	const animatedElements = document.querySelectorAll('[data-animate="reveal"]');
	animatedElements.forEach(el => {
		(el as HTMLElement).style.opacity = '0';
		observer.observe(el);
	});
}
