<template>
  <div class="visitor-globe-card" ref="cardRef">
    <div class="card-header">
      <div>
        <h2>Global Node Connections</h2>
        <p class="subtitle">Active system nodes mapped by visitor geolocation.</p>
      </div>
      <GlobeControls 
        :is-rotating="isRotating" 
        @toggle-rotation="toggleRotation" 
        @reset-orientation="resetOrientation"
      />
    </div>

    <div class="globe-layout">
      <!-- Canvas Column -->
      <div class="canvas-container" ref="containerRef">
        <canvas 
          ref="canvasRef" 
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleMouseUp"
        ></canvas>

        <!-- Hover Tooltip overlay -->
        <CountryTooltip 
          v-if="hoveredCountry" 
          :country="hoveredCountry" 
          :x="tooltipX" 
          :y="tooltipY" 
        />

        <div class="drag-hint">Drag to rotate the system nodes</div>
      </div>

      <!-- Country list sidebar -->
      <div class="country-sidebar">
        <h3>System Telemetry Logs</h3>
        <div v-if="processedCountries.length === 0" class="empty-sidebar">
          No external node connections logged.
        </div>
        <div v-else class="sidebar-list">
          <div 
            v-for="country in processedCountries" 
            :key="country.code" 
            class="country-item"
            @mouseenter="highlightCountry(country.code)"
            @mouseleave="clearHighlight"
            :class="{ active: highlightedCode === country.code }"
          >
            <div class="country-info">
              <div class="name-row">
                <span class="marker" :style="{ backgroundColor: country.code === 'ID' ? 'var(--gold, #F4C46A)' : 'var(--accent, #4f8cff)' }"></span>
                <strong>{{ country.name }}</strong>
              </div>
              <span class="last-seen">Last seen: {{ formatRelativeTime(country.lastSeen) }}</span>
            </div>
            <div class="country-visits">
              <span class="visits-val font-mono">{{ country.visits }}</span>
              <span class="visits-lbl">hits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { latLngToVector3, rotateVector, getCountryCoords, formatRelativeTime } from '../../utils/globe-math';
import GlobeControls from './GlobeControls.vue';
import CountryTooltip from './CountryTooltip.vue';

const isLightMode = ref(false);

const updateTheme = () => {
  if (typeof document !== 'undefined') {
    isLightMode.value = document.documentElement.getAttribute('data-theme') === 'light';
  }
};

const props = defineProps({
  countries: {
    type: Array,
    default: () => []
  }
});

const fetchedCountries = ref([]);

const processedCountries = computed(() => {
  const source = props.countries.length > 0 ? props.countries : fetchedCountries.value;
  return source.map(c => {
    const coords = getCountryCoords(c.countryCode);
    return {
      code: c.countryCode,
      name: coords.name,
      lat: coords.lat,
      lng: coords.lng,
      visits: c.visits,
      lastSeen: new Date(c.lastSeen)
    };
  });
});

const maxVisits = computed(() => {
  if (processedCountries.value.length === 0) return 10;
  const visits = processedCountries.value.map(c => c.visits);
  return Math.max(...visits, 10);
});

const canvasRef = ref(null);
const containerRef = ref(null);
const isRotating = ref(true);
const highlightedCode = ref(null);

const rotationY = ref(0);
const rotationX = ref(0.3);

const isDragging = ref(false);
const prevMouseX = ref(0);
const prevMouseY = ref(0);
const hoveredCountry = ref(null);
const tooltipX = ref(0);
const tooltipY = ref(0);

let animationId = null;
let radius = 140;
let cx = 170;
let cy = 170;

const toggleRotation = () => { isRotating.value = !isRotating.value; };
const resetOrientation = () => { rotationY.value = 0; rotationX.value = 0.3; };
const highlightCountry = (code) => { highlightedCode.value = code; };
const clearHighlight = () => { highlightedCode.value = null; };

const handleMouseDown = (e) => {
  isDragging.value = true;
  prevMouseX.value = e.clientX;
  prevMouseY.value = e.clientY;
};

const handleMouseMove = (e) => {
  if (isDragging.value) {
    const deltaX = e.clientX - prevMouseX.value;
    const deltaY = e.clientY - prevMouseY.value;
    rotationY.value += deltaX * 0.007;
    rotationX.value = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationX.value + deltaY * 0.007));
    prevMouseX.value = e.clientX;
    prevMouseY.value = e.clientY;
  } else {
    checkCountryHover(e.offsetX, e.offsetY);
  }
};

const handleMouseUp = () => { isDragging.value = false; };
const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    isDragging.value = true;
    prevMouseX.value = e.touches[0].clientX;
    prevMouseY.value = e.touches[0].clientY;
  }
};

const handleTouchMove = (e) => {
  if (isDragging.value && e.touches.length === 1) {
    const deltaX = e.touches[0].clientX - prevMouseX.value;
    const deltaY = e.touches[0].clientY - prevMouseY.value;
    rotationY.value += deltaX * 0.007;
    rotationX.value = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotationX.value + deltaY * 0.007));
    prevMouseX.value = e.touches[0].clientX;
    prevMouseY.value = e.touches[0].clientY;
    e.preventDefault();
  }
};

const CONTINENTS = [
  // North America
  [
    [70, -160], [72, -120], [68, -100], [74, -80], [60, -50],
    [45, -64], [25, -80], [18, -94], [8, -80], [15, -100],
    [32, -117], [48, -125], [58, -135], [60, -145]
  ],
  // South America
  [
    [10, -73], [5, -50], [-7, -35], [-23, -42], [-54, -68],
    [-40, -74], [-18, -70], [-5, -80], [2, -75]
  ],
  // Africa
  [
    [35, -5], [36, 10], [32, 30], [30, 32], [22, 36], 
    [12, 43], [11, 51], [-4, 39], [-34, 19], [-30, 15], 
    [-10, 12], [5, 9], [4, -8], [14, -17], [22, -16], 
    [31, -10]
  ],
  // Eurasia
  [
    [36, -5], [43, -9], [50, -1], [60, 5], [62, 15], 
    [70, 20], [70, 40], [73, 70], [73, 100], [76, 120], 
    [72, 140], [65, 170], [55, 160], [43, 140], [35, 120], 
    [22, 114], [10, 105], [15, 96], [8, 78], [24, 68], 
    [25, 50], [12, 44], [30, 32], [41, 28], [40, 15], 
    [44, 10], [43, 5]
  ],
  // Australia
  [
    [-11, 142], [-23, 151], [-37, 150], [-38, 145], [-35, 138], 
    [-32, 115], [-22, 114], [-12, 131]
  ],
  // Greenland
  [
    [78, -70], [83, -40], [80, -10], [70, -20], [60, -43], 
    [65, -53], [74, -58]
  ]
];

function isPointInPolygon(latitude, longitude, polygon) {
  let x = longitude, y = latitude;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i][1], yi = polygon[i][0];
    let xj = polygon[j][1], yj = polygon[j][0];
    let intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const landPoints = [];
for (let lat = -60; lat <= 80; lat += 3.5) {
  const cosLat = Math.cos((lat * Math.PI) / 180);
  const stepLng = 3.5 / cosLat;
  for (let lng = -180; lng < 180; lng += stepLng) {
    let isLand = false;
    for (const poly of CONTINENTS) {
      if (isPointInPolygon(lat, lng, poly)) {
        isLand = true;
        break;
      }
    }
    if (isLand) {
      landPoints.push({ lat, lng });
    }
  }
}

let projectedCountriesList = [];

const checkCountryHover = (mouseX, mouseY) => {
  let found = null;
  for (const c of projectedCountriesList) {
    if (c.depth > 0) {
      const dx = mouseX - c.sx;
      const dy = mouseY - c.sy;
      if (Math.sqrt(dx * dx + dy * dy) < 12) {
        found = c;
        break;
      }
    }
  }
  if (found) {
    hoveredCountry.value = found.country;
    tooltipX.value = found.sx + 15;
    tooltipY.value = found.sy - 40;
  } else {
    hoveredCountry.value = null;
  }
};

const drawGrid = (ctx, drawFront) => {
  ctx.save();
  ctx.lineWidth = 1;
  const lngSegments = 12;
  const latSegments = 9;

  for (let i = 0; i < lngSegments; i++) {
    const lng = (i * 360) / lngSegments;
    ctx.beginPath();
    let first = true;
    for (let lat = -90; lat <= 90; lat += 5) {
      const v = latLngToVector3(lat, lng, radius);
      const rot = rotateVector(v, rotationX.value, rotationY.value);
      if ((rot.z >= 0) === drawFront) {
        if (first) { ctx.moveTo(cx + rot.x, cy + rot.y); first = false; }
        else { ctx.lineTo(cx + rot.x, cy + rot.y); }
      } else { first = true; }
    }
    ctx.strokeStyle = isLightMode.value 
      ? (drawFront ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.03)')
      : (drawFront ? 'rgba(79, 140, 255, 0.08)' : 'rgba(79, 140, 255, 0.03)');
    ctx.stroke();
  }

  for (let i = 1; i < latSegments; i++) {
    const lat = -90 + (i * 180) / latSegments;
    ctx.beginPath();
    let first = true;
    for (let lng = 0; lng <= 360; lng += 5) {
      const v = latLngToVector3(lat, lng, radius);
      const rot = rotateVector(v, rotationX.value, rotationY.value);
      if ((rot.z >= 0) === drawFront) {
        if (first) { ctx.moveTo(cx + rot.x, cy + rot.y); first = false; }
        else { ctx.lineTo(cx + rot.x, cy + rot.y); }
      } else { first = true; }
    }
    ctx.strokeStyle = isLightMode.value
      ? (drawFront ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.03)')
      : (drawFront ? 'rgba(79, 140, 255, 0.08)' : 'rgba(79, 140, 255, 0.03)');
    ctx.stroke();
  }

  if (drawFront) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = isLightMode.value ? 'rgba(37, 99, 235, 0.2)' : 'rgba(79, 140, 255, 0.2)';
    ctx.stroke();
  }
  ctx.restore();
};

const drawConnections = (ctx, idNode, drawFront) => {
  if (!idNode) return;
  ctx.save();
  ctx.lineWidth = 1.5;
  const pulseTime = Date.now() * 0.0015;

  projectedCountriesList.forEach(node => {
    if (node.country.code === 'ID') return;
    const isFrontLine = ((node.depth + idNode.depth) / 2) >= 0;

    if (isFrontLine === drawFront) {
      ctx.beginPath();
      const startX = node.sx; const startY = node.sy;
      const endX = idNode.sx; const endY = idNode.sy;
      const midX = (startX + endX) / 2; const midY = (startY + endY) / 2;
      const dx = midX - cx; const dy = midY - cy;
      const ctrlX = cx + dx * 1.15; const ctrlY = cy + dy * 1.15;

      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
      ctx.strokeStyle = isLightMode.value
        ? (drawFront ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.06)')
        : (drawFront ? 'rgba(79, 140, 255, 0.22)' : 'rgba(79, 140, 255, 0.06)');
      ctx.stroke();

      const t = (pulseTime + (node.country.visits * 0.2)) % 1;
      const signalX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
      const signalY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;

      ctx.beginPath();
      ctx.arc(signalX, signalY, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = isLightMode.value
        ? (drawFront ? '#1d4ed8' : 'rgba(37, 99, 235, 0.3)')
        : (drawFront ? '#6ba4ff' : 'rgba(79, 140, 255, 0.3)');
      ctx.fill();
    }
  });
  ctx.restore();
};

const drawLandMap = (ctx, drawFront) => {
  ctx.save();
  ctx.fillStyle = isLightMode.value 
    ? (drawFront ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.03)')
    : (drawFront ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)');

  landPoints.forEach(pt => {
    const v = latLngToVector3(pt.lat, pt.lng, radius);
    const rot = rotateVector(v, rotationX.value, rotationY.value);
    const isFront = rot.z >= 0;

    if (isFront === drawFront) {
      ctx.beginPath();
      ctx.arc(cx + rot.x, cy + rot.y, 1.2, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
  ctx.restore();
};

const drawCountryMarkers = (ctx) => {
  ctx.save();
  const maxVisitsVal = maxVisits.value;

  projectedCountriesList.forEach(node => {
    const isFront = node.depth >= 0;
    const baseRadius = 4.5 + ((node.country.visits / maxVisitsVal) * 6);
    
    ctx.beginPath();
    ctx.arc(node.sx, node.sy, baseRadius, 0, 2 * Math.PI);

    const isHighlighted = highlightedCode.value === node.country.code;
    const isHost = node.country.code === 'ID';

    ctx.fillStyle = isHost ? (isFront ? '#F4C46A' : 'rgba(244, 196, 106, 0.3)') : (isFront ? 'var(--accent, #4f8cff)' : (isLightMode.value ? 'rgba(37, 99, 235, 0.15)' : 'rgba(79, 140, 255, 0.2)'));
    ctx.strokeStyle = isFront ? '#FFF' : (isLightMode.value ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)');
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    if (isFront && (isHighlighted || node.country.visits > maxVisitsVal * 0.5)) {
      const pulseSize = baseRadius + (Math.sin(Date.now() * 0.005) + 1) * 4;
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, pulseSize, 0, 2 * Math.PI);
      ctx.strokeStyle = isHost ? 'rgba(244, 196, 106, 0.3)' : (isLightMode.value ? 'rgba(37, 99, 235, 0.3)' : 'rgba(79, 140, 255, 0.3)');
      ctx.stroke();
    }
  });
  ctx.restore();
};

let resizeObserver = null;

const cardRef = ref(null);

watch(processedCountries, () => {
  if (typeof window === 'undefined') return;
  nextTick(() => {
    // Country sidebar items stagger-appear
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = document.querySelectorAll('.country-item');
    items.forEach((item, idx) => {
      const el = item;
      el.style.opacity = '0';
      el.animate([
        { opacity: 0, transform: 'translateX(10px)' },
        { opacity: 1, transform: 'translateX(0)' }
      ], {
        duration: 400,
        delay: idx * 60,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });
    });
  });
}, { deep: true, immediate: true });

onMounted(() => {
  updateTheme();
  window.addEventListener('theme-changed', updateTheme);
  // Fade-in entrance on scroll enter via IntersectionObserver on mount
  const card = cardRef.value;
  if (card && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          card.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 600,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
          });
          
          // Canvas scale 0.95 -> 1 on scroll enter
          if (canvasRef.value) {
            canvasRef.value.animate([
              { opacity: 0, transform: 'scale(0.95)' },
              { opacity: 1, transform: 'scale(1)' }
            ], {
              duration: 800,
              delay: 100,
              easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              fill: 'forwards'
            });
          }

          observer.unobserve(card);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(card);
  } else if (card) {
    card.style.opacity = '1';
  }

  if (props.countries.length === 0) {
    fetch('/api/globe-data')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          fetchedCountries.value = data;
        } else {
          fetchedCountries.value = [
            { countryCode: "ID", visits: 1, lastSeen: new Date() }
          ];
        }
      })
      .catch(e => {
        console.error('Failed to fetch client globe data:', e);
        fetchedCountries.value = [
          { countryCode: "ID", visits: 1, lastSeen: new Date() }
        ];
      });
  }

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  
  const updateSize = () => {
    if (!canvas || !containerRef.value) return;
    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight || 340;
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  };

  updateSize();
  resizeObserver = new ResizeObserver(updateSize);
  if (containerRef.value) resizeObserver.observe(containerRef.value);

  const loop = () => {
    const dpr = window.devicePixelRatio || 1;
    radius = Math.min(canvas.width / dpr, canvas.height / dpr) * 0.4;
    cx = (canvas.width / dpr) / 2; cy = (canvas.height / dpr) / 2;

    if (isRotating.value && !isDragging.value) rotationY.value += 0.0025;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    drawGrid(ctx, false);
    drawLandMap(ctx, false);

    projectedCountriesList = [];
    processedCountries.value.forEach(c => {
      const baseVec = latLngToVector3(c.lat, c.lng, radius);
      const rotVec = rotateVector(baseVec, rotationX.value, rotationY.value);
      projectedCountriesList.push({ sx: cx + rotVec.x, sy: cy + rotVec.y, depth: rotVec.z, country: c });
    });

    const idNode = projectedCountriesList.find(p => p.country.code === 'ID');
    drawConnections(ctx, idNode, false);
    drawLandMap(ctx, true);
    drawGrid(ctx, true);
    drawConnections(ctx, idNode, true);
    drawCountryMarkers(ctx);

    animationId = requestAnimationFrame(loop);
  };
  loop();
});

onUnmounted(() => {
  window.removeEventListener('theme-changed', updateTheme);
  if (animationId) cancelAnimationFrame(animationId);
  if (resizeObserver && containerRef.value) resizeObserver.unobserve(containerRef.value);
});
</script>

<style scoped>
.visitor-globe-card {
  background: var(--surface, #151922);
  border: 1px solid var(--border, #242936);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  overflow: hidden;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text, #f0f4fc);
  margin: 0;
}
.subtitle {
  font-size: 0.85rem;
  color: var(--muted, #8ea0c4);
  margin: 0.2rem 0 0 0;
}
.globe-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1.5rem;
  align-items: center;
}
@media (max-width: 768px) {
  .globe-layout { grid-template-columns: 1fr; }
}
.canvas-container {
  position: relative;
  width: 100%;
  height: 340px;
  background: radial-gradient(circle at center, var(--accent-glow-1) 0%, var(--bg-soft) 100%);
  border-radius: 8px;
  border: 1px solid var(--border);
  cursor: grab;
}
.canvas-container:active { cursor: grabbing; }
canvas { display: block; }
.drag-hint {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.72rem;
  color: var(--muted, #5e7299);
  pointer-events: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.country-sidebar {
  border-left: 1px solid var(--border, #242936);
  padding-left: 1.5rem;
  height: 340px;
  display: flex;
  flex-direction: column;
}
@media (max-width: 768px) {
  .country-sidebar {
    border-left: none;
    padding-left: 0;
    border-top: 1px solid var(--border, #242936);
    padding-top: 1.5rem;
    height: auto;
    max-height: 250px;
  }
}
h3 {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted, #8ea0c4);
  margin: 0 0 0.8rem 0;
}
.empty-sidebar {
  font-size: 0.85rem;
  color: var(--muted, #5e7299);
  text-align: center;
  margin-top: 2rem;
}
.sidebar-list {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.sidebar-list::-webkit-scrollbar { width: 4px; }
.sidebar-list::-webkit-scrollbar-thumb { background: var(--border, #242936); border-radius: 4px; }
.country-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.6rem;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid transparent;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.country-item:hover, .country-item.active {
  background: rgba(79, 140, 255, 0.04);
  border-color: rgba(79, 140, 255, 0.12);
}
.country-info { display: flex; flex-direction: column; }
.name-row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.88rem; color: var(--text, #f0f4fc); }
.marker { width: 6px; height: 6px; border-radius: 50%; }
.last-seen { font-size: 0.7rem; color: var(--muted, #5e7299); margin-top: 0.1rem; }
.country-visits { text-align: right; display: flex; flex-direction: column; }
.visits-val { font-size: 0.95rem; font-weight: 600; color: var(--accent, #4f8cff); }
.visits-lbl { font-size: 0.65rem; color: var(--muted, #5e7299); }
</style>
