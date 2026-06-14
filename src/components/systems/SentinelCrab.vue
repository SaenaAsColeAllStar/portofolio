<template>
  <div 
    class="sentinel-crab-container" 
    :class="[
      variant, 
      { 
        'active-react': activeNodeId || hoveredNodeId,
        'dancing': isDancing || isCelebrating,
        'systems-boosted': systemsBoosted,
        'searching-active': searchActive,
        'sentinel-mode': personalityMode === 'sentinel'
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
          <path d="M -32,38 L -50,50 L -62,65" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-l1" :style="getLegStyle(0)" />
          <path d="M -28,43 L -46,57 L -56,74" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-l2" :style="getLegStyle(1)" />
          <path d="M -24,46 L -38,60 L -45,78" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-l3" :style="getLegStyle(2)" />
        </g>
        <!-- Right Legs -->
        <g class="right-legs">
          <path d="M 32,38 L 50,50 L 62,65" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-r1" :style="getLegStyle(3)" />
          <path d="M 28,43 L 46,57 L 56,74" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-r2" :style="getLegStyle(4)" />
          <path d="M 24,46 L 38,60 L 45,78" fill="none" stroke="var(--muted)" stroke-width="2.5" stroke-linecap="round" class="leg leg-r3" :style="getLegStyle(5)" />
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

        <!-- AI scan line overlay inside body -->
        <line 
          x1="-38" 
          :y1="aiScanY" 
          x2="38" 
          :y2="aiScanY" 
          stroke="var(--success)" 
          stroke-width="1.5" 
          opacity="0.8" 
          v-if="(hoveredNodeId === 'ai' || activeNodeId === 'ai') && !prefersReducedMotion" 
        />
      </g>

      <!-- Vue Concentric Ripple (Behind antennas/claws but centered around core carapace) -->
      <circle 
        cx="0" 
        cy="35" 
        :r="vueRippleRadius" 
        fill="none" 
        stroke="var(--accent)" 
        stroke-width="1.5" 
        :opacity="vueRippleOpacity" 
        v-if="(hoveredNodeId === 'vue' || activeNodeId === 'vue') && !prefersReducedMotion" 
      />

      <!-- Astro Orbiting Particle (circling carapace core) -->
      <g class="astro-orbit" v-if="(hoveredNodeId === 'astro' || activeNodeId === 'astro') && !prefersReducedMotion">
        <ellipse 
          cx="0" 
          cy="30" 
          rx="38" 
          ry="14" 
          fill="none" 
          stroke="var(--accent)" 
          stroke-width="1" 
          stroke-dasharray="3 3" 
          opacity="0.6" 
        />
        <circle 
          :cx="orbitParticlePos.cx" 
          :cy="orbitParticlePos.cy" 
          r="3.5" 
          fill="var(--accent)" 
        />
      </g>
 
      <!-- Antenna Signals -->
      <g class="antennas-group" :class="{ 'antenna-alert': hoveredNodeId === 'ai' }">
        <!-- Left Antenna -->
        <line x1="-6" y1="12" x2="-8" y2="-20" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="1.5 1.5" class="antenna ant-l" :style="leftAntennaStyle" />
        <circle cx="-8" cy="-20" r="2" fill="var(--accent)" class="antenna-node ant-node-l" :style="leftAntennaStyle" />
        
        <!-- Right Antenna -->
        <line x1="6" y1="12" x2="8" y2="-20" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="1.5 1.5" class="antenna ant-r" :style="rightAntennaStyle" />
        <circle cx="8" cy="-20" r="2" fill="var(--accent)" class="antenna-node ant-node-r" :style="rightAntennaStyle" />
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
        <g class="eye-stalk-left" :style="leftEyeStalkStyle">
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
        <g class="eye-stalk-right" :style="rightEyeStalkStyle">
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
    <div 
      v-if="bubbleText" 
      class="crab-bubble"
      :style="{ transform: `translateX(-50%) scale(${bubbleScale})`, opacity: bubbleScale }"
    >
      <span class="bubble-arrow"></span>
      <p>{{ bubbleText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps, watch } from 'vue';
import { createStateMachine } from '../animation/state-machine/stateMachine';
import { useCursorAwareness } from '../animation/interactions/cursorAwareness';
import { Spring } from '../animation/physics/spring';
import { useInteractionMemory } from '../animation/orchestration/interactionMemory';

const props = defineProps<{
  hoveredNodeId?: string | null;
  activeNodeId?: string | null;
  variant?: 'hero' | 'dock' | 'guide' | 'search';
  searchActive?: boolean;
  locale?: string;
}>();

const crabRef = ref<HTMLDivElement | null>(null);

// State Machine System
const { currentState, transitionTo } = createStateMachine('idle');

// Cursor Awareness System (detection zones 1-4)
const { zone, distance, relativeCoords } = useCursorAwareness(crabRef, {
  nearbyRadius: props.variant === 'dock' ? 120 : 240,
  activeRadius: props.variant === 'dock' ? 40 : 70
});

// Reduced Motion Media Query ref
const prefersReducedMotion = ref(false);
let mediaQueryList: MediaQueryList | null = null;

const handleReduceMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
  prefersReducedMotion.value = e.matches;
};

// Unified Animation & Inactivity ticks
let tickAnimFrame: number;
const bubbleScale = ref(0);
const bubbleSpring = new Spring(0, { stiffness: 140, damping: 14 });

// Breathing variables
let breathingTime = 0;
let breathingStep = (2 * Math.PI) / (4.5 * 60); // Initial 4.5 seconds duration
const breathingScale = ref(1);
const breathingTranslateY = ref(0);

// Claw Drift variables
const leftClawDrift = ref({ rotate: 0, x: 0, y: 0 });
const rightClawDrift = ref({ rotate: 0, x: 0, y: 0 });

// Antenna Skew variables
const leftAntennaSkew = ref(0);
const rightAntennaSkew = ref(0);

// Leg Springs & Rotation variables
const legSprings = Array.from({ length: 6 }, () => new Spring(0, { stiffness: 180, damping: 12 }));
const legRotations = ref([0, 0, 0, 0, 0, 0]);
let nextLegTime = Date.now() + 5000;

// Dynamic Leaning Springs (carapace tilt)
const leanXSpring = new Spring(0, { stiffness: 80, damping: 14 });
const leanYSpring = new Spring(0, { stiffness: 80, damping: 14 });
const leanX = ref(0);
const leanY = ref(0);

// Saccadic Pupil tracking springs (Problem 02)
const currentPupilX = ref(0);
const currentPupilY = ref(0);
const pupilXSpring = new Spring(0, { stiffness: 220, damping: 18 });
const pupilYSpring = new Spring(0, { stiffness: 220, damping: 18 });
let nextSaccadeTime = 0;
let saccadeTargetX = 0;
let saccadeTargetY = 0;

// Dance state sequencing (Problem 03)
const danceState = ref<'none' | 'notice' | 'prepare' | 'dancing' | 'recover'>('none');

// User Inactivity trackers
const idleTime = ref(0);
const randomLookOffset = ref({ x: 0, y: 0 });
let nextLookTime = 0;

// Context awareness visual engines
const astroOrbitAngle = ref(0);
const vueRippleRadius = ref(0);
const vueRippleOpacity = ref(0);
const aiScanY = ref(12);
const aiScanDir = ref(1);

// Personality state
const personalityMode = ref<'curious' | 'sentinel' | 'playful'>('curious');
let personalityTimer: any = null;

// Celebration States
const isCelebrating = ref(false);

const resetIdleTime = () => {
  idleTime.value = 0;
};

// Secondary body tilt when claws move (Problem 04)
const bodySecondarySkew = computed(() => {
  let skew = 0;
  if (props.hoveredNodeId === 'proxmox') {
    skew = 3; // Tilt body slightly to right to balance left claw extension
  } else if (props.hoveredNodeId === 'automation') {
    skew = -3; // Tilt body slightly to left to balance right claw extension
  }
  
  if (idleTime.value >= 30 && (Math.floor(idleTime.value) % 10) < 3) {
    // Sway body in sync with claw wave
    skew = Math.sin(Date.now() * 0.01) * 2;
  }
  return skew;
});

// 60FPS tick solver
const tick = () => {
  // 1. Spring-driven dialogue bubble scale
  bubbleSpring.update(0.016);
  bubbleScale.value = bubbleSpring.value;

  // If reduced motion is requested, fall back to flat values
  if (prefersReducedMotion.value) {
    breathingScale.value = 1;
    breathingTranslateY.value = 0;
    leftClawDrift.value = { rotate: 0, x: 0, y: 0 };
    rightClawDrift.value = { rotate: 0, x: 0, y: 0 };
    leftAntennaSkew.value = 0;
    rightAntennaSkew.value = 0;
    legRotations.value = [0, 0, 0, 0, 0, 0];
    leanX.value = 0;
    leanY.value = 0;
    idleTime.value = 0;
    currentPupilX.value = 0;
    currentPupilY.value = 0;
  } else {
    const now = Date.now() * 0.001;

    // 2. Body Breathing (Phase 01)
    breathingTime += breathingStep;
    if (breathingTime >= 2 * Math.PI) {
      breathingTime -= 2 * Math.PI;
      const duration = 4.0 + Math.random() * 3.0; // Random cycle 4-7s
      breathingStep = (2 * Math.PI) / (duration * 60);
    }
    breathingScale.value = 1 + Math.sin(breathingTime) * 0.012;
    breathingTranslateY.value = Math.sin(breathingTime) * -0.6;

    // 3. Claw Idle Drift (Phase 01) - only when not dancing/celebrating
    if (currentState.value === 'idle' || currentState.value === 'observe') {
      leftClawDrift.value = {
        rotate: Math.sin(now * 0.8) * 1.5,
        x: Math.sin(now * 0.5) * 0.4,
        y: Math.cos(now * 0.7) * 0.5
      };
      rightClawDrift.value = {
        rotate: Math.cos(now * 0.9) * 1.5,
        x: Math.cos(now * 0.6) * 0.4,
        y: Math.sin(now * 0.8) * 0.5
      };
    } else {
      leftClawDrift.value = { rotate: 0, x: 0, y: 0 };
      rightClawDrift.value = { rotate: 0, x: 0, y: 0 };
    }

    // 4. Antenna Slow Oscillation (Phase 01)
    leftAntennaSkew.value = Math.sin(now * 1.2) * 2;
    rightAntennaSkew.value = Math.cos(now * 1.1) * 2;

    // 5. Leg Adjustment wiggles & Dance staggered wiggles (Problem 05)
    if (isDancing.value || isCelebrating.value) {
      // Staggered asynchronous leg wiggles for dance
      const time = now * 12;
      legRotations.value[0] = Math.sin(time) * 5;
      legRotations.value[1] = Math.sin(time + 0.5) * 5;
      legRotations.value[2] = Math.sin(time + 1.0) * 5;
      legRotations.value[3] = Math.cos(time) * 5;
      legRotations.value[4] = Math.cos(time + 0.5) * 5;
      legRotations.value[5] = Math.cos(time + 1.0) * 5;
    } else {
      if (Date.now() > nextLegTime) {
        const idx = Math.floor(Math.random() * 6);
        const dir = Math.random() > 0.5 ? 1 : -1;
        legSprings[idx].setTarget(dir * (2.0 + Math.random() * 3.0));
        setTimeout(() => {
          legSprings[idx].setTarget(0);
        }, 250);
        nextLegTime = Date.now() + 8000 + Math.random() * 7000; // 8-15 seconds
      }
      legSprings.forEach((spring, idx) => {
        spring.update(0.016);
        legRotations.value[idx] = spring.value;
      });
    }

    // 6. Dynamic Lean Calculations (Phase 02)
    let targetLeanX = 0;
    let targetLeanY = 0;
    if (zone.value >= 2 && zone.value <= 3) {
      const dx = relativeCoords.value.x;
      const dy = relativeCoords.value.y;
      const d = distance.value || 1;
      targetLeanX = (dx / d) * 6;  // skewX
      targetLeanY = (dy / d) * -3; // translateY
    }
    
    // Squash/stretch overrides driven by dance sequencing (Problem 03)
    if (danceState.value === 'notice') {
      targetLeanY = 4; // Squash body
      targetLeanX = 0;
    } else if (danceState.value === 'prepare') {
      targetLeanY = -8; // Stretch up
      targetLeanX = 0;
    } else if (danceState.value === 'recover') {
      targetLeanY = 6; // Land squash
      targetLeanX = 0;
    }

    leanXSpring.setTarget(targetLeanX);
    leanYSpring.setTarget(targetLeanY);
    leanXSpring.update(0.016);
    leanYSpring.update(0.016);
    leanX.value = leanXSpring.value;
    leanY.value = leanYSpring.value;

    // 7. Natural Saccadic Eye Movement (Problem 02)
    if (isDancing.value || isCelebrating.value) {
      pupilXSpring.setTarget(0);
      pupilYSpring.setTarget(0);
    } else if (zone.value >= 2) {
      // User is active/nearby: track cursor with saccadic jumps & pause hesitation
      if (Date.now() > nextSaccadeTime) {
        const maxOffset = props.variant === 'dock' ? 1.5 : 2.5;
        const dx = relativeCoords.value.x;
        const dy = relativeCoords.value.y;
        const d = distance.value || 1;
        
        // Target is the cursor angle, but only updated at intervals
        // Add tiny imperfection (Phase 04/Problem 05)
        const imperfectionX = (Math.random() - 0.5) * 0.4;
        const imperfectionY = (Math.random() - 0.5) * 0.4;
        
        saccadeTargetX = (dx / d) * maxOffset + imperfectionX;
        saccadeTargetY = (dy / d) * maxOffset + imperfectionY;
        
        // Random pause between saccades (hesitate/inspect: 400ms - 1000ms)
        nextSaccadeTime = Date.now() + 400 + Math.random() * 600;
      }
      pupilXSpring.setTarget(saccadeTargetX);
      pupilYSpring.setTarget(saccadeTargetY);
    } else {
      // Idle look behavior pool (Problem 06 & Problem 02)
      if (Date.now() > nextSaccadeTime) {
        const rand = Math.random();
        if (rand < 0.60) {
          // Idle A: Look Straight (60%)
          saccadeTargetX = 0;
          saccadeTargetY = 0;
          nextSaccadeTime = Date.now() + 3000 + Math.random() * 4000;
        } else if (rand < 0.80) {
          // Idle B: Look Left (20%)
          saccadeTargetX = -2;
          saccadeTargetY = 0.3;
          nextSaccadeTime = Date.now() + 1500 + Math.random() * 2000;
        } else if (rand < 0.95) {
          // Idle C: Look Right (15%)
          saccadeTargetX = 2;
          saccadeTargetY = 0.3;
          nextSaccadeTime = Date.now() + 1500 + Math.random() * 2000;
        } else {
          // Idle D: Look Up/Inspect (5%)
          saccadeTargetX = 0;
          saccadeTargetY = -1.8;
          nextSaccadeTime = Date.now() + 1000 + Math.random() * 1000;
        }
      }
      pupilXSpring.setTarget(saccadeTargetX);
      pupilYSpring.setTarget(saccadeTargetY);
    }

    pupilXSpring.update(0.016);
    pupilYSpring.update(0.016);
    currentPupilX.value = pupilXSpring.value;
    currentPupilY.value = pupilYSpring.value;

    // 8. Inactivity tracker
    idleTime.value += 0.016;

    // 9. Context aware animation loops (Phase 05)
    if (props.hoveredNodeId === 'astro' || props.activeNodeId === 'astro') {
      astroOrbitAngle.value += 0.04;
    }
    if (props.hoveredNodeId === 'vue' || props.activeNodeId === 'vue') {
      vueRippleRadius.value += 1.2;
      if (vueRippleRadius.value > 42) {
        vueRippleRadius.value = 5;
      }
      vueRippleOpacity.value = Math.max(0, 0.8 - (vueRippleRadius.value / 42));
    }
    if (props.hoveredNodeId === 'ai' || props.activeNodeId === 'ai') {
      aiScanY.value += aiScanDir.value * 0.8;
      if (aiScanY.value > 56) {
        aiScanY.value = 56;
        aiScanDir.value = -1;
      } else if (aiScanY.value < 14) {
        aiScanY.value = 14;
        aiScanDir.value = 1;
      }
    }
  }

  tickAnimFrame = requestAnimationFrame(tick);
};

// Leg Style helper (with dynamic secondary motion body-tilt leg-compression compensation)
const getLegStyle = (idx: number) => {
  const baseSkew = leanX.value + bodySecondarySkew.value;
  // Apply rotation compensation dynamically so legs compress/stretch in tilt direction
  const rot = (legRotations.value[idx] || 0) + baseSkew * 0.7;
  
  let origin = '0px 0px';
  if (idx === 0) origin = '-32px 38px';
  else if (idx === 1) origin = '-28px 43px';
  else if (idx === 2) origin = '-24px 46px';
  else if (idx === 3) origin = '32px 38px';
  else if (idx === 4) origin = '28px 43px';
  else if (idx === 5) origin = '24px 46px';

  return {
    transform: `rotate(${rot}deg)`,
    transformOrigin: origin,
    transition: 'transform 0.05s linear'
  };
};

// Interaction Memory System
const memory = useInteractionMemory();

// Blinking & Idle states
const isBlinking = ref(false);
const isDancing = ref(false);
const hoverCount = ref(0);
const bubbleText = ref<string | null>(null);

// Level 02 Unlocked state
const systemsBoosted = ref(false);

// Dynamic reactive leaning (includes secondary motion body-tilt)
const bodyStyle = computed(() => {
  if (isDancing.value || isCelebrating.value) return {};

  const scale = breathingScale.value;
  const transY = breathingTranslateY.value + leanY.value;
  const skewX = leanX.value + bodySecondarySkew.value;

  // Base node leaning
  let staticSkew = 0;
  if (props.hoveredNodeId === 'astro') staticSkew = -6;
  if (props.hoveredNodeId === 'infrastructure') staticSkew = 6;

  return {
    transform: `translateY(${transY}px) scale(${scale}) skewX(${skewX + staticSkew}deg)`,
    transformOrigin: '0 45px',
    transition: 'transform 0.05s linear'
  };
});

// Dynamic claw rotations with staggered dance wiggles (Problem 05 / Problem 03)
const leftClawStyle = computed(() => {
  let baseRotate = 0;
  let baseTranslateX = 0;
  let baseTranslateY = 0;

  if (isDancing.value || isCelebrating.value) {
    const time = Date.now() * 0.012;
    baseRotate = -10 + Math.sin(time) * 15;
    baseTranslateY = -4 + Math.sin(time) * 4;
  } else if (props.hoveredNodeId === 'proxmox') {
    baseRotate = -12;
    baseTranslateX = -5;
    baseTranslateY = -5;
  } else if (personalityMode.value === 'sentinel') {
    baseRotate = -6;
    baseTranslateY = -2;
  } else if (idleTime.value >= 30 && (Math.floor(idleTime.value) % 10) < 3) {
    // Wave left claw
    const waveAngle = Math.sin(Date.now() * 0.01) * 8;
    baseRotate = -14 + waveAngle;
    baseTranslateY = -6;
  }

  const r = baseRotate + leftClawDrift.value.rotate;
  const tx = baseTranslateX + leftClawDrift.value.x;
  const ty = baseTranslateY + leftClawDrift.value.y;

  return {
    transform: `translate(${tx}px, ${ty}px) rotate(${r}deg)`,
    transformOrigin: '-35px 32px',
    transition: isCelebrating.value || isDancing.value || (idleTime.value >= 30 && (Math.floor(idleTime.value) % 10) < 3)
      ? 'transform 0.08s linear'
      : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
  };
});

const rightClawStyle = computed(() => {
  let baseRotate = 0;
  let baseTranslateX = 0;
  let baseTranslateY = 0;

  if (isDancing.value || isCelebrating.value) {
    const time = Date.now() * 0.012;
    baseRotate = 10 + Math.cos(time + 0.5) * 15; // Phase offset imperfection (Problem 05)
    baseTranslateY = -4 + Math.cos(time + 0.5) * 4;
  } else if (props.hoveredNodeId === 'automation') {
    baseRotate = 12;
    baseTranslateX = 5;
    baseTranslateY = -5;
  } else if (personalityMode.value === 'sentinel') {
    baseRotate = 6;
    baseTranslateY = -2;
  }

  const r = baseRotate + rightClawDrift.value.rotate;
  const tx = baseTranslateX + rightClawDrift.value.x;
  const ty = baseTranslateY + rightClawDrift.value.y;

  return {
    transform: `translate(${tx}px, ${ty}px) rotate(${r}deg)`,
    transformOrigin: '35px 32px',
    transition: isCelebrating.value || isDancing.value
      ? 'transform 0.08s linear'
      : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
  };
});

// Dynamic skewing for eye stalks to look organic (includes secondary tilt)
const leftEyeStalkStyle = computed(() => {
  if (prefersReducedMotion.value) return {};
  const skew = (leanX.value + bodySecondarySkew.value) * 0.6;
  return {
    transform: `skewX(${skew}deg)`,
    transformOrigin: '-12px 12px',
    transition: 'transform 0.05s linear'
  };
});

const rightEyeStalkStyle = computed(() => {
  if (prefersReducedMotion.value) return {};
  const skew = (leanX.value + bodySecondarySkew.value) * 0.6;
  return {
    transform: `skewX(${skew}deg)`,
    transformOrigin: '12px 12px',
    transition: 'transform 0.05s linear'
  };
});

// Antenna dynamic styles
const leftAntennaStyle = computed(() => {
  return {
    transform: `skewX(${leftAntennaSkew.value}deg)`,
    transformOrigin: '-6px 12px',
    transition: 'transform 0.05s linear'
  };
});

const rightAntennaStyle = computed(() => {
  return {
    transform: `skewX(${rightAntennaSkew.value}deg)`,
    transformOrigin: '6px 12px',
    transition: 'transform 0.05s linear'
  };
});

// Astro orbit particle position calculation
const orbitParticlePos = computed(() => {
  const angle = astroOrbitAngle.value;
  return {
    cx: Math.cos(angle) * 38,
    cy: 30 + Math.sin(angle) * 14
  };
});

// Stalk eyes cursor tracking (uses currentPupilX/Y from tick loop solver)
const pupilOffset = computed(() => {
  return {
    x: currentPupilX.value,
    y: currentPupilY.value
  };
});

// Watch spatial zones to drive FSM transitions with reaction chain delays (Phase 03)
let reactionTimeout: any = null;
watch(zone, (newZone) => {
  clearTimeout(reactionTimeout);
  if (isDancing.value || isCelebrating.value) {
    transitionTo('celebrate');
    return;
  }

  if (newZone === 4) {
    // Notice -> Pause -> Inspect -> React -> Settle chain
    transitionTo('observe');
    reactionTimeout = setTimeout(() => {
      transitionTo('inspect');
      
      // Perform claw/antenna micro wiggles on inspect trigger
      nextLegTime = Date.now(); // Trigger immediate leg wiggles
      
      reactionTimeout = setTimeout(() => {
        transitionTo('signal');
      }, 350);
    }, 180);
  } else if (newZone === 3) {
    transitionTo('observe');
    reactionTimeout = setTimeout(() => {
      transitionTo('inspect');
    }, 200);
  } else if (newZone === 2) {
    transitionTo('observe');
  } else {
    transitionTo('idle');
  }
});

// Periodic eye blinks (Type A/B/C System with 8-40s delay - Problem 01)
let blinkTimer: any = null;
const startBlinkLoop = () => {
  const scheduleBlink = () => {
    // Timing rule: 8 to 40 seconds window
    const delay = 8000 + Math.random() * 32000;
    
    blinkTimer = setTimeout(() => {
      const rand = Math.random();
      if (rand < 0.70) {
        // Type A: Normal Blink (70%)
        isBlinking.value = true;
        setTimeout(() => {
          isBlinking.value = false;
          scheduleBlink();
        }, 150);
      } else if (rand < 0.90) {
        // Type B: Fast Blink (20%)
        isBlinking.value = true;
        setTimeout(() => {
          isBlinking.value = false;
          scheduleBlink();
        }, 80);
      } else {
        // Type C: Double Blink (10%)
        isBlinking.value = true;
        setTimeout(() => {
          isBlinking.value = false;
          setTimeout(() => {
            isBlinking.value = true;
            setTimeout(() => {
              isBlinking.value = false;
              scheduleBlink();
            }, 120);
          }, 150); // Pause between blinks
        }, 120);
      }
    }, delay);
  };
  scheduleBlink();
};

// Natural Dance Sequence (Problem 03)
const runDanceSequence = () => {
  danceState.value = 'notice';
  
  // Notice phase: squash body
  leanYSpring.setTarget(4);
  
  setTimeout(() => {
    if (danceState.value !== 'notice') return;
    danceState.value = 'prepare';
    // Prepare phase: raise claws, stretch body up
    leanYSpring.setTarget(-8);
    
    setTimeout(() => {
      if (danceState.value !== 'prepare') return;
      danceState.value = 'dancing';
      isDancing.value = true;
      
      setTimeout(() => {
        // Recover phase: overshoot body squash and settle back to normal
        isDancing.value = false;
        danceState.value = 'recover';
        leanYSpring.setTarget(6); // Squash on land
        
        setTimeout(() => {
          danceState.value = 'none';
          leanYSpring.setTarget(0); // Settle to normal
          hoverCount.value = 0;
        }, 500); // Settle duration
      }, 3500); // Dance duration
    }, 350); // Prepare duration
  }, 250); // Notice duration
};

// Easter Egg Level 01: Hover 10 times triggers dance
const handleCrabHover = () => {
  resetIdleTime();
  hoverCount.value++;
  if (hoverCount.value === 1) {
    // Greet and query memory on first hover
    const viewedCount = memory.totalVisitedNodesCount();
    if (viewedCount > 0) {
      showBubble(props.locale === 'id' 
        ? `Senang melihat Anda kembali! Anda sudah mengamati ${viewedCount} node.` 
        : `Great to see you again! You've mapped ${viewedCount} nodes.`);
    } else {
      showBubble(props.locale === 'id' ? 'Halo, saya Sentinel!' : 'Hello, I am Sentinel!');
    }
  } else if (hoverCount.value === 5) {
    // Check if they viewed Proxmox
    if (memory.isNodeViewed('proxmox')) {
      showBubble(props.locale === 'id' ? 'Saya ingat Anda membuka Proxmox VE!' : 'I remember you checking Proxmox VE!');
    } else {
      showBubble(props.locale === 'id' ? 'Terus usap untuk rahasia...' : 'Keep rubbing for a secret...');
    }
  } else if (hoverCount.value >= 10 && danceState.value === 'none') {
    showBubble(props.locale === 'id' ? 'Level 1 Terbuka: Sentinel Dance!' : 'Level 1 Unlocked: Sentinel Dance!');
    runDanceSequence();
  }
};

// Bubble dialogue helper
let bubbleClearTimer: any = null;
const showBubble = (text: string) => {
  bubbleText.value = text;
  bubbleSpring.setTarget(1);
  clearTimeout(bubbleClearTimer);
  bubbleClearTimer = setTimeout(() => {
    bubbleSpring.setTarget(0);
    setTimeout(() => {
      bubbleText.value = null;
    }, 300); // Wait for spring to settle scale to 0
  }, 3200);
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

// Rotate personality modes (Phase 04)
const showPersonalityDialogue = () => {
  if (prefersReducedMotion.value) return;
  const isId = props.locale === 'id';
  
  if (personalityMode.value === 'sentinel') {
    const quotes = isId
      ? ["Firewall sistem nominal.", "Kluster Proxmox aman.", "Semua mesin kontainer normal."]
      : ["System firewalls are nominal.", "Proxmox cluster CPU load: 12%. All green.", "Docker node egress routing stable."];
    showBubble(quotes[Math.floor(Math.random() * quotes.length)]);
  } else if (personalityMode.value === 'curious') {
    const quotes = isId
      ? ["Teknologi apa yang menjalankan halaman ini?", "Tahukah Anda situs ini dibuat dengan Astro?", "Mari jelajahi Garis Waktu Proyek."]
      : ["What technologies power this page?", "Did you know this site is fully static-generated?", "I'm checking out the Project timeline."];
    showBubble(quotes[Math.floor(Math.random() * quotes.length)]);
  } else if (personalityMode.value === 'playful') {
    const quotes = isId
      ? ["Tos capit! Klik saya!", "Sudahkah Anda membuka level rahasia?", "Latihan kaki selesai! 60 FPS tercapai."]
      : ["Pincer-high-five! Click me!", "Have you found all secret levels yet?", "Leg exercise complete! 60 FPS achieved."];
    showBubble(quotes[Math.floor(Math.random() * quotes.length)]);
  }
};

const rotatePersonality = () => {
  const modes: ('curious' | 'sentinel' | 'playful')[] = ['curious', 'sentinel', 'playful'];
  const available = modes.filter(m => m !== personalityMode.value);
  personalityMode.value = available[Math.floor(Math.random() * available.length)];
  
  // Show dialogue bubble representing mode change
  showPersonalityDialogue();
  
  personalityTimer = setTimeout(rotatePersonality, 35000 + Math.random() * 20000);
};

// React to node selections in Hero System Map
watch(() => props.hoveredNodeId, (newId) => {
  if (!newId) return;
  resetIdleTime();

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
    resetIdleTime();
    showBubble(props.locale === 'id' ? 'Level 3 Terbuka: Pencarian Sinyal Cepat!' : 'Level 3 Unlocked: High Speed Search!');
  }
});

// Custom window celebration events (Phase 07)
const handleCaseStudyOpen = () => {
  isCelebrating.value = true;
  showBubble(props.locale === 'id' 
    ? "Membuka pola arsitektur desain... Luar biasa!" 
    : "Analyzing architectural design patterns... Incredible!");
  runDanceSequence();
  setTimeout(() => {
    isCelebrating.value = false;
  }, 4500);
};

const handleCommandPaletteOpen = () => {
  isCelebrating.value = true;
  showBubble(props.locale === 'id' 
    ? "Terminal sistem terbuka. Mengakses basis data..." 
    : "System terminal unlocked. Awaiting commands...");
  runDanceSequence();
  setTimeout(() => {
    isCelebrating.value = false;
  }, 4500);
};

const handleArchitectureExplorerStep = (e: any) => {
  isCelebrating.value = true;
  const stepId = e.detail?.stepId || '';
  showBubble(props.locale === 'id' 
    ? `Menganalisis Lapisan: ${stepId.toUpperCase()}...` 
    : `Inspecting Infrastructure Layer: ${stepId.toUpperCase()}...`);
  
  // Do a mini dance/celebrate sequence
  danceState.value = 'notice';
  leanYSpring.setTarget(4);
  setTimeout(() => {
    danceState.value = 'prepare';
    leanYSpring.setTarget(-8);
    setTimeout(() => {
      danceState.value = 'dancing';
      isDancing.value = true;
      setTimeout(() => {
        isDancing.value = false;
        danceState.value = 'recover';
        leanYSpring.setTarget(6);
        setTimeout(() => {
          danceState.value = 'none';
          leanYSpring.setTarget(0);
          isCelebrating.value = false;
        }, 500);
      }, 2000);
    }, 300);
  }, 200);
};

onMounted(() => {
  // Media query checks
  if (typeof window !== 'undefined') {
    mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    handleReduceMotionChange(mediaQueryList);
    mediaQueryList.addEventListener('change', handleReduceMotionChange);

    // Inactivity event listeners
    window.addEventListener('mousemove', resetIdleTime);
    window.addEventListener('keydown', resetIdleTime);
    window.addEventListener('scroll', resetIdleTime);
    window.addEventListener('click', resetIdleTime);
    window.addEventListener('touchstart', resetIdleTime);

    // Custom celebration event listeners
    window.addEventListener('ctos-case-study-opened', handleCaseStudyOpen);
    window.addEventListener('ctos-command-center-opened', handleCommandPaletteOpen);
    window.addEventListener('ctos-architecture-explorer-discovered', handleArchitectureExplorerStep);
  }

  // Animation frame solver
  tick();

  startBlinkLoop();
  checkSystemsVisited();

  // Rotates personality modes periodically
  personalityTimer = setTimeout(rotatePersonality, 45000);
});

onUnmounted(() => {
  cancelAnimationFrame(tickAnimFrame);
  clearTimeout(blinkTimer);
  clearTimeout(bubbleClearTimer);
  clearTimeout(personalityTimer);
  clearTimeout(reactionTimeout);

  if (typeof window !== 'undefined') {
    mediaQueryList?.removeEventListener('change', handleReduceMotionChange);
    window.removeEventListener('mousemove', resetIdleTime);
    window.removeEventListener('keydown', resetIdleTime);
    window.removeEventListener('scroll', resetIdleTime);
    window.removeEventListener('click', resetIdleTime);
    window.removeEventListener('touchstart', resetIdleTime);

    window.removeEventListener('ctos-case-study-opened', handleCaseStudyOpen);
    window.removeEventListener('ctos-command-center-opened', handleCommandPaletteOpen);
    window.removeEventListener('ctos-architecture-explorer-discovered', handleArchitectureExplorerStep);
  }
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

/* Sentinel mode glow styling */
.sentinel-mode .carapace {
  filter: drop-shadow(0 0 4px var(--accent));
  stroke: var(--accent-strong) !important;
  transition: stroke 0.5s ease;
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

/* Vue ripple wave animation */
.vue-ripple {
  animation: ripple-pulse 1.8s infinite ease-out;
  transform-origin: center;
}

/* AI scan line laser animation */
.ai-scan-line {
  stroke-dasharray: 2 2;
  filter: drop-shadow(0 0 2px var(--success));
}

/* ---------------- Easter Egg Boosts & Dances ---------------- */
.aura-glow {
  opacity: 0;
  transition: opacity 1s ease;
}
.systems-boosted .aura-glow {
  opacity: 1;
}

/* Sentinel Dance / Celebrate (Phase 07) */
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
  transform-origin: bottom center;
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

/* Accessibility: Support reduced motion media query */
@media (prefers-reduced-motion: reduce) {
  .particle,
  .radar-wave,
  .eye-pupil,
  .vue-ripple,
  .sentinel-crab-svg {
    animation: none !important;
    transition: none !important;
  }
}
</style>
