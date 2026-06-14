<template>
  <line 
    :x1="x1" 
    :y1="y1" 
    :x2="x2" 
    :y2="y2" 
    stroke="var(--border)" 
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
  opacity: 0.12;
}
</style>
