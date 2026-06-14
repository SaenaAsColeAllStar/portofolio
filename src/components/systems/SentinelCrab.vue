<template>
  <div 
    class="sentinel-crab-container" 
    :class="[
      variant, 
      { 
        'active-react': activeNodeId || hoveredNodeId,
        'dancing': isDancing,
        'systems-boosted': systemsBoosted,
        'searching-active': searchActive
      }
    ]"
    ref="crabRef"
    @mouseenter="handleCrabHover"
    role="img"
    aria-label="CTOS Sentinel Crab interactive companion"
  >
    <svg 
      viewBox="-80 -40 160 140" 
      class="sentinel-crab-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Glow Filters -->
      <defs>
        <radialGradient id="crab-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.25" />
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
        </radialGradient>
        <filter id="accent-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Glow aura (unlocked via Level 02 Systems Visitor Easter Egg) -->
      <circle 
        cx="0" 
        cy="30" 
        r="50" 
        fill="url(#crab-glow)" 
        class="aura-glow"
      />

      <!-- Radar Pulse Waves (active on Cloudflare Node hover) -->
      <g class="radar-pulses" v-if="hoveredNodeId === 'cloudflare' || searchActive">
        <circle cx="0" cy="-25" r="10" class="radar-wave wave-1" />
        <circle cx="0" cy="-25" r="25" class="radar-wave wave-2" />
        <circle cx="0" cy="-25" r="40" class="radar-wave wave-3" />
      </g>

      <!-- Infrastructure Particles (floating code blocks behind body) -->
      <g class="particles">
        <circle cx="-35" cy="10" r="1.5" class="particle p-1" />
        <circle cx="35" cy="15" r="1" class="particle p-2" />
        <circle cx="-25" cy="65" r="1.2" class="particle p-3" />
        <circle cx="28" cy="60" r="1.5" class="particle p-4" />
      </g>

      <!-- Mechanical Legs -->
      <g class="legs-group">
        <!-- Left Legs -->
        <g class="left-legs">
          <path d="M -32,38 L -50,50 L -62,65" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-l1" />
          <path d="M -28,43 L -46,57 L -56,74" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-l2" />
          <path d="M -24,46 L -38,60 L -45,78" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-l3" />
        </g>
        <!-- Right Legs -->
        <g class="right-legs">
          <path d="M 32,38 L 50,50 L 62,65" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-r1" />
          <path d="M 28,43 L 46,57 L 56,74" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-r2" />
          <path d="M 24,46 L 38,60 L 45,78" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-r3" />
        </g>
      </g>
 
      <!-- Main Body Core (Hexagonal carapace) -->
      <g class="body-core-group" :style="bodyStyle">
        <polygon 
          points="-25,12 -42,32 -32,58 32,58 42,32 25,12" 
          fill="var(--surface-elevated)" 
          stroke="var(--accent)" 
          stroke-width="2" 
          class="carapace"
          filter="url(#accent-shadow)"
        />
        
        <!-- Geometric PCB Details inside carapace -->
        <polyline points="-18,22 -6,32 6,32 18,22" fill="none" stroke="var(--subtle)" stroke-width="1.5" />
        <line x1="0" y1="32" x2="0" y2="48" stroke="var(--subtle)" stroke-width="1.5" />
        <circle cx="-6" cy="32" r="1.5" fill="var(--muted)" />
        <circle cx="6" cy="32" r="1.5" fill="var(--muted)" />
      </g>
 
      <!-- Antenna Signals -->
      <g class="antennas-group" :class="{ 'antenna-alert': hoveredNodeId === 'ai' }">
        <!-- Left Antenna -->
        <line x1="-6" y1="12" x2="-8" y2="-20" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="1.5 1.5" class="antenna ant-l" />
        <circle cx="-8" cy="-20" r="2" fill="var(--accent)" class="antenna-node ant-node-l" />
        
        <!-- Right Antenna -->
        <line x1="6" y1="12" x2="8" y2="-20" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="1.5 1.5" class="antenna ant-r" />
        <circle cx="8" cy="-20" r="2" fill="var(--accent)" class="antenna-node ant-node-r" />
      </g>
 
      <!-- Mechanical Claws (Pincers) -->
      <g class="claws-group">
        <!-- Left Claw -->
        <g 
          class="claw-left" 
          :class="{ 'extend-claw': hoveredNodeId === 'proxmox' }"
          :style="leftClawStyle"
        >
          <path d="M -35,32 L -55,22 L -65,2" fill="none" stroke="var(--muted)" stroke-width="3.2" stroke-linecap="round" />
          <!-- Upper pincer jaw -->
          <path d="M -65,2 C -72,-10 -55,-16 -48,-6" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" />
          <!-- Lower pincer jaw -->
          <path d="M -65,2 C -72,12 -55,18 -48,8" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" />
          <!-- Joint marker -->
          <circle cx="-65" cy="2" r="2.5" fill="var(--bg)" stroke="var(--accent)" stroke-width="1.2" />
        </g>
        
        <!-- Right Claw -->
        <g 
          class="claw-right"
          :class="{ 'point-claw': hoveredNodeId === 'astro' }"
          :style="rightClawStyle"
        >
          <path d="M 35,32 L 55,22 L 65,2" fill="none" stroke="var(--muted)" stroke-width="3.2" stroke-linecap="round" />
          <!-- Upper pincer jaw -->
          <path d="M 65,2 C 72,-10 55,-16 48,-6" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" />
          <!-- Lower pincer jaw -->
          <path d="M 65,2 C 72,12 55,18 48,8" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" />
          <!-- Joint marker -->
          <circle cx="65" cy="2" r="2.5" fill="var(--bg)" stroke="var(--accent)" stroke-width="1.2" />
        </g>
      </g>
 
      <!-- Stalk Eyes -->
      <g class="eyes-group">
        <!-- Left Eye Stalk -->
        <g class="eye-stalk-left">
          <line x1="-12" y1="12" x2="-14" y2="-8" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="-14" cy="-8" r="6.5" fill="var(--surface-elevated)" stroke="var(--muted)" stroke-width="1.5" class="eye-bulb" />
          <!-- Pupil (tracks cursor) -->
          <circle 
            :cx="-14 + pupilOffset.x" 
            :cy="-8 + pupilOffset.y" 
            r="2.5" 
            fill="var(--accent)" 
            class="eye-pupil"
            :class="{ 'eye-blinking': isBlinking, 'eye-spinning': hoveredNodeId === 'vue' }"
          />
        </g>
        
        <!-- Right Eye Stalk -->
        <g class="eye-stalk-right">
          <line x1="12" y1="12" x2="14" y2="-8" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="14" cy="-8" r="6.5" fill="var(--surface-elevated)" stroke="var(--muted)" stroke-width="1.5" class="eye-bulb" />
          <!-- Pupil (tracks cursor) -->
          <circle 
            :cx="14 + pupilOffset.x" 
            :cy="-8 + pupilOffset.y" 
            r="2.5" 
            fill="var(--accent)" 
            class="eye-pupil"
            :class="{ 'eye-blinking': isBlinking, 'eye-spinning': hoveredNodeId === 'vue' }"
          />
        </g>
      </g>
    </svg>

    <!-- Floating Bubble Notification (Easter Egg hint / dialog) -->
    <transition name="fade">
      <div v-if="bubbleText" class="crab-bubble">
        <span class="bubble-arrow"></span>
        <p>{{ bubbleText }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps, watch } from 'vue';

const props = defineProps<{
  hoveredNodeId?: string | null;
  activeNodeId?: string | null;
  variant?: 'hero' | 'dock' | 'guide' | 'search';
  searchActive?: boolean;
  locale?: string;
}>();

const crabRef = ref<HTMLDivElement | null>(null);

// Stalk eyes cursor tracking
const pupilOffset = ref({ x: 0, y: 0 });
const eyeTarget = { x: 0, y: 0 };

// Blinking & Idle states
const isBlinking = ref(false);
const isDancing = ref(false);
const hoverCount = ref(0);
const bubbleText = ref<string | null>(null);

// Level 02 Unlocked state
const systemsBoosted = ref(false);

// Dynamic reactive leaning
const bodyStyle = computed(() => {
  if (props.hoveredNodeId === 'astro') {
    return { transform: 'skewX(-6deg) translateY(-2px)', transition: 'transform 0.3s ease' };
  }
  if (props.hoveredNodeId === 'infrastructure') {
    return { transform: 'skewX(6deg) translateY(-2px)', transition: 'transform 0.3s ease' };
  }
  return {};
});

// Dynamic claw rotations
const leftClawStyle = computed(() => {
  if (props.hoveredNodeId === 'proxmox') {
    return { transform: 'rotate(-12deg) translate(-5px, -5px)', transformOrigin: '-35px 32px', transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' };
  }
  return {};
});

const rightClawStyle = computed(() => {
  if (props.hoveredNodeId === 'automation') {
    return { transform: 'rotate(12deg) translate(5px, -5px)', transformOrigin: '35px 32px', transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' };
  }
  return {};
});

// Cursor Tracking implementation
const handleMouseMove = (e: MouseEvent) => {
  if (isDancing.value || !crabRef.value) return;

  const rect = crabRef.value.getBoundingClientRect();
  const crabX = rect.left + rect.width / 2;
  const crabY = rect.top + rect.height / 2;

  const dx = e.clientX - crabX;
  const dy = e.clientY - crabY;
  const dist = Math.hypot(dx, dy);

  if (dist === 0) return;

  const maxOffset = 2.5; // Max pupil displacement in SVG pixels
  pupilOffset.value = {
    x: (dx / dist) * maxOffset,
    y: (dy / dist) * maxOffset
  };
};

// Periodic eye blinks
let blinkTimer: any = null;
const startBlinkLoop = () => {
  const scheduleBlink = () => {
    const delay = 3000 + Math.random() * 4000;
    blinkTimer = setTimeout(() => {
      isBlinking.value = true;
      setTimeout(() => {
        isBlinking.value = false;
        scheduleBlink();
      }, 150);
    }, delay);
  };
  scheduleBlink();
};

// Easter Egg Level 01: Hover 10 times triggers dance
const handleCrabHover = () => {
  hoverCount.value++;
  if (hoverCount.value === 1) {
    showBubble(props.locale === 'id' ? 'Halo, saya Sentinel!' : 'Hello, I am Sentinel!');
  } else if (hoverCount.value === 5) {
    showBubble(props.locale === 'id' ? 'Terus usap untuk rahasia...' : 'Keep rubbing for a secret...');
  } else if (hoverCount.value >= 10 && !isDancing.value) {
    isDancing.value = true;
    showBubble(props.locale === 'id' ? 'Level 1 Terbuka: Sentinel Dance!' : 'Level 1 Unlocked: Sentinel Dance!');
    setTimeout(() => {
      isDancing.value = false;
      hoverCount.value = 0;
    }, 4000);
  }
};

// Bubble dialogue helper
let bubbleClearTimer: any = null;
const showBubble = (text: string) => {
  bubbleText.value = text;
  clearTimeout(bubbleClearTimer);
  bubbleClearTimer = setTimeout(() => {
    bubbleText.value = null;
  }, 3000);
};

// Check if Level 02 is unlocked (visitor has explored Systems page)
const checkSystemsVisited = () => {
  if (typeof window !== 'undefined') {
    const visited = localStorage.getItem('systems_visited');
    if (visited === 'true') {
      systemsBoosted.value = true;
      if (props.variant === 'guide') {
        showBubble(props.locale === 'id' ? 'Level 2 Terbuka: Aura Sistem Aktif!' : 'Level 2 Unlocked: System Aura Enabled!');
      }
    }
  }
};

// React to node selections in Hero System Map
watch(() => props.hoveredNodeId, (newId) => {
  if (!newId) return;
  
  if (props.locale === 'id') {
    switch (newId) {
      case 'cloudflare': showBubble('Radar Cloudflare aktif!'); break;
      case 'proxmox': showBubble('Hypervisor Proxmox siap!'); break;
      case 'astro': showBubble('Mengarahkan ke Astro!'); break;
      case 'vue': showBubble('UX Klien Vue terdeteksi.'); break;
      case 'ai': showBubble('Sinyal AI berdenyut!'); break;
      case 'automation': showBubble('DevOps siap merespons.'); break;
      case 'search': showBubble('Mengindeks kueri pencarian.'); break;
    }
  } else {
    switch (newId) {
      case 'cloudflare': showBubble('Cloudflare Radar active!'); break;
      case 'proxmox': showBubble('Proxmox Hypervisor alert!'); break;
      case 'astro': showBubble('Leaning into Astro compilation!'); break;
      case 'vue': showBubble('Tracking Vue Client transitions.'); break;
      case 'ai': showBubble('Edge AI signal active!'); break;
      case 'automation': showBubble('DevOps triggers ready.'); break;
      case 'search': showBubble('Indexing fuzzy search query.'); break;
    }
  }
});

// React to search triggers (Easter Egg Level 03)
watch(() => props.searchActive, (active) => {
  if (active) {
    showBubble(props.locale === 'id' ? 'Level 3 Terbuka: Pencarian Sinyal Cepat!' : 'Level 3 Unlocked: High Speed Search!');
  }
});

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  startBlinkLoop();
  checkSystemsVisited();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  clearTimeout(blinkTimer);
  clearTimeout(bubbleClearTimer);
});
</script>

<style scoped>
.sentinel-crab-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.sentinel-crab-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Variant layout variations */
.sentinel-crab-container.hero {
  width: 160px;
  height: 160px;
}

.sentinel-crab-container.dock {
  width: 60px;
  height: 50px;
  position: absolute;
  bottom: calc(100% - 6px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
}

.sentinel-crab-container.dock .sentinel-crab-svg {
  transform: translateY(18px); /* Peeking offset */
  transition: transform 0.3s ease;
}

.sentinel-crab-container.dock:hover .sentinel-crab-svg {
  transform: translateY(0); /* Peek fully on hover */
}

.sentinel-crab-container.guide {
  width: 130px;
  height: 130px;
  margin: 0 auto;
}

.sentinel-crab-container.search {
  width: 60px;
  height: 60px;
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

/* Light mode overrides for carapace & bulbs to stand out */
:global([data-theme="light"]) .carapace {
  fill: var(--surface) !important;
}
:global([data-theme="light"]) .eye-bulb {
  fill: var(--surface) !important;
}

/* ---------------- CSS Keyframe Animations (Idle Breathing) ---------------- */
.carapace, .body-core-group {
  animation: breathing 4s infinite ease-in-out;
  transform-origin: 0 45px;
}

@keyframes breathing {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.02) translateY(-1px); }
}

/* Legs crawling micro-animations */
.leg-l1, .leg-r3 { animation: leg-wiggle-1 5s infinite ease-in-out; }
.leg-l3, .leg-r1 { animation: leg-wiggle-2 4.5s infinite ease-in-out; }
.leg-l2, .leg-r2 { animation: leg-wiggle-3 6s infinite ease-in-out; }

@keyframes leg-wiggle-1 {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-1.5deg); }
}
@keyframes leg-wiggle-2 {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(1.5deg); }
}
@keyframes leg-wiggle-3 {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-1deg) translateY(0.5px); }
}

/* Antenna oscillating */
.ant-l, .ant-node-l { animation: antenna-l 6s infinite ease-in-out; transform-origin: -6px 12px; }
.ant-r, .ant-node-r { animation: antenna-r 5.5s infinite ease-in-out; transform-origin: 6px 12px; }

@keyframes antenna-l {
  0%, 100% { transform: skewX(0deg); }
  50% { transform: skewX(-2deg); }
}
@keyframes antenna-r {
  0%, 100% { transform: skewX(0deg); }
  50% { transform: skewX(2deg); }
}

/* Blinking eyes */
.eye-pupil.eye-blinking {
  transform: scaleY(0);
  transform-origin: center;
}

/* Spinning Vue eyes */
.eye-pupil.eye-spinning {
  animation: vue-spin 1.5s infinite linear;
}
@keyframes vue-spin {
  from { transform: rotate(0deg) translateX(1.5px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(1.5px) rotate(-360deg); }
}

/* Radar pulse animation for Cloudflare Node */
.radar-wave {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5px;
  transform-origin: 0 -25px;
  animation: radar-pulse 2s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
  opacity: 0;
}
.wave-1 { animation-delay: 0s; }
.wave-2 { animation-delay: 0.6s; }
.wave-3 { animation-delay: 1.2s; }

@keyframes radar-pulse {
  0% { transform: scale(0.4); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* Floating particles */
.particle {
  fill: var(--accent);
  opacity: 0.35;
  animation: float-particle 4s infinite ease-in-out;
}
.p-1 { animation-delay: 0s; }
.p-2 { animation-delay: 1s; }
.p-3 { animation-delay: 2s; }
.p-4 { animation-delay: 3s; }

@keyframes float-particle {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.35; }
  50% { transform: translateY(-4px) scale(1.15); opacity: 0.6; }
}

/* ---------------- Easter Egg Boosts & Dances ---------------- */
.aura-glow {
  opacity: 0;
  transition: opacity 1s ease;
}
.systems-boosted .aura-glow {
  opacity: 1;
}

/* Sentinel Dance */
.dancing .sentinel-crab-svg {
  animation: crab-dance 0.8s infinite alternate ease-in-out;
  transform-origin: center bottom;
}

@keyframes crab-dance {
  0% { transform: scaleY(1) rotate(-8deg) translateX(-6px); }
  100% { transform: scaleY(1.08) rotate(8deg) translateX(6px); }
}

/* Searching active */
.searching-active .antennas-group {
  animation: searching-flash 0.3s infinite alternate;
}
@keyframes searching-flash {
  from { opacity: 0.4; }
  to { opacity: 1; }
}

/* ---------------- Floating Dialogue Bubble ---------------- */
.crab-bubble {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 26, 44, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.8rem;
  width: max-content;
  max-width: 180px;
  box-shadow: var(--shadow-sm);
  z-index: 100;
  pointer-events: none;
}

:global([data-theme="light"]) .crab-bubble {
  background: rgba(255, 255, 255, 0.95);
}

.crab-bubble p {
  margin: 0;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
  text-align: center;
}

.bubble-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: var(--border) transparent transparent transparent;
}

.bubble-arrow::after {
  content: '';
  position: absolute;
  top: -6px;
  left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(18, 26, 44, 0.95) transparent transparent transparent;
}

:global([data-theme="light"]) .bubble-arrow::after {
  border-color: rgba(255, 255, 255, 0.95) transparent transparent transparent;
}
</style>
