<script setup>
import { storeToRefs } from 'pinia'
import { useEducationInfoStore } from 'stores/education-info-store.js'
import draggable from 'vuedraggable'
import { ref } from 'vue'
import { generateId } from 'src/util/id-generator.js'
import EntryCard from 'src/components/EntryCard.vue'
import BulletList from 'src/components/BulletList.vue'

const eduInfoStore = useEducationInfoStore()
const { education } = storeToRefs(eduInfoStore)

// Only one entry is expanded at a time
const openId = ref(null)
const toggleEntry = (id, open) => {
  openId.value = open ? id : null
}
const openEntry = (index) => {
  openId.value = education.value[index]?.id ?? null
}
defineExpose({ openEntry })

const dateRange = (entry) => [entry.startDate, entry.endDate].filter(Boolean).join(' – ')

// Default education entry template
const createDefaultEducationEntry = () => ({
  id: Date.now(),
  institution: 'Institution Name',
  location: 'Location',
  startDate: 'Start Date',
  endDate: 'End Date',
  degree: 'Degree Name',
  points: [
    { id: generateId(), value: 'Achievement or responsibility 1' },
    { id: generateId(), value: 'Achievement or responsibility 2' },
  ],
})

const addEducation = () => {
  const newEntry = createDefaultEducationEntry()
  education.value.push(newEntry)
  openId.value = newEntry.id
}

const removeEducation = (index) => {
  if (education.value.length > 1) {
    education.value.splice(index, 1)
  } else {
    // If it's the last education entry, reset it to default values instead of removing
    education.value[0] = createDefaultEducationEntry()
  }
}
</script>

<template>
  <!-- Education Section -->
  <div class="col-12">
    <draggable
      v-model="eduInfoStore.education"
      class="q-gutter-y-sm"
      handle=".drag-handle"
      item-key="id"
    >
      <template #item="{ element, index }">
        <EntryCard
          :data-education-index="index"
          :expanded="openId === element.id"
          :subtitle="[element.degree, dateRange(element)].filter(Boolean).join(' · ')"
          :title="element.institution"
          placeholder="Untitled school"
          @delete="removeEducation(index)"
          @update:expanded="(open) => toggleEntry(element.id, open)"
        >
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input v-model="element.institution" dense label="Institution" outlined />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="element.degree" dense label="Degree" outlined />
            </div>
            <div class="col-12 col-sm-4">
              <q-input v-model="element.location" dense label="Location" outlined />
            </div>
            <div class="col-6 col-sm-4">
              <q-input
                v-model="element.startDate"
                dense
                label="Start"
                outlined
                placeholder="Optional"
              />
            </div>
            <div class="col-6 col-sm-4">
              <q-input v-model="element.endDate" dense label="End" outlined />
            </div>
          </div>
          <BulletList
            v-model="element.points"
            class="q-mt-sm"
            default-text="Achievement or responsibility"
          />
        </EntryCard>
      </template>
    </draggable>
    <q-btn
      class="q-mt-sm"
      color="primary"
      dense
      flat
      icon="add"
      label="Add education"
      no-caps
      @click="addEducation"
    />
  </div>
</template>

<style scoped></style>
