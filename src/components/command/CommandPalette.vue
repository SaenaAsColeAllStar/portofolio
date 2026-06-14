<template>
  <transition name="fade">
    <div 
      v-if="isOpen" 
      class="dialog-backdrop"
      @click="close"
    >
      <div 
        class="command-palette" 
        @click.stop
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div class="palette-container">
          <div class="palette-header" style="position: relative;">
            <SentinelCrab 
              variant="search"
              :search-active="query.length > 0"
              :locale="locale"
            />
            <CommandInput 
              ref="inputComponentRef"
              v-model="query" 
              :placeholder="placeholderText"
              @keydown="handleInputKeyDown"
              @close="close"
            />
          </div>
          <CommandResults 
            :results="filteredResults" 
            :active-index="activeIndex" 
            :locale="locale"
            @select="executeAction"
            @hover-index="activeIndex = $event"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, defineProps } from 'vue';
import CommandInput from './CommandInput.vue';
import CommandResults from './CommandResults.vue';
import SentinelCrab from '../systems/SentinelCrab.vue';
import { search, type SearchItem } from '../../lib/search/search-engine';

const props = defineProps<{
  locale: 'en' | 'id';
}>();

const isOpen = ref(false);
const query = ref('');
const activeIndex = ref(0);
const rawResults = ref<SearchItem[]>([]);
const inputComponentRef = ref<any>(null);

const placeholderText = computed(() => {
  return props.locale === 'id' 
    ? 'Ketik perintah atau cari sesuatu...' 
    : 'Type a command or search...';
});

// Prepend static actions based on locale
const staticActions = computed<any[]>(() => {
  const prefix = props.locale === 'id' ? '/id' : '';
  const typeNav = props.locale === 'id' ? 'Navigasi' : 'Navigation';
  const typeAction = props.locale === 'id' ? 'Aksi' : 'Action';

  const navs = [
    { name: 'Home', url: `${prefix || '/'}`, icon: '🏠', type: typeNav, description: props.locale === 'id' ? 'Kembali ke Beranda' : 'Go to homepage' },
    { name: 'Projects', url: `${prefix}/projects`, icon: '🚀', type: typeNav, description: props.locale === 'id' ? 'Lihat proyek profesional' : 'View professional projects' },
    { name: 'Systems', url: `${prefix}/systems`, icon: '🕸️', type: typeNav, description: props.locale === 'id' ? 'Eksplorasi arsitektur sistem' : 'Interactive systems & dependency explorer' },
    { name: 'Case Studies', url: `${prefix}/case-studies`, icon: '📄', type: typeNav, description: props.locale === 'id' ? 'Studi kasus mendalam' : 'In-depth engineering write-ups' },
    { name: 'Notes', url: `${prefix}/notes`, icon: '📝', type: typeNav, description: props.locale === 'id' ? 'Catatan teknis dan ringkasan' : 'Technical notes and quick guides' },
    { name: 'Certificates', url: `${prefix}/certificates`, icon: '🏅', type: typeNav, description: props.locale === 'id' ? 'Kubah sertifikat terverifikasi' : 'Professional credentials vault' },
    { name: 'Resume', url: `${prefix}/resume`, icon: '💼', type: typeNav, description: props.locale === 'id' ? 'Kerja dan riwayat pengalaman' : 'Detailed work experience' },
    { name: 'Guestbook', url: `${prefix}/guestbook`, icon: '📖', type: typeNav, description: props.locale === 'id' ? 'Tulis tanda tangan buku tamu' : 'Leave a signature on the guestbook' },
    { name: 'System Analytics', url: `${prefix}/analytics`, icon: '📊', type: typeNav, description: props.locale === 'id' ? 'Telemetri sistem dan latency' : 'Real-time database and latency metrics' },
    { name: 'Contact', url: `${prefix}/contact`, icon: '✉️', type: typeNav, description: props.locale === 'id' ? 'Hubungi untuk kolaborasi' : 'Get in touch' },
  ];

  const themes = [
    { name: props.locale === 'id' ? 'Ubah ke Mode Gelap' : 'Switch to Dark Theme', icon: '🌙', type: typeAction, description: props.locale === 'id' ? 'Atur tema menjadi gelap' : 'Set interface preference to dark mode', action: 'theme-dark' },
    { name: props.locale === 'id' ? 'Ubah ke Mode Terang' : 'Switch to Light Theme', icon: '☀️', type: typeAction, description: props.locale === 'id' ? 'Atur tema menjadi terang' : 'Set interface preference to light mode', action: 'theme-light' },
    { name: props.locale === 'id' ? 'Gunakan Tema Sistem' : 'Use System Theme', icon: '💻', type: typeAction, description: props.locale === 'id' ? 'Sesuaikan tema bawaan browser' : 'Match browser preference settings', action: 'theme-system' },
  ];

  const languages = [
    { name: props.locale === 'id' ? 'Ubah ke Bahasa Inggris (EN)' : 'Switch to Indonesian (ID)', icon: props.locale === 'id' ? '🇬🇧' : '🇮🇩', type: typeAction, description: props.locale === 'id' ? 'Change site language to English' : 'Ubah bahasa situs menjadi Bahasa Indonesia', action: props.locale === 'id' ? 'lang-en' : 'lang-id' }
  ];

  return [...navs, ...themes, ...languages];
});

// Watch query to trigger Fuse search
watch(query, async (newVal) => {
  activeIndex.value = 0;
  rawResults.value = await search(newVal, props.locale);
});

// Merge static actions and Fuse results
const filteredResults = computed(() => {
  const list = [...staticActions.value, ...rawResults.value];
  const q = query.value.trim().toLowerCase();
  
  if (!q) {
    // If query is empty, return navs, themes, and language switches
    return staticActions.value.slice(0, 8);
  }

  // Filter matching static actions or Fuse outputs
  return list.filter(item => {
    const title = (item.title || item.name || '').toLowerCase();
    const desc = (item.excerpt || item.description || '').toLowerCase();
    const type = (item.type || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    return title.includes(q) || desc.includes(q) || type.includes(q) || cat.includes(q);
  }).slice(0, 8);
});

// Methods
const open = () => {
  isOpen.value = true;
  query.value = '';
  activeIndex.value = 0;
  nextTick(() => {
    inputComponentRef.value?.focusInput();
  });
};

const close = () => {
  isOpen.value = false;
};

const executeAction = (item: any) => {
  const activeEl = document.querySelector('.result-item.active') as HTMLElement | null;
  
  const proceed = () => {
    close();
    if (item.action) {
      if (item.action.startsWith('theme-')) {
        const theme = item.action.replace('theme-', '');
        localStorage.setItem('theme', theme);
        if (theme === 'system') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
          document.documentElement.setAttribute('data-theme', theme);
        }
        
        // Dispatch custom theme change event to notify other UI parts
        window.dispatchEvent(new Event('theme-change'));
      } else if (item.action === 'lang-en') {
        const target = window.location.pathname.replace(/^\/id/, '') || '/';
        window.location.href = target;
      } else if (item.action === 'lang-id') {
        const current = window.location.pathname;
        const target = current.startsWith('/id') ? current : `/id${current === '/' ? '' : current}`;
        window.location.href = target;
      }
    } else if (item.url) {
      window.location.href = item.url;
    }
  };

  if (activeEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    activeEl.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.96)', opacity: 0 }
    ], {
      duration: 150,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards'
    }).onfinish = proceed;
  } else {
    proceed();
  }
};

// Key Handlers
const handleInputKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % filteredResults.value.length;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + filteredResults.value.length) % filteredResults.value.length;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (filteredResults.value[activeIndex.value]) {
      executeAction(filteredResults.value[activeIndex.value]);
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    close();
  }
};

const handleGlobalKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    if (isOpen.value) close();
    else open();
  } else if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault();
    close();
  }
};

// Focus trap on Tab key
const handleFocusTrap = (e: KeyboardEvent) => {
  if (!isOpen.value) return;
  if (e.key === 'Tab') {
    e.preventDefault(); // keyboard selection is done via arrow keys only
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown);
  document.addEventListener('keydown', handleFocusTrap);
  window.addEventListener('open-command-palette', open);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown);
  document.removeEventListener('keydown', handleFocusTrap);
  window.removeEventListener('open-command-palette', open);
});
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
}

.command-palette {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg, 12px);
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 90vw;
  margin: 10vh auto auto;
  overflow: hidden;
  height: fit-content;
}

.palette-container {
  display: flex;
  flex-direction: column;
}

:deep(.sentinel-crab-container.search) {
  right: 4.5rem;
}

/* Transitions — backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 120ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Command palette panel scale */
.fade-enter-active .command-palette,
.fade-leave-active .command-palette {
  transition: transform 120ms cubic-bezier(0.22, 1, 0.36, 1), opacity 120ms ease;
}

.fade-enter-from .command-palette,
.fade-leave-to .command-palette {
  transform: scale(0.95) translateY(-8px);
  opacity: 0;
}
</style>
