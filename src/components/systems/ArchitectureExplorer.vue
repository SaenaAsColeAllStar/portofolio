<template>
  <div class="explorer-grid">
    <!-- Pipeline Map -->
    <div class="pipeline-section">
      <div class="pipeline-container">
        <!-- SVG Connections & Tunnels -->
        <svg class="pipeline-svg" viewBox="0 0 100 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pipe-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.8" />
              <stop offset="100%" stop-color="var(--accent-strong, var(--accent))" stop-opacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Core Pipe Line -->
          <line x1="50" y1="20" x2="50" y2="480" stroke="url(#pipe-grad)" stroke-width="3" />
          
          <!-- Moving Signal Packets -->
          <circle cx="50" cy="0" r="4" fill="var(--accent)" filter="url(#glow)">
            <animate 
              attributeName="cy" 
              from="20" 
              to="480" 
              dur="4s" 
              repeatCount="indefinite" 
            />
          </circle>
          <circle cx="50" cy="0" r="3" fill="#ffffff" filter="url(#glow)">
            <animate 
              attributeName="cy" 
              from="20" 
              to="480" 
              dur="4s" 
              begin="2s"
              repeatCount="indefinite" 
            />
          </circle>
        </svg>

        <!-- Pipeline Step Nodes -->
        <div class="pipeline-nodes">
          <button 
            v-for="step in steps" 
            :key="step.id"
            class="pipeline-node"
            :class="{ active: activeStepId === step.id }"
            @click="activeStepId = step.id"
            :aria-label="step.title"
          >
            <div class="node-bullet">
              <span class="bullet-inner"></span>
            </div>
            <div class="node-meta">
              <span class="node-label">{{ step.label }}</span>
              <h4>{{ step.title }}</h4>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Details Display Panel -->
    <div class="details-section">
      <SentinelCrab 
        variant="guide" 
        :locale="locale" 
        :hovered-node-id="activeStepId" 
      />
      <transition name="slide" mode="out-in">
        <div :key="activeStep.id" class="details-card card">
          <div class="card-header">
            <span class="eyebrow">{{ activeStep.label }}</span>
            <h2>{{ activeStep.title }}</h2>
          </div>
          
          <div class="card-body">
            <p class="description">{{ activeStep.desc }}</p>
            
            <div class="info-group">
              <h5>{{ locale === 'id' ? 'Teknologi Inti' : 'Core Technologies' }}</h5>
              <div class="badge-row">
                <span v-for="tech in activeStep.stack" :key="tech" class="badge">{{ tech }}</span>
              </div>
            </div>

            <div class="info-group">
              <h5>{{ locale === 'id' ? 'Pengamanan & Batasan' : 'Security & Constraints' }}</h5>
              <p class="security">{{ activeStep.security }}</p>
            </div>

            <div class="info-group">
              <h5>{{ locale === 'id' ? 'Metrik Operasional' : 'Operational Metrics' }}</h5>
              <div class="metric-box">
                <span class="metric-value">{{ activeStep.metricValue }}</span>
                <span class="metric-label">{{ activeStep.metricLabel }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue';
import SentinelCrab from './SentinelCrab.vue';

const props = defineProps<{
  locale: 'en' | 'id';
}>();

interface Step {
  id: string;
  label: string;
  title: string;
  desc: string;
  stack: string[];
  security: string;
  metricValue: string;
  metricLabel: string;
}

const stepsData = {
  en: [
    {
      id: 'traffic',
      label: "Layer 01: Traffic ingress",
      title: "Users & Requests",
      desc: "Incoming requests from client browsers globally. Resolves DNS routing and filters basic connection rates.",
      stack: ["HTTPS/TLS 1.3", "DNS Anycast", "IPv6 Routing", "Client Cache"],
      security: "Client-side certificate verification options and rate boundaries to prevent browser-level floods.",
      metricValue: "100%",
      metricLabel: "Traffic Availability"
    },
    {
      id: 'edge',
      label: "Layer 02: Edge Network",
      title: "Cloudflare Edge Platform",
      desc: "Distributed servers closest to users cache assets globally, run serverless Workers routes, and manage connection routing.",
      stack: ["Cloudflare Workers", "Pages Cache", "Hyperdrive Pooled VM Connectors", "Edge Key-Value Stash"],
      security: "Cloudflare Web Application Firewall (WAF) rule sets, DDoS protection layers, and Turnstile anti-spam integrations.",
      metricValue: "<50ms",
      metricLabel: "Edge Request Time"
    },
    {
      id: 'tunnel',
      label: "Layer 03: Secure Transit",
      title: "Outbound Network Tunnels",
      desc: "Local hypervisor service daemons establish private outbound connections. Restricts incoming port vectors to zero.",
      stack: ["Cloudflare Tunnel (cloudflared)", "SSH Encrypted Keys", "Mutual TLS Verification", "Private Bridge Network"],
      security: "Zero incoming router ports. Outbound-only UDP/TCP traffic ensures protection from network scanning vectors.",
      metricValue: "0",
      metricLabel: "Open Inbound Router Ports"
    },
    {
      id: 'hypervisor',
      label: "Layer 04: Virtual Host",
      title: "Proxmox VE Hypervisor",
      desc: "A bare-metal hypervisor cluster orchestrating physical hardware resource quotas for storage and execution bounds.",
      stack: ["Proxmox VE OS", "KVM Virtualization Layer", "LXC Container Managers", "ZFS Raid Storage Pools"],
      security: "Isolated local networks (VLANs), granular VM permission pools, and automated off-site backups.",
      metricValue: "15 Min",
      metricLabel: "Average VM Recovery Time"
    },
    {
      id: 'compute',
      label: "Layer 05: Container Node",
      title: "Docker Compute Engines",
      desc: "Isolated VM environments running containerized microservices. Minimizes dependencies conflict and maximizes portability.",
      stack: ["Docker Engine", "Docker Compose Orchestration", "Nginx Virtual Host Maps", "Private Local Bridges"],
      security: "Container resource constraints (CPU/RAM limits) and network boundary isolation rules.",
      metricValue: "99.98%",
      metricLabel: "Container Engine Availability"
    },
    {
      id: 'application',
      label: "Layer 06: Core State",
      title: "Applications & Database",
      desc: "The core layer hosting applications, password vaults, automation scripts, and transactional databases.",
      stack: ["PostgreSQL State Layer", "Restic Backups Pool", "API Servers", "Workers AI Llama 3.1 Inference"],
      security: "Client-side restic vault encryption, read-only database roles, and short-lived session tokens.",
      metricValue: "0%",
      metricLabel: "Backup Data Loss Rate"
    }
  ],
  id: [
    {
      id: 'traffic',
      label: "Lapisan 01: Ingress Lalu Lintas",
      title: "Pengguna & Permintaan",
      desc: "Permintaan masuk dari browser klien secara global. Menyelesaikan perutean DNS dan memfilter batas koneksi dasar.",
      stack: ["HTTPS/TLS 1.3", "DNS Anycast", "Perutean IPv6", "Cache Klien"],
      security: "Opsi verifikasi sertifikat sisi klien dan batas laju untuk mencegah banjir permintaan tingkat browser.",
      metricValue: "100%",
      metricLabel: "Ketersediaan Lalu Lintas"
    },
    {
      id: 'edge',
      label: "Lapisan 02: Jaringan Tepi",
      title: "Platform Cloud Edge Cloudflare",
      desc: "Server terdistribusi terdekat dengan pengguna menyimpan cache aset secara global, menjalankan rute Workers, dan mengelola pooling koneksi.",
      stack: ["Cloudflare Workers", "Pages Cache", "Konektor Hyperdrive VM", "Penyimpanan Edge KV"],
      security: "Kumpulan aturan Web Application Firewall (WAF) Cloudflare, perlindungan DDoS, dan integrasi anti-spam Turnstile.",
      metricValue: "<50ms",
      metricLabel: "Waktu Permintaan Edge"
    },
    {
      id: 'tunnel',
      label: "Lapisan 03: Transit Aman",
      title: "Terowongan Jaringan Keluar",
      desc: "Daemon layanan hypervisor lokal membuat koneksi keluar pribadi. Membatasi vektor port masuk menjadi nol.",
      stack: ["Cloudflare Tunnel (cloudflared)", "Kunci Enkripsi SSH", "Verifikasi Mutual TLS", "Jembatan Jaringan Privat"],
      security: "Nol port masuk terbuka di router. Lalu lintas khusus keluar UDP/TCP memastikan perlindungan dari pemindaian jaringan.",
      metricValue: "0",
      metricLabel: "Port Masuk Terbuka di Router"
    },
    {
      id: 'hypervisor',
      label: "Lapisan 04: Host Virtual",
      title: "Hypervisor Proxmox VE",
      desc: "Kluster hypervisor bare-metal yang mengatur kuota sumber daya perangkat keras fisik untuk penyimpanan dan batasan eksekusi.",
      stack: ["Proxmox VE OS", "Lapisan Virtualisasi KVM", "Manajer Kontainer LXC", "ZFS Raid Storage Pool"],
      security: "Jaringan lokal terisolasi (VLAN), pool izin VM yang granular, dan pencadangan otomatis di luar lokasi.",
      metricValue: "15 Menit",
      metricLabel: "Waktu Pemulihan Rata-rata VM"
    },
    {
      id: 'compute',
      label: "Lapisan 05: Node Kontainer",
      title: "Mesin Komputasi Docker",
      desc: "Lingkungan VM terisolasi yang menjalankan layanan mikro dalam kontainer. Meminimalkan konflik dependensi dan memaksimalkan portabilitas.",
      stack: ["Docker Engine", "Orkestrasi Docker Compose", "Peta Host Virtual Nginx", "Bridge Lokal Privat"],
      security: "Batasan sumber daya kontainer (batas CPU/RAM) dan aturan isolasi batas jaringan.",
      metricValue: "99,98%",
      metricLabel: "Ketersediaan Mesin Kontainer"
    },
    {
      id: 'application',
      label: "Lapisan 06: Inti Layanan",
      title: "Aplikasi & Database",
      desc: "Lapisan inti yang menghosting aplikasi, brankas kata sandi, skrip otomatisasi, dan database transaksional.",
      stack: ["Lapisan PostgreSQL", "Pencadangan Restic", "Server API", "Inferensi Workers AI Llama 3.1"],
      security: "Enkripsi brankas restic sisi klien, peran database baca-saja, dan token sesi berumur pendek.",
      metricValue: "0%",
      metricLabel: "Tingkat Kehilangan Data Cadangan"
    }
  ]
};

const steps = computed(() => stepsData[props.locale]);
const activeStepId = ref('traffic');

const activeStep = computed(() => {
  return steps.value.find(s => s.id === activeStepId.value) || steps.value[0];
});
</script>

<style scoped>
.explorer-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 3rem;
  margin-top: 2rem;
  align-items: start;
}

@media (max-width: 860px) {
  .explorer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* Pipeline Map Column */
.pipeline-section {
  display: flex;
  justify-content: center;
}

.pipeline-container {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 420px;
}

.pipeline-svg {
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 100px;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.pipeline-nodes {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  z-index: 2;
  position: relative;
}

.pipeline-node {
  background: transparent;
  border: none;
  padding: 0.8rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 2rem;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-radius: var(--radius-lg, 12px);
  transition: background var(--duration-fast, 0.2s), transform var(--duration-fast, 0.2s);
}

.pipeline-node:hover {
  background: var(--hover-bg);
  transform: translateX(4px);
}

.pipeline-node.active {
  background: var(--hover-bg);
}

.node-bullet {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  border: 2px solid var(--border);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
}

.bullet-inner {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--muted);
  transition: transform 0.3s, background 0.3s;
}

.pipeline-node.active .node-bullet {
  border-color: var(--accent);
  box-shadow: 0 0 12px rgba(var(--accent-rgb, 79, 140, 255), 0.3);
}

.pipeline-node.active .bullet-inner {
  background: var(--accent);
  transform: scale(1.2);
}

.node-meta {
  display: flex;
  flex-direction: column;
}

.node-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.05em;
}

.node-meta h4 {
  margin: 0.15rem 0 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  transition: color 0.2s;
}

.pipeline-node.active .node-meta h4 {
  color: var(--accent);
}

/* Details Section Column */
.details-section {
  position: sticky;
  top: 6rem;
}

.details-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 420px;
}

.card-header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.card-header h2 {
  margin: 0.25rem 0 0 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.description {
  font-size: 0.95rem;
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-group h5 {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent);
  letter-spacing: 0.08em;
  margin: 0;
}

.security {
  font-size: 0.88rem;
  color: var(--subtle);
  line-height: 1.5;
  margin: 0;
}

/* Metric Display */
.metric-box {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 8px);
  padding: 0.85rem 1.25rem;
  display: inline-flex;
  flex-direction: column;
  align-self: start;
  gap: 0.2rem;
}

.metric-value {
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.1;
}

.metric-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.05em;
}

/* Transition Animations */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 600px) {
  .pipeline-node {
    gap: 1.25rem;
  }
  .pipeline-svg {
    left: 10px;
  }
}
</style>
