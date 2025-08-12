<script setup>
import { watch } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useDarkModeStore } from 'src/stores/dark-mode-store.js'

const $q = useQuasar()
const darkModeStore = useDarkModeStore()
const { isDark } = storeToRefs(darkModeStore)

// Sync Quasar dark mode with store
watch(
  isDark,
  (val) => {
    $q.dark.set(val)
  },
  { immediate: true },
)

const toggleDark = () => {
  darkModeStore.toggleDark()
}
</script>

<template>
  <div class="dark-toggle-container">
    <q-btn
      :icon="isDark ? 'dark_mode' : 'light_mode'"
      :color="isDark ? 'white' : 'primary'"
      :text-color="isDark ? 'primary' : 'white'"
      flat
      round
      size="md"
      @click="toggleDark"
      class="q-ml-md"
    >
      <q-tooltip>{{ isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</q-tooltip>
    </q-btn>
  </div>
</template>

<style scoped>
.dark-toggle-container {
  position: relative;
  display: inline-block;
}
</style>
