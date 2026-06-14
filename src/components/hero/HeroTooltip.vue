<template>
  <div 
    class="node-tooltip" 
    :class="{ hidden: !visible }"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div class="tooltip-header">
      <span class="tooltip-title">{{ title }}</span>
      <span class="tooltip-badge">{{ badge }}</span>
    </div>
    <p class="tooltip-desc">{{ desc }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  visible: boolean;
  x: number;
  y: number;
  title: string;
  badge: string;
  desc: string;
}>();
</script>

<style scoped>
.node-tooltip {
  position: absolute;
  transform: translate(-50%, -100%);
  background: rgba(18, 26, 44, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.65rem 0.85rem;
  pointer-events: none;
  z-index: 50;
  width: 200px;
  box-shadow: var(--shadow-md);
  opacity: 1;
  transition: opacity var(--duration-fast);
}

:global([data-theme="light"]) .node-tooltip {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.node-tooltip.hidden {
  opacity: 0;
  pointer-events: none;
}

.tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.tooltip-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text);
}

.tooltip-badge {
  font-size: 0.65rem;
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  color: var(--accent);
  font-weight: 700;
}

.tooltip-desc {
  font-size: 0.72rem;
  color: var(--muted);
  line-height: 1.25;
}
</style>
