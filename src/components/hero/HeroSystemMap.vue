<template>
  <div class="system-map-wrapper" ref="wrapperRef">
    <!-- Interactive SVG Constellation -->
    <div class="svg-container">
      <svg 
        ref="svgRef" 
        viewBox="0 0 600 500" 
        class="network-svg" 
        aria-label="System architecture network map"
      >
        <!-- Glow Filters -->
        <defs>
          <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--accent)" />
            <stop offset="100%" stop-color="var(--accent-strong)" />
          </linearGradient>
        </defs>

        <!-- Static Background Connections -->
        <g class="mesh-lines">
          <HeroConnection 
            v-for="(conn, idx) in connections" 
            :key="idx" 
            :x1="conn.x1" 
            :y1="conn.y1" 
            :x2="conn.x2" 
            :y2="conn.y2" 
          />
        </g>

        <!-- Animated Signals (Flowing packets) -->
        <g class="animated-signals">
          <!-- Spoke signals -->
          <HeroSignal 
            v-for="(spoke, idx) in spokes" 
            :key="`spoke-${idx}`"
            :x1="spoke.x1"
            :y1="spoke.y1"
            :x2="spoke.x2"
            :y2="spoke.y2"
            :spoke-class="`spoke-${idx + 1}`"
          />
          <!-- Ring flow signal -->
          <HeroSignal path-d="M 150 120 L 450 120 L 500 280 L 300 420 L 100 280 Z" />
        </g>

        <!-- Interactive Node Elements -->
        <HeroNode 
          v-for="node in nodes" 
          :key="node.id"
          :data="node"
          :is-active="activeNodeId === node.id"
          :is-hovered="hoveredNodeId === node.id"
          :is-center="node.id === 'architecture'"
          @hover="handleNodeHover"
          @click="handleNodeClick"
        />
      </svg>

      <!-- Tooltip popup -->
      <HeroTooltip 
        :visible="tooltipVisible"
        :x="tooltipX"
        :y="tooltipY"
        :title="hoveredNode?.title || ''"
        :badge="hoveredNode?.subtitle || ''"
        :desc="hoveredNode ? hoveredNode.desc.slice(0, 80) + '...' : ''"
      />
    </div>

    <!-- Details Side Panel / Bottom Drawer -->
    <div 
      class="system-drawer" 
      :class="{ hidden: !drawerVisible }"
      @click.stop
    >
      <div class="drawer-header">
        <div class="drawer-header-left">
          <svg class="drawer-node-icon" width="28" height="28" viewBox="0 0 24 24">
            <path 
              ref="drawerIconPathRef" 
              d="M12 2L22 12L12 22L2 12Z" 
              fill="none" 
              stroke="var(--accent)" 
              stroke-width="1.8" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
          <div>
            <span class="drawer-subtitle">System Node Detail</span>
            <h3>{{ activeNode?.title }}</h3>
          </div>
        </div>
        <button 
          class="close-drawer-btn" 
          aria-label="Close detail panel"
          @click="closeDrawer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div v-if="activeNode" class="drawer-body">
        <p class="drawer-desc">{{ activeNode.desc }}</p>
        
        <HeroStats 
          :metric="activeNode.metric"
          :stack="activeNode.stack"
          :locale="locale"
        />

        <HeroCTA 
          :node-id="activeNode.id"
          :locale="locale"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineProps, watch } from 'vue';
import { morphPath } from '../../lib/motion/svg';
import HeroConnection from './HeroConnection.vue';
import HeroSignal from './HeroSignal.vue';
import HeroNode from './HeroNode.vue';
import HeroTooltip from './HeroTooltip.vue';
import HeroStats from './HeroStats.vue';
import HeroCTA from './HeroCTA.vue';

const props = defineProps<{
  locale: 'en' | 'id';
}>();

// Node metadata containing positions and localized contents
const nodesData = {
  en: [
    {
      id: 'infrastructure',
      x: 150,
      y: 120,
      title: "Infrastructure",
      subtitle: "System Foundations",
      desc: "Bare-metal management, virtualized container engines, and kernel-level configurations tailored for sustained server operations.",
      stack: ["Linux (Ubuntu)", "Docker", "KVM Virtualization", "Systemd Services", "Networking Topology"],
      metric: "99.9% Base Uptime",
      iconType: 'path'
    },
    {
      id: 'cloud',
      x: 450,
      y: 120,
      title: "Cloud & Edge Platforms",
      subtitle: "Distributed Systems",
      desc: "Serverless runtimes deployed globally at edge networks, edge caching routing, DNS management, and pooled database connectivity.",
      stack: ["Cloudflare Workers", "Pages & Hyperdrive", "CDN Caching", "DNS Topology", "Resilient API Routes"],
      metric: "<50ms Global Latency",
      iconType: 'cloud'
    },
    {
      id: 'automation',
      x: 100,
      y: 280,
      title: "Automation & DevOps",
      subtitle: "Continuous Integration",
      desc: "Robust deployment pipelines, schema migration orchestration, shell scripting, and automated systems checkups to eliminate toil.",
      stack: ["GitHub Actions", "Drizzle Kit", "Bash Scripting", "SSH Automation", "Security Auditing"],
      metric: "Zero-Downtime Deploys",
      iconType: 'arrow'
    },
    {
      id: 'ai',
      x: 500,
      y: 280,
      title: "AI Workflows",
      subtitle: "Edge AI Integration",
      desc: "Edge-hosted large language models, structured vector contexts (RAG), multi-agent systems, and context-filtered assistant pipelines.",
      stack: ["Workers AI (Llama 3.1)", "RAG Systems", "Vector Search", "Prompt Engineering", "Security Verification"],
      metric: "Real-time edge responses",
      iconType: 'brain'
    },
    {
      id: 'product',
      x: 300,
      y: 420,
      title: "Product Engineering",
      subtitle: "Frontend & Portals",
      desc: "Stunning glassmorphic user interfaces, responsive grids, cookie-based session engines, and admin dashboards with real-time statistics.",
      stack: ["Astro Framework", "Vanilla CSS & HTML5", "Web Crypto API (HMAC)", "HTML5 Canvas (WebP)", "Session Managers"],
      metric: "Lighthouse Score >= 90",
      iconType: 'monitor'
    },
    {
      id: 'architecture',
      x: 300,
      y: 250,
      title: "System Architecture",
      subtitle: "Orchestration & Design",
      desc: "The coordinating system layer. Focuses on rate limiting, transactional database boundaries, caching topologies, and failure-tolerant code.",
      stack: ["Systems Thinking", "Rate Limiting", "Caching Strategies", "CA Certificates Security", "Observed Telemetry"],
      metric: "Architect-first Design",
      iconType: 'polygon'
    }
  ],
  id: [
    {
      id: 'infrastructure',
      x: 150,
      y: 120,
      title: "Infrastruktur",
      subtitle: "Fondasi Sistem",
      desc: "Pengelolaan bare-metal, mesin kontainer virtual, dan konfigurasi tingkat kernel yang disesuaikan untuk operasi server berkelanjutan.",
      stack: ["Linux (Ubuntu)", "Docker", "KVM Virtualization", "Layanan Systemd", "Topologi Jaringan"],
      metric: "99.9% Uptime Dasar",
      iconType: 'path'
    },
    {
      id: 'cloud',
      x: 450,
      y: 120,
      title: "Platform Cloud & Edge",
      subtitle: "Sistem Terdistribusi",
      desc: "Runtime serverless yang di-deploy secara global di jaringan edge, perutean caching edge, manajemen DNS, dan pooling database.",
      stack: ["Cloudflare Workers", "Pages & Hyperdrive", "CDN Caching", "Topologi DNS", "Rute API Tangguh"],
      metric: "Latensi Global <50ms",
      iconType: 'cloud'
    },
    {
      id: 'automation',
      x: 100,
      y: 280,
      title: "Otomatisasi & DevOps",
      subtitle: "Integrasi Berkelanjutan",
      desc: "Pipa deployment yang kokoh, orkestrasi migrasi skema database, skrip shell, dan pemeriksaan sistem otomatis untuk menghilangkan pekerjaan berulang.",
      stack: ["GitHub Actions", "Drizzle Kit", "Bash Scripting", "Otomatisasi SSH", "Audit Keamanan"],
      metric: "Deploy Tanpa Downtime",
      iconType: 'arrow'
    },
    {
      id: 'ai',
      x: 500,
      y: 280,
      title: "Alur Kerja AI",
      subtitle: "Integrasi AI Jaringan Edge",
      desc: "Model bahasa besar yang di-host di jaringan edge, konteks vektor terstruktur (RAG), sistem multi-agen, dan asisten terfilter.",
      stack: ["Workers AI (Llama 3.1)", "Sistem RAG", "Pencarian Vektor", "Prompt Engineering", "Verifikasi Keamanan"],
      metric: "Respons edge real-time",
      iconType: 'brain'
    },
    {
      id: 'product',
      x: 300,
      y: 420,
      title: "Rekayasa Produk",
      subtitle: "Frontend & Portal Admin",
      desc: "Antarmuka pengguna glassmorphic premium, kisi responsif, mesin sesi berbasis cookie, dan dashboard admin dengan statistik real-time.",
      stack: ["Astro Framework", "Vanilla CSS & HTML5", "Web Crypto API (HMAC)", "HTML5 Canvas (WebP)", "Manajer Sesi"],
      metric: "Skor Lighthouse >= 90",
      iconType: 'monitor'
    },
    {
      id: 'architecture',
      x: 300,
      y: 250,
      title: "Arsitektur Sistem",
      subtitle: "Orkestrasi & Desain",
      desc: "Lapisan koordinasi sistem. Berfokus pada pembatasan laju (rate limiting), batas database transaksional, topologi caching, dan penanganan kegagalan.",
      stack: ["Sistem Thinking", "Rate Limiting", "Strategi Caching", "Keamanan Sertifikat CA", "Telemetri Terobservasi"],
      metric: "Desain Berbasis Arsitektur",
      iconType: 'polygon'
    }
  ]
};

const nodes = computed(() => nodesData[props.locale]);

// SVG connection coordinates
const connections = [
  { x1: 150, y1: 120, x2: 450, y2: 120 },
  { x1: 450, y1: 120, x2: 500, y2: 280 },
  { x1: 500, y1: 280, x2: 300, y2: 420 },
  { x1: 300, y1: 420, x2: 100, y2: 280 },
  { x1: 100, y1: 280, x2: 150, y2: 120 },
  { x1: 150, y1: 120, x2: 300, y2: 250 },
  { x1: 450, y1: 120, x2: 300, y2: 250 },
  { x1: 500, y1: 280, x2: 300, y2: 250 },
  { x1: 300, y1: 420, x2: 300, y2: 250 },
  { x1: 100, y1: 280, x2: 300, y2: 250 }
];

// Spoke nodes specifically connecting to center node
const spokes = [
  { x1: 150, y1: 120, x2: 300, y2: 250 },
  { x1: 450, y1: 120, x2: 300, y2: 250 },
  { x1: 500, y1: 280, x2: 300, y2: 250 },
  { x1: 300, y1: 420, x2: 300, y2: 250 },
  { x1: 100, y1: 280, x2: 300, y2: 250 }
];

// Reactive States
const svgRef = ref<SVGElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);

const activeNodeId = ref<string | null>(null);
const hoveredNodeId = ref<string | null>(null);

const tooltipVisible = ref(false);

const drawerIconPathRef = ref<SVGPathElement | null>(null);

const nodePaths = {
  infrastructure: 'M12 2L16 6H20V10L24 14V18H20V22H16L12 18L8 22H4V18H0V14L4 10V6H8L12 2Z',
  cloud: 'M19.3 10C18.6 6.5 15.6 4 12 4 9.1 4 6.6 5.6 5.3 8 2.3 8.3 0 10.9 0 14c0 3.3 2.7 6 6 6h13c2.7 0 5-2.2 5-5 0-2.6-2-4.7-4.6-4.9Z',
  automation: 'M12 4V1L8 5L12 9V6C15.3 6 18 8.6 18 12C18 13 17.7 13.9 17.3 14.8L18.8 16.3C19.5 15 20 13.5 20 12C20 7.5 16.4 4 12 4ZM12 18C8.6 18 6 15.3 6 12C6 11 6.2 10 6.7 9.2L5.2 7.7C4.4 8.9 4 10.4 4 12C4 16.4 7.5 20 12 20V23L16 19L12 15V18Z',
  ai: 'M12 2C6.4 2 2 6.4 2 12C2 17.5 6.4 22 12 22C17.5 22 22 17.5 22 12C22 6.4 17.5 2 12 2ZM12 19.8C7.7 19.8 4.2 16.3 4.2 12C4.2 7.7 7.7 4.2 12 4.2C16.3 4.2 19.8 7.7 19.8 12C19.8 16.3 16.3 19.8 12 19.8Z',
  product: 'M20 18C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6Z',
  architecture: 'M12 2L22 12L12 22L2 12Z'
};

watch(activeNodeId, (newId) => {
  if (!newId || typeof window === 'undefined') return;
  const targetD = nodePaths[newId as keyof typeof nodePaths];
  if (targetD && drawerIconPathRef.value) {
    morphPath(drawerIconPathRef.value, targetD, 400);
  }
});
const tooltipX = ref(0);
const tooltipY = ref(0);

const drawerVisible = ref(false);

const hoveredNode = computed(() => {
  if (!hoveredNodeId.value) return null;
  return nodes.value.find(n => n.id === hoveredNodeId.value) || null;
});

const activeNode = computed(() => {
  if (!activeNodeId.value) return null;
  return nodes.value.find(n => n.id === activeNodeId.value) || null;
});

// Event Handlers
const handleNodeHover = (payload: { id: string | null; event?: MouseEvent }) => {
  if (!payload.id || !payload.event) {
    hoveredNodeId.value = null;
    tooltipVisible.value = false;
    return;
  }

  hoveredNodeId.value = payload.id;
  const target = payload.event.currentTarget as SVGElement;
  const svg = svgRef.value;

  if (target && svg) {
    const rect = target.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    tooltipX.value = rect.left - svgRect.left + (rect.width / 2);
    tooltipY.value = rect.top - svgRect.top - 10;
    tooltipVisible.value = true;
  }
};

const handleNodeClick = (id: string) => {
  activeNodeId.value = id;
  drawerVisible.value = true;
};

const closeDrawer = () => {
  drawerVisible.value = false;
  activeNodeId.value = null;
};

const handleGlobalClick = (e: MouseEvent) => {
  if (drawerVisible.value && wrapperRef.value) {
    const target = e.target as HTMLElement;
    // Close if click is outside of the wrapper or drawer element
    if (!wrapperRef.value.contains(target)) {
      closeDrawer();
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick);
});
</script>

<style scoped>
.system-map-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.svg-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.network-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* Details sliding side panel drawer */
.system-drawer {
  position: fixed;
  bottom: 74px; /* above bottom navigation */
  left: var(--spacing-md, 1rem);
  right: var(--spacing-md, 1rem);
  background: rgba(18, 26, 44, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg, 12px);
  padding: var(--spacing-lg, 1.5rem);
  z-index: 85;
  box-shadow: var(--shadow-lg);
  transform: translateY(0);
  opacity: 1;
  transition: transform var(--duration-slow, 0.4s) var(--ease-snappy, cubic-bezier(0.2, 0.8, 0.2, 1)), opacity var(--duration-slow, 0.4s);
}

:global([data-theme="light"]) .system-drawer {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.08);
}

.system-drawer.hidden {
  transform: translateY(20px);
  opacity: 0;
  pointer-events: none;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md, 1rem);
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--spacing-sm, 0.5rem);
}

.drawer-subtitle {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--accent);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-header h3 {
  margin: 0;
  font-size: var(--font-size-md, 1.15rem);
  color: var(--text);
  font-weight: 700;
}

.close-drawer-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--duration-fast, 0.15s), color var(--duration-fast, 0.15s);
}

.close-drawer-btn:hover {
  background: var(--hover-bg);
  color: var(--text);
}

.drawer-body {
  display: grid;
  gap: var(--spacing-md, 1rem);
}

.drawer-desc {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--muted);
  line-height: 1.5;
  margin: 0;
}

/* Responsive desktop sizing for side panel */
@media (min-width: 769px) {
  .system-drawer {
    position: absolute;
    right: -320px;
    top: 0;
    bottom: auto;
    left: auto;
    width: 290px;
    height: auto;
    transform: translateX(0);
    margin: 0;
  }

  .system-drawer.hidden {
    transform: translateX(20px);
    opacity: 0;
    pointer-events: none;
  }
}

@media (min-width: 1120px) {
  .system-drawer {
    right: -340px;
    width: 310px;
  }
}

.drawer-header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 0.75rem);
}

.drawer-node-icon {
  flex-shrink: 0;
  color: var(--accent);
}
</style>
