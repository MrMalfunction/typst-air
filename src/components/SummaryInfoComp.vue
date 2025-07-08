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
      label="Summary"
      outlined
      type="textarea"
      autogrow
      hint="A brief summary about you."
      counter
      maxlength="300"
    />
  </div>
</template>

<style scoped></style>
