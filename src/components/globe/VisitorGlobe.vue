<template>
  <div class="visitor-globe-card">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { latLngToVector3, rotateVector, getCountryCoords, formatRelativeTime } from '../../utils/globe-math';
import GlobeControls from './GlobeControls.vue';
import CountryTooltip from './CountryTooltip.vue';

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
    ctx.strokeStyle = drawFront ? 'rgba(79, 140, 255, 0.08)' : 'rgba(79, 140, 255, 0.03)';
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
    ctx.strokeStyle = drawFront ? 'rgba(79, 140, 255, 0.08)' : 'rgba(79, 140, 255, 0.03)';
    ctx.stroke();
  }

  if (drawFront) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(79, 140, 255, 0.2)';
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
      ctx.strokeStyle = drawFront ? 'rgba(79, 140, 255, 0.22)' : 'rgba(79, 140, 255, 0.06)';
      ctx.stroke();

      const t = (pulseTime + (node.country.visits * 0.2)) % 1;
      const signalX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
      const signalY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;

      ctx.beginPath();
      ctx.arc(signalX, signalY, 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = drawFront ? 'var(--accent-glow, #6ba4ff)' : 'rgba(79, 140, 255, 0.3)';
      ctx.fill();
    }
  });
  ctx.restore();
};

const drawCountryMarkers = (ctx) => {
  ctx.save();
  const maxVisits = props.countries.length > 0 ? Math.max(...props.countries.map(c => c.visits)) : 10;

  projectedCountriesList.forEach(node => {
    const isFront = node.depth >= 0;
    const baseRadius = 4.5 + ((node.country.visits / maxVisits) * 6);
    
    ctx.beginPath();
    ctx.arc(node.sx, node.sy, baseRadius, 0, 2 * Math.PI);

    const isHighlighted = highlightedCode.value === node.country.code;
    const isHost = node.country.code === 'ID';

    ctx.fillStyle = isHost ? (isFront ? 'var(--gold, #F4C46A)' : 'rgba(244, 196, 106, 0.3)') : (isFront ? 'var(--accent, #4f8cff)' : 'rgba(79, 140, 255, 0.2)');
    ctx.strokeStyle = isFront ? '#FFF' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    if (isFront && (isHighlighted || node.country.visits > maxVisits * 0.5)) {
      const pulseSize = baseRadius + (Math.sin(Date.now() * 0.005) + 1) * 4;
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, pulseSize, 0, 2 * Math.PI);
      ctx.strokeStyle = isHost ? 'rgba(244, 196, 106, 0.3)' : 'rgba(79, 140, 255, 0.3)';
      ctx.stroke();
    }
  });
  ctx.restore();
};

let resizeObserver = null;

onMounted(() => {
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

    projectedCountriesList = [];
    processedCountries.value.forEach(c => {
      const baseVec = latLngToVector3(c.lat, c.lng, radius);
      const rotVec = rotateVector(baseVec, rotationX.value, rotationY.value);
      projectedCountriesList.push({ sx: cx + rotVec.x, sy: cy + rotVec.y, depth: rotVec.z, country: c });
    });

    const idNode = projectedCountriesList.find(p => p.country.code === 'ID');
    drawConnections(ctx, idNode, false);
    drawGrid(ctx, true);
    drawConnections(ctx, idNode, true);
    drawCountryMarkers(ctx);

    animationId = requestAnimationFrame(loop);
  };
  loop();
});

onUnmounted(() => {
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
  background: radial-gradient(circle at center, rgba(16, 20, 28, 0.4) 0%, rgba(10, 12, 18, 0.8) 100%);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.02);
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
