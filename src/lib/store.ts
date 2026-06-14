import { ref } from 'vue';

// Reactive state variables
export const isSearchOpen = ref(false);
export const isChatOpen = ref(false);
export const activeTheme = ref('dark');
export const currentLocale = ref('en');

// State transition helpers
export function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value;
}

export function openSearch() {
  isSearchOpen.value = true;
}

export function closeSearch() {
  isSearchOpen.value = false;
}

export function toggleChat() {
  isChatOpen.value = !isChatOpen.value;
}

export function openChat() {
  isChatOpen.value = true;
}

export function closeChat() {
  isChatOpen.value = false;
}

export function setTheme(theme: 'light' | 'dark') {
  activeTheme.value = theme;
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export function setLocale(locale: 'en' | 'id') {
  currentLocale.value = locale;
}
