<template>
  <div class="cta-container">
    <a 
      v-if="ctaType === 'link'" 
      :href="ctaHref" 
      class="cta-button btn-pulse"
      data-magnetic
      data-magnetic-strength="0.25"
      data-cursor="explore"
    >
      {{ ctaLabel }}
    </a>
    <button 
      v-else-if="ctaType === 'chat'" 
      class="cta-button btn-pulse" 
      data-magnetic
      data-magnetic-strength="0.25"
      data-cursor="open"
      @click="triggerChat"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  nodeId: string;
  locale: 'en' | 'id';
}>();

const ctaType = computed(() => {
  return props.nodeId === 'ai' ? 'chat' : 'link';
});

const ctaHref = computed(() => {
  const prefix = props.locale === 'id' ? '/id' : '';
  switch (props.nodeId) {
    case 'infrastructure':
    case 'cloud':
      return `${prefix}/case-studies`;
    case 'automation':
    case 'product':
      return `${prefix}/projects`;
    case 'architecture':
      return `${prefix}/resume`;
    default:
      return `${prefix}/`;
  }
});

const ctaLabel = computed(() => {
  if (props.locale === 'id') {
    switch (props.nodeId) {
      case 'infrastructure':
      case 'cloud':
        return 'Baca Studi Kasus';
      case 'automation':
      case 'product':
        return 'Lihat Proyek';
      case 'ai':
        return 'Tanya Asisten AI';
      case 'architecture':
        return 'Lihat Resume Arsitek';
      default:
        return 'Eksplorasi';
    }
  } else {
    switch (props.nodeId) {
      case 'infrastructure':
      case 'cloud':
        return 'Read Case Studies';
      case 'automation':
      case 'product':
        return 'View Projects';
      case 'ai':
        return 'Consult System AI';
      case 'architecture':
        return 'View Architect Resume';
      default:
        return 'Explore';
    }
  }
});

const triggerChat = () => {
  const trigger = document.getElementById('chat-widget-trigger');
  if (trigger) {
    trigger.click();
    
    // Autofocus chat input if window opened
    setTimeout(() => {
      const input = document.getElementById('chat-widget-input');
      if (input) input.focus();
    }, 100);
  }
};
</script>

<style scoped>
.cta-container {
  margin-top: 1rem;
  display: flex;
}

.cta-button {
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #0f172a; /* high-contrast dark text for premium gold background */
  font-weight: 700;
  text-decoration: none;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(212, 163, 89, 0.25);
  display: inline-block;
  width: 100%;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(212, 163, 89, 0.4);
}

.cta-button:active {
  transform: translateY(0);
}
</style>
