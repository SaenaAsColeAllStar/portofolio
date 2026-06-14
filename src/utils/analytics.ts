/**
 * Lightweight privacy-friendly analytics utility.
 * Intercepts elements with `data-track` attributes and logs them.
 */
export function initAnalytics() {
	if (typeof window === "undefined") return;

	const trackElements = document.querySelectorAll("[data-track]:not([data-analytics-bound])");

	trackElements.forEach((el) => {
		el.setAttribute("data-analytics-bound", "true");
		el.addEventListener("click", () => {
			const eventName = el.getAttribute("data-track");
			if (eventName) {
				console.info(`[Analytics] Tracking event: ${eventName}`);
				fetch("/api/views", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({ path: `event:${eventName}` })
				}).catch(err => {
					console.error('[Analytics] Failed to send tracking event:', err);
				});
			}
		});
	});
}
