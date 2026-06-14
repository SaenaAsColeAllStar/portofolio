const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function morphPath(pathElement: SVGPathElement, targetD: string, duration = 300) {
  if (typeof window === 'undefined') return;
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
