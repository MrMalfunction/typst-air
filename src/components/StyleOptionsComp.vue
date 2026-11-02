<script setup>
import { storeToRefs } from 'pinia'
import { useStyleStore } from 'stores/style-store.js'

const styleStore = useStyleStore()
const { fontSizePt, colorCheck, marginInches } = storeToRefs(styleStore)
</script>

<template>
  <q-btn flat dense no-caps icon="tune" label="Layout">
    <q-menu anchor="bottom right" self="top right">
      <div class="q-pa-md layout-menu">
        <div class="text-subtitle2 q-mb-sm">Page</div>
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-input
              v-model.number="fontSizePt"
              dense
              label="Font size"
              outlined
              step="0.1"
              suffix="pt"
              type="number"
            />
          </div>
          <div class="col-6">
            <q-input
              v-model.number="marginInches"
              dense
              label="Margin"
              max="0.9"
              min="0.1"
              outlined
              step="0.1"
              suffix="in"
              type="number"
            />
          </div>
        </div>
        <q-toggle v-model="colorCheck" class="q-mt-sm" dense label="Colored headings" />
      </div>
    </q-menu>
  </q-btn>
</template>

<style scoped>
.layout-menu {
  width: 300px;
}
</style>
