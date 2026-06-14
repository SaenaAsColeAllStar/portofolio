<template>
  <ul ref="listRef" class="command-results" id="command-results" role="listbox">
    <li v-if="results.length === 0" class="empty-state">
      {{ locale === 'id' ? 'Hasil tidak ditemukan' : 'No results found' }}
    </li>
    
    <li 
      v-for="(item, idx) in results" 
      :key="idx"
      class="result-item"
      :class="{ active: idx === activeIndex }"
      role="option"
      :aria-selected="idx === activeIndex"
      @click="$emit('select', item)"
      @mouseenter="$emit('hover-index', idx)"
    >
      <span class="icon">{{ getIcon(item) }}</span>
      <div class="result-details">
        <div class="result-header">
          <span class="name">{{ item.title || item.name }}</span>
          <span class="badge-type">{{ item.type }}</span>
        </div>
        <span class="description" v-if="item.excerpt || item.description">
          {{ item.excerpt || item.description }}
        </span>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

interface SearchItem {
  title?: string;
  name?: string;
  excerpt?: string;
  description?: string;
  url: string;
  type: string;
  locale?: string;
  icon?: string;
  action?: string;
}

const props = defineProps<{
  results: SearchItem[];
  activeIndex: number;
  locale: 'en' | 'id';
}>();

const emit = defineEmits<{
  (e: 'select', item: SearchItem): void;
  (e: 'hover-index', index: number): void;
}>();

const listRef = ref<HTMLUListElement | null>(null);

const getIcon = (item: SearchItem) => {
  if (item.icon) return item.icon;
  switch (item.type.toLowerCase()) {
    case 'project':
    case 'proyek':
      return '🚀';
    case 'case study':
    case 'studi kasus':
      return '📄';
    case 'note':
    case 'technical note':
    case 'catatan':
    case 'catatan teknis':
      return '📝';
    case 'certificate':
    case 'sertifikat':
      return '🏅';
    default:
      return '🔍';
  }
};

watch(() => props.activeIndex, (newVal) => {
  const container = listRef.value;
  if (!container) return;
  const activeEl = container.children[newVal] as HTMLElement;
  if (activeEl) {
    activeEl.scrollIntoView({ block: 'nearest' });
  }
});
</script>

<style scoped>
.command-results {
  list-style: none;
  margin: 0;
  padding: 0.5rem;
  max-height: 330px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--subtle);
  font-size: 0.9rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  transition: background 0.15s, transform 0.15s;
}

.result-item.active {
  background: var(--btn-secondary-bg);
}

:global([data-theme="light"]) .result-item.active {
  background: rgba(15, 23, 42, 0.05);
}

.icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex-grow: 1;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text);
}

.badge-type {
  font-size: 0.65rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  color: var(--accent);
  font-weight: 700;
}

.description {
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.3;
}
</style>
