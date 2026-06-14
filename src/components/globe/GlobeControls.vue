<template>
  <div class="globe-actions">
    <button 
      @click="$emit('toggle-rotation')" 
      class="control-btn" 
      :title="isRotating ? 'Pause rotation' : 'Start rotation'"
    >
      <svg v-if="isRotating" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    </button>
    <button @click="$emit('reset-orientation')" class="control-btn" title="Reset view">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  isRotating: {
    type: Boolean,
    required: true
  }
});
defineEmits(['toggle-rotation', 'reset-orientation']);
</script>

<style scoped>
.globe-actions {
  display: flex;
  gap: 0.5rem;
}
.control-btn {
  background: var(--btn-secondary-bg);
  border: 1px solid var(--border);
  color: var(--muted);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.control-btn:hover {
  background: var(--btn-secondary-hover);
  color: var(--text);
  border-color: var(--accent);
}
</style>
