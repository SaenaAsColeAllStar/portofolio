<template>
  <!-- Render either a curved path or a simple line based on props -->
  <path 
    v-if="pathD" 
    :d="pathD" 
    class="signal-line ring-flow" 
  />
  <line 
    v-else 
    :x1="x1" 
    :y1="y1" 
    :x2="x2" 
    :y2="y2" 
    class="signal-line" 
    :class="spokeClass" 
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  pathD?: string;
  spokeClass?: string;
}>();
</script>

<style scoped>
.signal-line {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  opacity: 0.6;
  stroke-linecap: round;
}

.spoke-1 { stroke-dasharray: 6 30; animation: signalSpoke 2.5s linear infinite; }
.spoke-2 { stroke-dasharray: 6 30; animation: signalSpoke 3s linear infinite reverse; }
.spoke-3 { stroke-dasharray: 6 30; animation: signalSpoke 2.2s linear infinite; }
.spoke-4 { stroke-dasharray: 6 30; animation: signalSpoke 3.5s linear infinite reverse; }
.spoke-5 { stroke-dasharray: 6 30; animation: signalSpoke 2.8s linear infinite; }

.ring-flow {
  stroke-dasharray: 8 36;
  animation: signalSpoke 8s linear infinite;
  stroke: var(--accent-strong);
  stroke-width: 2px;
}

@keyframes signalSpoke {
  to {
    stroke-dashoffset: -100;
  }
}
</style>
