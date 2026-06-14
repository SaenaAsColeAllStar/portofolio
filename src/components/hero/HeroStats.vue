<template>
  <div class="drawer-stats">
    <div class="meta-section">
      <h4>{{ locale === 'en' ? 'Performance / Output' : 'Performa / Output' }}</h4>
      <span class="metric-badge">{{ metric }}</span>
    </div>

    <div class="meta-section">
      <h4>{{ locale === 'en' ? 'Core Technology Stack' : 'Pilar Teknologi Utama' }}</h4>
      <ul class="stack-list">
        <li v-for="tech in stack" :key="tech" class="tech-tag">
          {{ tech }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  metric: string;
  stack: string[];
  locale: 'en' | 'id';
}>();
</script>

<style scoped>
.drawer-stats {
  display: grid;
  gap: var(--spacing-md, 1rem);
}

.meta-section {
  display: grid;
  gap: 0.25rem;
}

.meta-section h4 {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 600;
}

.metric-badge {
  font-size: 0.875rem;
  color: var(--success);
  font-weight: 700;
}

.stack-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--border);
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: var(--text);
  font-family: monospace;
}
</style>
