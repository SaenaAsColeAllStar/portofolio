<template>
  <div class="system-map-wrapper" ref="wrapperRef">
    <SentinelCrab 
      :hovered-node-id="hoveredNodeId" 
      :active-node-id="activeNodeId" 
      variant="hero"
      :locale="locale"
      class="hero-mascot"
    />
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
          <HeroSignal path-d="M 120 140 L 200 100 L 400 100 L 480 140 L 480 320 L 400 380 L 200 380 L 120 320 Z" />
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
import SentinelCrab from '../systems/SentinelCrab.vue';
import { useInteractionMemory } from '../animation/orchestration/interactionMemory';

const props = defineProps<{
  locale: 'en' | 'id';
}>();

const { markNodeViewed } = useInteractionMemory();

// Node metadata containing positions and localized contents
const nodesData = {
  en: [
    {
      id: 'infrastructure',
      x: 120,
      y: 140,
      title: "Infrastructure Layer",
      subtitle: "Bare-Metal Core",
      desc: "Custom bare-metal hosts and localized Linux servers running core containers and network proxies.",
      stack: ["Debian Linux", "Docker Compose", "Nginx Proxy Manager", "Local DNS Resolver", "Cron Automation"],
      metric: "99.98% Service Uptime",
      iconType: 'path'
    },
    {
      id: 'proxmox',
      x: 200,
      y: 100,
      title: "Proxmox VE VM Host",
      subtitle: "Type-1 Hypervisor",
      desc: "Enterprise virtualization platform managing KVM virtual machines, LXC containers, and internal networks.",
      stack: ["Proxmox Hypervisor", "KVM Virtualization", "LXC Containers", "ZFS Storage Pools", "Backup Schedules"],
      metric: "15-Min VM Recovery",
      iconType: 'polygon'
    },
    {
      id: 'cloudflare',
      x: 400,
      y: 100,
      title: "Cloudflare Edge",
      subtitle: "Edge Cloud Platform",
      desc: "Global CDN caching, secure outbound tunnels, serverless Workers runtime, and pooled Hyperdrive routes.",
      stack: ["Cloudflare Workers", "Pages & Hyperdrive", "Cloudflare Tunnels", "Zero Trust MFA", "WAF Security"],
      metric: "<50ms Global Latency",
      iconType: 'cloud'
    },
    {
      id: 'automation',
      x: 480,
      y: 140,
      title: "Automation & DevOps",
      subtitle: "Continuous Delivery",
      desc: "Continuous integration pipelines, shell automation, database migrations, and remote SSH task orchestration.",
      stack: ["GitHub Actions", "Bash Scripting", "Drizzle Kit Migrations", "Restic Backups", "Discord Webhooks"],
      metric: "Zero-Downtime Deploy",
      iconType: 'arrow'
    },
    {
      id: 'ai',
      x: 480,
      y: 320,
      title: "AI Systems",
      subtitle: "Edge LLM Workflows",
      desc: "Edge-native large language models, retrieval context pools, and autonomous multi-agent developer tasks.",
      stack: ["Workers AI (Llama 3.1)", "Vectorize Databases", "RAG Pipeline Systems", "AGY Agent SDK", "Prompt Engineering"],
      metric: "Real-time Edge Answers",
      iconType: 'brain'
    },
    {
      id: 'search',
      x: 400,
      y: 380,
      title: "Search Engine",
      subtitle: "Static Index Search",
      desc: "Pre-compiled static JSON indexing, client-side Fuse.js query engine, and custom search weight algorithms.",
      stack: ["Fuse.js Engine", "Pre-built JSON Index", "Bilingual Weighting", "Fuzzy Search Logic", "Instant Results Render"],
      metric: "Sub-5ms Query Speed",
      iconType: 'search'
    },
    {
      id: 'astro',
      x: 200,
      y: 380,
      title: "Astro Framework",
      subtitle: "Static-First Engine",
      desc: "Pre-rendered static pages, dynamic server-rendered endpoints, and strictly typed content collection validation.",
      stack: ["Astro SSR & Hybrid", "Content Collections", "Astro View Transitions", "i18n Dynamic Routing", "Sitemap Generation"],
      metric: "100% Lighthouse Score",
      iconType: 'astro'
    },
    {
      id: 'vue',
      x: 120,
      y: 320,
      title: "Vue Islands",
      subtitle: "Interactive UX",
      desc: "Hydrated Vue client islands for search inputs, command consoles, certificate vault FINDERs, and 3D visitor globes.",
      stack: ["Vue 3 Composition API", "Client-Side Hydration", "State Management (Pinia)", "Canvas Render Engine", "Interactive Tooltips"],
      metric: "Zero Layout Shift",
      iconType: 'monitor'
    },
    {
      id: 'architecture',
      x: 300,
      y: 250,
      title: "System Architecture",
      subtitle: "Design & Orchestration",
      desc: "The coordinating system layer. Focuses on rate limiting, database transactions, caching topologies, and security boundaries.",
      stack: ["Systems Thinking", "Rate Limiting", "Caching Strategies", "CA Certificates Security", "Observed Telemetry"],
      metric: "Architect-first Design",
      iconType: 'polygon'
    }
  ],
  id: [
    {
      id: 'infrastructure',
      x: 120,
      y: 140,
      title: "Lapisan Infrastruktur",
      subtitle: "Inti Bare-Metal",
      desc: "Host bare-metal khusus dan server Linux lokal yang menjalankan kontainer inti dan proxy jaringan.",
      stack: ["Debian Linux", "Docker Compose", "Nginx Proxy Manager", "Local DNS Resolver", "Otomatisasi Cron"],
      metric: "99,98% Uptime Layanan",
      iconType: 'path'
    },
    {
      id: 'proxmox',
      x: 200,
      y: 100,
      title: "Host VM Proxmox VE",
      subtitle: "Hypervisor Tipe-1",
      desc: "Platform virtualisasi perusahaan yang mengelola mesin virtual KVM, kontainer LXC, dan jaringan internal.",
      stack: ["Proxmox Hypervisor", "Virtualisasi KVM", "Kontainer LXC", "ZFS Storage Pool", "Jadwal Pencadangan"],
      metric: "Pemulihan VM 15 Menit",
      iconType: 'polygon'
    },
    {
      id: 'cloudflare',
      x: 400,
      y: 100,
      title: "Edge Cloudflare",
      subtitle: "Platform Cloud Edge",
      desc: "Caching CDN global, terowongan keluar yang aman, runtime Workers serverless, dan rute Hyperdrive.",
      stack: ["Cloudflare Workers", "Pages & Hyperdrive", "Cloudflare Tunnels", "Zero Trust MFA", "Keamanan WAF"],
      metric: "Latensi Global <50ms",
      iconType: 'cloud'
    },
    {
      id: 'automation',
      x: 480,
      y: 140,
      title: "Otomatisasi & DevOps",
      subtitle: "Pengiriman Berkelanjutan",
      desc: "Pipeline integrasi berkelanjutan, otomatisasi shell, migrasi database, dan orkestrasi tugas SSH jarak jauh.",
      stack: ["GitHub Actions", "Scripting Bash", "Migrasi Drizzle Kit", "Pencadangan Restic", "Webhook Discord"],
      metric: "Deploy Tanpa Downtime",
      iconType: 'arrow'
    },
    {
      id: 'ai',
      x: 480,
      y: 320,
      title: "Sistem AI",
      subtitle: "Alur Kerja LLM Edge",
      desc: "Model bahasa besar edge-native, pool konteks retrieval, dan tugas pengembang otonom multi-agen.",
      stack: ["Workers AI (Llama 3.1)", "Database Vectorize", "Sistem RAG Pipeline", "AGY Agent SDK", "Prompt Engineering"],
      metric: "Jawaban Edge Real-time",
      iconType: 'brain'
    },
    {
      id: 'search',
      x: 400,
      y: 380,
      title: "Mesin Pencari",
      subtitle: "Pencarian Indeks Statis",
      desc: "Pengindeksan JSON statis yang dikompilasi sebelumnya, mesin kueri Fuse.js sisi klien, dan algoritma bobot.",
      stack: ["Mesin Fuse.js", "Indeks JSON Statis", "Pembobotan Bilingual", "Logika Fuzzy Search", "Render Hasil Instan"],
      metric: "Kecepatan Kueri <5ms",
      iconType: 'search'
    },
    {
      id: 'astro',
      x: 200,
      y: 380,
      title: "Astro Framework",
      subtitle: "Mesin Statis-Pertama",
      desc: "Halaman statis yang dirender sebelumnya, endpoint dinamis, dan validasi koleksi konten terkompilasi.",
      stack: ["Astro SSR & Hybrid", "Koleksi Konten", "Astro View Transitions", "Rute Dinamis i18n", "Generasi Sitemap"],
      metric: "Skor Lighthouse 100%",
      iconType: 'astro'
    },
    {
      id: 'vue',
      x: 120,
      y: 320,
      title: "Pulau Vue",
      subtitle: "UX Interaktif",
      desc: "Pulau klien Vue terhidrasi untuk input pencarian, konsol perintah, FINDER sertifikat, dan globe pengunjung 3D.",
      stack: ["Vue 3 Composition API", "Hidrasi Sisi Klien", "Manajemen Status (Pinia)", "Mesin Render Canvas", "Tooltip Interaktif"],
      metric: "Nol Layout Shift",
      iconType: 'monitor'
    },
    {
      id: 'architecture',
      x: 300,
      y: 250,
      title: "Arsitektur Sistem",
      subtitle: "Desain & Orkestrasi",
      desc: "Lapisan sistem koordinasi. Berfokus pada rate limiting, transaksi database, topologi caching, dan batas keamanan.",
      stack: ["Systems Thinking", "Rate Limiting", "Strategi Caching", "Keamanan Sertifikat CA", "Telemetri Terobservasi"],
      metric: "Desain Berbasis Arsitektur",
      iconType: 'polygon'
    }
  ]
};

const nodes = computed(() => nodesData[props.locale]);

// SVG connection coordinates (8 spoke connections to center + 8 ring connections)
const connections = [
  { x1: 120, y1: 140, x2: 200, y2: 100 },
  { x1: 200, y1: 100, x2: 400, y2: 100 },
  { x1: 400, y1: 100, x2: 480, y2: 140 },
  { x1: 480, y1: 140, x2: 480, y2: 320 },
  { x1: 480, y1: 320, x2: 400, y2: 380 },
  { x1: 400, y1: 380, x2: 200, y2: 380 },
  { x1: 200, y1: 380, x2: 120, y2: 320 },
  { x1: 120, y1: 320, x2: 120, y2: 140 },
  // Center spokes
  { x1: 120, y1: 140, x2: 300, y2: 250 },
  { x1: 200, y1: 100, x2: 300, y2: 250 },
  { x1: 400, y1: 100, x2: 300, y2: 250 },
  { x1: 480, y1: 140, x2: 300, y2: 250 },
  { x1: 480, y1: 320, x2: 300, y2: 250 },
  { x1: 400, y1: 380, x2: 300, y2: 250 },
  { x1: 200, y1: 380, x2: 300, y2: 250 },
  { x1: 120, y1: 320, x2: 300, y2: 250 }
];

// Spoke nodes specifically connecting to center node
const spokes = [
  { x1: 120, y1: 140, x2: 300, y2: 250 },
  { x1: 200, y1: 100, x2: 300, y2: 250 },
  { x1: 400, y1: 100, x2: 300, y2: 250 },
  { x1: 480, y1: 140, x2: 300, y2: 250 },
  { x1: 480, y1: 320, x2: 300, y2: 250 },
  { x1: 400, y1: 380, x2: 300, y2: 250 },
  { x1: 200, y1: 380, x2: 300, y2: 250 },
  { x1: 120, y1: 320, x2: 300, y2: 250 }
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
  proxmox: 'M12 2L22 12L12 22L2 12Z',
  cloudflare: 'M19.3 10C18.6 6.5 15.6 4 12 4 9.1 4 6.6 5.6 5.3 8 2.3 8.3 0 10.9 0 14c0 3.3 2.7 6 6 6h13c2.7 0 5-2.2 5-5 0-2.6-2-4.7-4.6-4.9Z',
  automation: 'M12 4V1L8 5L12 9V6C15.3 6 18 8.6 18 12C18 13 17.7 13.9 17.3 14.8L18.8 16.3C19.5 15 20 13.5 20 12C20 7.5 16.4 4 12 4ZM12 18C8.6 18 6 15.3 6 12C6 11 6.2 10 6.7 9.2L5.2 7.7C4.4 8.9 4 10.4 4 12C4 16.4 7.5 20 12 20V23L16 19L12 15V18Z',
  ai: 'M12 2C6.4 2 2 6.4 2 12C2 17.5 6.4 22 12 22C17.5 22 22 17.5 22 12C22 6.4 17.5 2 12 2ZM12 19.8C7.7 19.8 4.2 16.3 4.2 12C4.2 7.7 7.7 4.2 12 4.2C16.3 4.2 19.8 7.7 19.8 12C19.8 16.3 16.3 19.8 12 19.8Z',
  search: 'M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0 M17 17l4 4',
  astro: 'M12 2L22 20L2 20Z',
  vue: 'M20 18C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6Z',
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
  markNodeViewed(id);
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
  gap: 2rem;
}

@media (min-width: 769px) {
  .system-map-wrapper {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
  }
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
