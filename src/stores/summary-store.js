import { defineStore } from 'pinia'
import { ref } from 'vue'
import { escapeTypstSpecialChars } from 'src/util/typst_conv.js'

export const useSummaryStore = defineStore('summary', () => {
  const summary = ref('')

  function $reset() {
    summary.value = ''
  }

  function formatTYPST() {
    return escapeTypstSpecialChars(summary.value)
  }

  return { summary, $reset, formatTYPST }
})
