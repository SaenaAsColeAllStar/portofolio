<template>
  <div class="globe-tooltip" :style="{ left: x + 'px', top: y + 'px' }">
    <div class="tooltip-header">
      <span class="flag-placeholder">🌐</span>
      <strong>{{ country.name }}</strong>
      <span class="code">{{ country.code }}</span>
    </div>
    <div class="tooltip-body">
      <div class="metric-row">
        <span class="label">Visits</span>
        <span class="value font-mono text-accent">{{ country.visits }}</span>
      </div>
      <div class="metric-row">
        <span class="label">Last Seen</span>
        <span class="value">{{ formatRelativeTime(country.lastSeen) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatRelativeTime } from '../../utils/globe-math';

defineProps({
  country: {
    type: Object,
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.globe-tooltip {
  position: absolute;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  pointer-events: none;
  font-size: 0.8rem;
  z-index: 100;
  min-width: 150px;
}
.tooltip-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.3rem;
  margin-bottom: 0.3rem;
}
.tooltip-header strong {
  color: var(--text);
}
.tooltip-header .code {
  background: var(--btn-secondary-bg);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.7rem;
  color: var(--muted);
}
.metric-row {
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
}
.metric-row .label {
  color: var(--muted, #8ea0c4);
}
.metric-row .value {
  font-weight: 500;
}
</style>
