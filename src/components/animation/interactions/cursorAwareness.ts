import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export type SpatialZone = 1 | 2 | 3 | 4; // 1: Far, 2: Nearby, 3: Hover, 4: Active

export interface CursorAwarenessOptions {
  nearbyRadius?: number;
  activeRadius?: number;
}

export function useCursorAwareness(
  elRef: Ref<HTMLElement | null>,
  options: CursorAwarenessOptions = {}
) {
  const { nearbyRadius = 240, activeRadius = 70 } = options;

  const zone = ref<SpatialZone>(1);
  const distance = ref<number>(Infinity);
  const angle = ref<number>(0);
  const relativeCoords = ref({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!elRef.value) return;

    const rect = elRef.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const d = Math.hypot(dx, dy);

    distance.value = d;
    angle.value = Math.atan2(dy, dx);
    relativeCoords.value = { x: dx, y: dy };

    const isInsideBoundingBox =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (isInsideBoundingBox) {
      zone.value = 4; // Zone 4: Active interaction inside element bounding box
    } else if (d <= activeRadius) {
      zone.value = 3; // Zone 3: Hover range
    } else if (d <= nearbyRadius) {
      zone.value = 2; // Zone 2: Nearby range (attention triggered)
    } else {
      zone.value = 1; // Zone 1: Far (idle)
    }
  };

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
  });

  return {
    zone,
    distance,
    angle,
    relativeCoords
  };
}
