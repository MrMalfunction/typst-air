import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDarkModeStore = defineStore(
  'darkMode',
  () => {
    // Default to system preference if available, else false
    const prefersDark =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false

    const isDark = ref(prefersDark)

    function setDark(val) {
      isDark.value = val
    }

    function toggleDark() {
      isDark.value = !isDark.value
    }

    return {
      isDark,
      setDark,
      toggleDark,
    }
  },
  {
    persist: true,
  },
)
