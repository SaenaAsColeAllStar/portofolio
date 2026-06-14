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
  background: rgba(13, 17, 24, 0.95);
  border: 1px solid var(--accent, #4f8cff);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
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
  border-bottom: 1px solid var(--border, #242936);
  padding-bottom: 0.3rem;
  margin-bottom: 0.3rem;
}
.tooltip-header strong {
  color: var(--text, #f0f4fc);
}
.tooltip-header .code {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.7rem;
  color: var(--muted, #8ea0c4);
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
