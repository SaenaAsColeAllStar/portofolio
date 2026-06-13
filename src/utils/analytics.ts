/**
 * Lightweight privacy-friendly analytics utility.
 * Intercepts elements with `data-track` attributes and logs them.
 */
export function initAnalytics() {
	if (typeof window === "undefined") return;

	const trackElements = document.querySelectorAll("[data-track]");

	trackElements.forEach((el) => {
		el.addEventListener("click", () => {
			const eventName = el.getAttribute("data-track");
			if (eventName) {
				// In a production scenario, this is where you'd send a beacon or fetch request
				// e.g., navigator.sendBeacon('/api/track', JSON.stringify({ event: eventName, timestamp: Date.now() }))
				console.info(`[Analytics] Tracked event: ${eventName}`);
			}
		});
	});
}
