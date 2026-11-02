<script setup>
import draggable from 'vuedraggable'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { storeToRefs } from 'pinia'
import EntryCard from 'src/components/EntryCard.vue'
import BulletList from 'src/components/BulletList.vue'
import { ref } from 'vue'
import { generateId } from 'src/util/id-generator.js'

const projectInfoStore = useProjectInfoStore()
const { projects } = storeToRefs(projectInfoStore)

// Only one entry is expanded at a time
const openId = ref(null)
const toggleEntry = (id, open) => {
  openId.value = open ? id : null
}
const openEntry = (index) => {
  openId.value = projects.value[index]?.id ?? null
}
defineExpose({ openEntry })

const dateRange = (entry) => [entry.startDate, entry.endDate].filter(Boolean).join(' – ')

const createDefaultProjectEntry = () => ({
  id: Date.now(),
  name: 'Project Name',
  role: 'Role (Optional)',
  startDate: 'Start Date',
  endDate: 'End Date',
  url: 'project-url.com',
  points: [
    { id: generateId(), value: 'Key achievement or responsibility 1' },
    { id: generateId(), value: 'Key achievement or responsibility 2' },
  ],
})

const addProject = () => {
  const newEntry = createDefaultProjectEntry()
  projects.value.push(newEntry)
  openId.value = newEntry.id
}

const removeProject = (index) => {
  if (projects.value.length > 1) {
    projects.value.splice(index, 1)
  } else {
    projects.value[0] = createDefaultProjectEntry()
  }
}
</script>

<template>
  <div class="col-12">
    <draggable v-model="projects" class="q-gutter-y-sm" handle=".drag-handle" item-key="id">
      <template #item="{ element, index }">
        <EntryCard
          :data-project-index="index"
          :expanded="openId === element.id"
          :subtitle="[element.role, dateRange(element)].filter(Boolean).join(' · ')"
          :title="element.name"
          placeholder="Untitled project"
          @delete="removeProject(index)"
          @update:expanded="(open) => toggleEntry(element.id, open)"
        >
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input v-model="element.name" dense label="Project name" outlined />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="element.role" dense label="Role" outlined placeholder="Optional" />
            </div>
            <div class="col-12 col-sm-4">
              <q-input v-model="element.url" dense label="URL" outlined placeholder="Optional" />
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
      label="Add project"
      no-caps
      @click="addProject"
    />
  </div>
</template>
