<template>
  <g 
    class="node-group" 
    :class="{ active: isActive, hovered: isHovered, 'center-node': isCenter }"
    :transform="`translate(${data.x}, ${data.y})`"
    data-hero-node
    tabindex="0"
    role="button"
    :aria-label="data.title"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <circle :r="isCenter ? 32 : 22" class="node-bg" />
    <circle :r="isCenter ? 20 : 14" class="node-core" />
    <circle :r="isCenter ? 42 : 30" class="node-ring" />
    
    <!-- Render specific icons dynamically -->
    <!-- Infrastructure: Gear -->
    <path 
      v-if="data.iconType === 'path'" 
      d="M-5 -2 L-2 -5 L2 -5 L5 -2 L5 2 L2 5 L-2 5 L-5 2 Z" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="1.5" 
      class="node-icon" 
    />
    
    <!-- Cloud: Cloud outline -->
    <path 
      v-else-if="data.iconType === 'cloud'" 
      d="M-5 2 A3 3 0 0 1 -4 -2 A4 4 0 0 1 4 -2 A3 3 0 0 1 5 2 Z" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="1.5" 
      class="node-icon" 
    />
    
    <!-- Automation: Arrow loop -->
    <path 
      v-else-if="data.iconType === 'arrow'" 
      d="M-5 -2 A4 4 0 0 1 5 -2 L5 2 A4 4 0 0 1 -5 2 Z" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="1.5" 
      class="node-icon" 
    />
    
    <!-- AI: Brain dots/mesh -->
    <g v-else-if="data.iconType === 'brain'" class="node-icon">
      <circle cx="-4" cy="-2" r="1.5" fill="currentColor" />
      <circle cx="4" cy="-2" r="1.5" fill="currentColor" />
      <circle cx="0" cy="4" r="1.5" fill="currentColor" />
      <line x1="-4" y1="-2" x2="4" y2="-2" stroke="currentColor" stroke-width="1" />
      <line x1="-4" y1="-2" x2="0" y2="4" stroke="currentColor" stroke-width="1" />
      <line x1="4" y1="-2" x2="0" y2="4" stroke="currentColor" stroke-width="1" />
    </g>
    
    <!-- Product: Monitor screen -->
    <g v-else-if="data.iconType === 'monitor'" class="node-icon">
      <rect x="-6" y="-5" width="12" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" />
      <line x1="-3" y1="5" x2="3" y2="5" stroke="currentColor" stroke-width="1.5" />
    </g>
    
    <!-- Center Architecture: Star diamond -->
    <polygon 
      v-else-if="data.iconType === 'polygon'" 
      points="0,-10 6,0 0,10 -6,0" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      class="node-icon" 
    />
  </g>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface NodeData {
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  desc: string;
  stack: string[];
  metric: string;
  iconType: string;
}

const props = defineProps<{
  data: NodeData;
  isActive: boolean;
  isHovered: boolean;
  isCenter: boolean;
}>();

const emit = defineEmits<{
  (e: 'hover', payload: { id: string | null; event?: MouseEvent }): void;
  (e: 'click', id: string): void;
}>();

const onMouseEnter = (event: MouseEvent) => {
  emit('hover', { id: props.data.id, event });
};

const onMouseLeave = () => {
  emit('hover', { id: null });
};

const onClick = () => {
  emit('click', props.data.id);
};
</script>
