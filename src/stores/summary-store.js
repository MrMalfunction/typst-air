import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSummaryStore = defineStore('summary', () => {
  const summary = ref('')

  function $reset() {
    summary.value = ''
  }

  return { summary, $reset }
})
