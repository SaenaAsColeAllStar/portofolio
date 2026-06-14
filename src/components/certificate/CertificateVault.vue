<template>
  <div class="certificate-vault-container">
    <!-- Filters / Tabs -->
    <div class="category-filters">
      <button 
        @click="selectedCategory = 'all'" 
        class="filter-tab"
        :class="{ active: selectedCategory === 'all' }"
      >
        {{ locale === 'id' ? 'Semua' : 'All' }}
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="selectedCategory = cat" 
        class="filter-tab"
        :class="{ active: selectedCategory === cat }"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Grid Layout -->
    <div class="grid grid-3 certificate-grid">
      <div 
        v-for="cert in filteredCertificates" 
        :key="cert.id"
        class="card cert-card"
        @click="openModal(cert)"
        data-animate="card-hover"
      >
        <div class="folder-header">
          <span class="folder-tab"></span>
          <span class="cert-category-badge">{{ cert.category }}</span>
        </div>
        <div class="cert-card-body">
          <div class="cert-icon">🏅</div>
          <h3>{{ cert.title }}</h3>
          <p class="issuer">{{ cert.issuer }}</p>
          <div class="date-row">
            <span class="date-label">{{ locale === 'id' ? 'Diterbitkan:' : 'Issued:' }}</span>
            <span class="date-val font-mono">{{ formatDate(cert.issuedAt) }}</span>
          </div>
        </div>
        <div class="hover-preview-indicator">
          {{ locale === 'id' ? 'Klik untuk melihat detail' : 'Click to preview' }} →
        </div>
      </div>
    </div>

    <!-- Fullscreen Detail Modal -->
    <div 
      v-if="activeCert" 
      class="modal-backdrop"
      @click.self="closeModal"
      @keydown.esc="closeModal"
      tabindex="0"
      ref="modalRef"
    >
      <div class="modal-content" role="dialog" aria-modal="true">
        <button @click="closeModal" class="modal-close-btn" aria-label="Close modal">
          ✕
        </button>
        <div class="modal-body">
          <div class="modal-header">
            <p class="modal-eyebrow">{{ activeCert.category }} {{ locale === 'id' ? 'Sertifikasi' : 'Certification' }}</p>
            <h2>{{ activeCert.title }}</h2>
            <p class="modal-issuer">By <strong>{{ activeCert.issuer }}</strong></p>
          </div>

          <div class="modal-meta-grid">
            <div class="meta-item">
              <span class="meta-label">{{ locale === 'id' ? 'Tanggal Terbit' : 'Date Issued' }}</span>
              <span class="meta-value font-mono">{{ formatDate(activeCert.issuedAt) }}</span>
            </div>
            <div v-if="activeCert.credentialId" class="meta-item">
              <span class="meta-label">Credential ID</span>
              <span class="meta-value font-mono">{{ activeCert.credentialId }}</span>
            </div>
          </div>

          <!-- Skills tags -->
          <div v-if="activeCert.skills && activeCert.skills.length > 0" class="skills-section">
            <h4>{{ locale === 'id' ? 'Keahlian Terverifikasi' : 'Verified Skills' }}</h4>
            <div class="badge-row">
              <span 
                v-for="skill in activeCert.skills" 
                :key="skill"
                class="badge skill-badge"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="description-section">
            <p>{{ activeCert.body }}</p>
          </div>

          <div class="modal-actions">
            <a 
              v-if="activeCert.credentialUrl" 
              :href="activeCert.credentialUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="button"
            >
              {{ locale === 'id' ? 'Verifikasi Kredensial' : 'Verify Credential' }} 
              <span class="btn-arrow">↗</span>
            </a>
            <button @click="closeModal" class="button secondary">
              {{ locale === 'id' ? 'Tutup' : 'Close' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
  certificates: {
    type: Array,
    required: true
  },
  locale: {
    type: String,
    default: 'en'
  }
});

const selectedCategory = ref('all');
const activeCert = ref(null);
const modalRef = ref(null);

const categories = computed(() => {
  const allCats = props.certificates.map(c => c.category);
  return [...new Set(allCats)];
});

const filteredCertificates = computed(() => {
  if (selectedCategory.value === 'all') {
    return props.certificates;
  }
  return props.certificates.filter(c => c.category === selectedCategory.value);
});

const openModal = (cert) => {
  activeCert.value = cert;
  // Trap focus next tick
  nextTick(() => {
    if (modalRef.value) {
      modalRef.value.focus();
    }
  });
};

const closeModal = () => {
  activeCert.value = null;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(props.locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long'
  });
};
</script>

<style scoped>
.certificate-vault-container {
  margin-top: 1.5rem;
}
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.filter-tab {
  background: var(--card-bg, #1a1f2c);
  border: 1px solid var(--border, #242936);
  color: var(--muted, #8ea0c4);
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.filter-tab:hover, .filter-tab.active {
  background: var(--hover-bg, #242d3d);
  color: var(--text, #f0f4fc);
  border-color: var(--accent, #4f8cff);
}
.certificate-grid {
  margin-top: 1.5rem;
}
.cert-card {
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  padding: 1.5rem;
  overflow: hidden;
  border-top-left-radius: 0;
}
.folder-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}
.folder-tab {
  width: 70px;
  height: 12px;
  background: var(--card-bg-1, #151922);
  border-top: 1px solid var(--border, #242936);
  border-right: 1px solid var(--border, #242936);
  border-radius: 4px 4px 0 0;
  margin-top: -12px;
  margin-left: -5px;
}
.cert-category-badge {
  font-size: 0.68rem;
  background: rgba(79, 140, 255, 0.08);
  border: 1px solid rgba(79, 140, 255, 0.15);
  color: var(--accent, #4f8cff);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  margin-top: 8px;
}
.cert-card-body {
  margin-top: 1rem;
  flex: 1;
}
.cert-icon {
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
}
h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text, #f0f4fc);
  margin: 0.3rem 0;
  line-height: 1.4;
}
.issuer {
  color: var(--muted, #8ea0c4);
  font-size: 0.88rem;
  margin: 0;
}
.date-row {
  margin-top: 0.8rem;
  font-size: 0.78rem;
  display: flex;
  gap: 0.4rem;
}
.date-label {
  color: var(--muted, #5e7299);
}
.date-val {
  color: var(--text, #f0f4fc);
}
.hover-preview-indicator {
  font-size: 0.78rem;
  color: var(--accent, #4f8cff);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateY(4px);
  margin-top: 0.8rem;
}
.cert-card:hover .hover-preview-indicator {
  opacity: 1;
  transform: translateY(0);
}

/* Fullscreen Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 12, 18, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 10000;
  outline: none;
}
.modal-content {
  background: var(--surface, #151922);
  border: 1px solid var(--border, #242936);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  position: relative;
  overflow: hidden;
  animation: modalReveal 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalReveal {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--muted, #8ea0c4);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.modal-close-btn:hover {
  color: var(--text, #f0f4fc);
  background: rgba(255, 255, 255, 0.05);
}
.modal-body {
  padding: 2.2rem;
}
.modal-header {
  border-bottom: 1px solid var(--border, #242936);
  padding-bottom: 1.2rem;
  margin-bottom: 1.2rem;
}
.modal-eyebrow {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent, #4f8cff);
  font-weight: 600;
  margin: 0 0 0.4rem 0;
}
.modal-header h2 {
  font-size: 1.4rem;
  color: var(--text, #f0f4fc);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}
.modal-issuer {
  font-size: 0.95rem;
  color: var(--muted, #8ea0c4);
  margin: 0;
}
.modal-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}
.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.meta-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  color: var(--muted, #5e7299);
  letter-spacing: 0.05em;
}
.meta-value {
  font-size: 0.9rem;
  color: var(--text, #f0f4fc);
}
.skills-section {
  margin-bottom: 1.5rem;
}
.skills-section h4 {
  font-size: 0.82rem;
  text-transform: uppercase;
  color: var(--muted, #5e7299);
  margin: 0 0 0.6rem 0;
  letter-spacing: 0.05em;
}
.badge-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.skill-badge {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border, #242936);
  color: var(--muted, #8ea0c4);
  font-size: 0.78rem;
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
}
.description-section {
  font-size: 0.92rem;
  color: var(--muted, #8ea0c4);
  line-height: 1.6;
  margin-bottom: 2rem;
}
.modal-actions {
  display: flex;
  gap: 0.8rem;
}
.button {
  align-items: center;
  background: var(--text, #f0f4fc);
  border: 1px solid var(--border, #242936);
  border-radius: 999px;
  color: var(--bg, #0a0c12);
  display: inline-flex;
  font-weight: 700;
  gap: 0.5rem;
  padding: 0.68rem 1.2rem;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.button:hover {
  background: var(--accent, #4f8cff);
  color: #fff;
}
.button.secondary {
  background: transparent;
  color: var(--text, #f0f4fc);
}
.button.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
}
.btn-arrow {
  font-size: 0.8rem;
}
</style>
