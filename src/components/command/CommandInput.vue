<template>
  <div class="input-wrapper">
    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input 
      ref="inputRef"
      type="text" 
      class="command-input" 
      :placeholder="placeholder"
      :value="modelValue"
      @input="onInput"
      @keydown="onKeyDown"
    />
    <span class="esc-badge">ESC</span>
    <button class="close-btn" @click="$emit('close')" aria-label="Close dialog">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'keydown', event: KeyboardEvent): void;
  (e: 'close'): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};

const onKeyDown = (e: KeyboardEvent) => {
  emit('keydown', e);
};

const focusInput = () => {
  inputRef.value?.focus();
};

defineExpose({
  focusInput
});
</script>

<style scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.search-icon {
  color: var(--muted);
  flex-shrink: 0;
}

.command-input {
  flex-grow: 1;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 1rem;
  outline: none;
  font-family: inherit;
  width: 100%;
}

.command-input::placeholder {
  color: var(--subtle);
}

.esc-badge {
  font-size: 0.7rem;
  background: var(--btn-secondary-bg);
  border: 1px solid var(--border);
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  color: var(--muted);
  font-weight: 600;
  cursor: default;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.close-btn:hover {
  background: var(--hover-bg);
  color: var(--text);
}
</style>
