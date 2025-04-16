<template>
  <div>
    <label>
      Font Size (pt):
      <input type="number" v-model="fontSizePt" step="0.1" />
    </label>
    <br />
    <label>
      Enable Color Check:
      <input type="checkbox" v-model="colorCheck" />
    </label>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useStyleStore } from 'stores/style-store.js'

export default {
  name: 'StyleOptionsComp',
  setup() {
    const styleStore = useStyleStore()
    const { fontSizePt, colorCheck } = storeToRefs(styleStore)

    return {
      fontSizePt,
      colorCheck,
    }
  },
}
</script>

<style scoped>
/* Add any styles here if needed */
</style>
