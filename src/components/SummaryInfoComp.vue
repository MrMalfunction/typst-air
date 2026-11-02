<script setup>
import { useSummaryStore } from 'stores/summary-store.js'
import { storeToRefs } from 'pinia'

const summaryStore = useSummaryStore()
const { summary } = storeToRefs(summaryStore)
</script>

<template>
  <div class="col-12">
    <div class="text-h6">Summary</div>
    <q-input
      v-model="summary"
      autogrow
      counter
      dense
      maxlength="500"
      outlined
      placeholder="Optional: a short summary about you"
      type="textarea"
    />
  </div>
</template>

<style scoped></style>
