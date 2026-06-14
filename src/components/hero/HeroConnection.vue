<template>
  <line 
    :x1="x1" 
    :y1="y1" 
    :x2="x2" 
    :y2="y2" 
    stroke-width="1.5" 
    class="mesh-line" 
  />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}>();
</script>

<style scoped>
.mesh-line {
  stroke: var(--border);
  opacity: 0.45;
  transition: stroke 0.2s, opacity 0.2s;
}

:global([data-theme="light"]) .mesh-line {
  stroke: var(--subtle);
  opacity: 0.18;
}
</style>
