// search.ts - Search bar expand/collapse & suggestion stagger animations
export function initSearchAnimations() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	// Search expand/collapse
	const searchTriggers = document.querySelectorAll('[data-search-trigger]');
	searchTriggers.forEach(trigger => {
		const targetId = (trigger as HTMLElement).dataset.searchTarget;
		const target = targetId ? document.getElementById(targetId) : null;
		if (!target) return;

		trigger.addEventListener('click', () => {
			const isExpanded = target.getAttribute('aria-expanded') === 'true';
			if (!isExpanded) {
				target.style.display = 'flex';
				target.animate([
					{ opacity: 0, transform: 'scaleX(0.8) translateY(-4px)' },
					{ opacity: 1, transform: 'scaleX(1) translateY(0)' }
				], {
					duration: 220,
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
					fill: 'forwards'
				});
				target.setAttribute('aria-expanded', 'true');
			} else {
				target.animate([
					{ opacity: 1, transform: 'scaleX(1) translateY(0)' },
					{ opacity: 0, transform: 'scaleX(0.8) translateY(-4px)' }
				], {
					duration: 180,
					easing: 'cubic-bezier(0.4, 0, 1, 1)',
					fill: 'forwards'
				}).finished.then(() => {
					target.style.display = 'none';
				});
				target.setAttribute('aria-expanded', 'false');
			}
		});
	});

	// Search suggestion stagger reveal
	const suggestionList = document.querySelector('[data-search-suggestions]');
	if (suggestionList) {
		const observer = new MutationObserver(() => {
			const items = suggestionList.querySelectorAll('[data-suggestion-item]');
			items.forEach((item, idx) => {
				(item as HTMLElement).animate([
					{ opacity: 0, transform: 'translateY(6px)' },
					{ opacity: 1, transform: 'translateY(0)' }
				], {
					duration: 160,
					delay: idx * 30,
					easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
					fill: 'forwards'
				});
			});
		});
		observer.observe(suggestionList, { childList: true, subtree: true });
	}
}
