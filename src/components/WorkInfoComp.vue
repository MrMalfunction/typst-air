<script setup>
import draggable from 'vuedraggable'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { storeToRefs } from 'pinia'
import EntryCard from 'src/components/EntryCard.vue'
import BulletList from 'src/components/BulletList.vue'
import { ref } from 'vue'
import { generateId } from 'src/util/id-generator.js'

const workInfoStore = useWorkInfoStore()
const { work } = storeToRefs(workInfoStore)

// Only one entry is expanded at a time
const openId = ref(null)
const toggleEntry = (id, open) => {
  openId.value = open ? id : null
}
const openEntry = (index) => {
  openId.value = work.value[index]?.id ?? null
}
defineExpose({ openEntry })

const dateRange = (entry) => [entry.startDate, entry.endDate].filter(Boolean).join(' – ')

const createDefaultWorkEntry = () => ({
  id: Date.now(),
  title: 'Position Title',
  company: 'Company Name',
  location: 'Location',
  startDate: 'Start Date',
  endDate: 'End Date',
  points: [
    { id: generateId(), value: 'Key achievement or responsibility 1' },
    { id: generateId(), value: 'Key achievement or responsibility 2' },
  ],
})

const addWork = () => {
  const newEntry = createDefaultWorkEntry()
  work.value.push(newEntry)
  openId.value = newEntry.id
}

const removeWork = (index) => {
  if (work.value.length > 1) {
    work.value.splice(index, 1)
  } else {
    work.value[0] = createDefaultWorkEntry()
  }
}
</script>

<template>
  <!-- Work Experience Section -->
  <div class="col-12">
    <draggable v-model="work" class="q-gutter-y-sm" handle=".drag-handle" item-key="id">
      <template #item="{ element, index }">
        <EntryCard
          :data-work-index="index"
          :expanded="openId === element.id"
          :subtitle="[element.company, dateRange(element)].filter(Boolean).join(' · ')"
          :title="element.title"
          placeholder="Untitled position"
          @delete="removeWork(index)"
          @update:expanded="(open) => toggleEntry(element.id, open)"
        >
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input v-model="element.title" dense label="Position title" outlined />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="element.company" dense label="Company" outlined />
            </div>
            <div class="col-12 col-sm-4">
              <q-input v-model="element.location" dense label="Location" outlined />
            </div>
            <div class="col-6 col-sm-4">
              <q-input v-model="element.startDate" dense label="Start" outlined />
            </div>
            <div class="col-6 col-sm-4">
              <q-input v-model="element.endDate" dense label="End" outlined />
            </div>
          </div>
          <BulletList v-model="element.points" class="q-mt-sm" rich />
        </EntryCard>
      </template>
    </draggable>
    <q-btn
      class="q-mt-sm"
      color="primary"
      dense
      flat
      icon="add"
      label="Add work experience"
      no-caps
      @click="addWork"
    />
  </div>
</template>
