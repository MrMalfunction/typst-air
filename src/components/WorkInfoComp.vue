<script setup>
import draggable from 'vuedraggable'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { storeToRefs } from 'pinia'
import { handleEditorPaste } from 'src/util/paste_format_handler.js'
import AiFineTunePopup from 'src/components/ai-fine-tune-popup.vue'
import { ref, watch } from 'vue'

const workInfoStore = useWorkInfoStore()
const { work } = storeToRefs(workInfoStore)

const selectedCompanyName = ref('')
const selectedStringsArray = ref([])
const showPopup = ref(false)
const workBackups = ref({}) // Store backups of work points

// Function to create a deep copy of a work entry's points
const backupWorkPoints = (workId) => {
  workBackups.value[workId] = JSON.parse(
    JSON.stringify(work.value.find((w) => w.id === workId)?.points || []),
  )
}

// Initial backup of all work entries
watch(
  work,
  (newWork) => {
    newWork.forEach((entry) => {
      if (!workBackups.value[entry.id]) {
        backupWorkPoints(entry.id)
      }
    })
  },
  { immediate: true, deep: true },
)

const createDefaultWorkEntry = () => ({
  id: Date.now(),
  title: 'Position Title',
  company: 'Company Name',
  location: 'Location',
  startDate: 'Start Date',
  endDate: 'End Date',
  points: ['Key achievement or responsibility 1', 'Key achievement or responsibility 2'],
})

const addWork = () => {
  const newEntry = createDefaultWorkEntry()
  work.value.push(newEntry)
  backupWorkPoints(newEntry.id) // Backup the new entry's points
}

const removeWork = (index) => {
  if (work.value.length > 1) {
    work.value.splice(index, 1)
  } else {
    const newEntry = createDefaultWorkEntry()
    work.value[0] = newEntry
    backupWorkPoints(newEntry.id)
  }
}

const addWorkBulletPoint = (workIndex) => {
  const newPointNumber = work.value[workIndex].points.length + 1
  work.value[workIndex].points.push(`Key achievement or responsibility ${newPointNumber}`)
}

const removeWorkBulletPoint = (workIndex, pointIndex) => {
  const points = work.value[workIndex].points
  if (points.length > 1) {
    points.splice(pointIndex, 1)
  } else {
    points[0] = 'Key achievement or responsibility 1'
  }
}

const handleUpdateStrings = (strings) => {
  if (!Array.isArray(strings) || !selectedCompanyName.value) return

  // Find the work entry with the matching company name
  const workIndex = work.value.findIndex((w) => w.company === selectedCompanyName.value)
  if (workIndex !== -1) {
    // Update the points of the matching work entry
    work.value[workIndex].points = strings
  }
}
const handleDialogStatus = (status) => {
  showPopup.value = status
}

const restoreWorkPoints = (index) => {
  const workId = work.value[index].id
  if (workBackups.value[workId]) {
    work.value[index].points = JSON.parse(JSON.stringify(workBackups.value[workId]))
  }
}

const openAiPopup = (company, points) => {
  showPopup.value = true
  selectedCompanyName.value = company
  selectedStringsArray.value = points
}
</script>

<template>
  <!-- Work Experience Section -->
  <div class="col-12">
    <div class="text-h6">Work Experience</div>
    <draggable v-model="work" class="q-gutter-y-md" handle=".drag-handle" item-key="id">
      <template #item="{ element, index }">
        <q-card class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="element.title" label="Position Title" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="element.company" label="Company" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="element.location" label="Location" outlined required />
            </div>
            <div class="col-6">
              <q-input v-model="element.startDate" label="Start Date" outlined required />
            </div>
            <div class="col-6">
              <q-input v-model="element.endDate" label="End Date" outlined required />
            </div>
            <div class="col-12">
              <div class="row justify-end q-mb-sm">
                <q-btn
                  class="q-mr-sm"
                  color="warning"
                  icon="restore"
                  size="sm"
                  push
                  @click="restoreWorkPoints(index)"
                >
                  <q-tooltip>Restore original points</q-tooltip>
                </q-btn>
                <q-btn
                  label="AI"
                  push
                  size="size-md"
                  @click="openAiPopup(element.company, element.points)"
                >
                  <img alt="AI Button" height="32px" src="../assets/ai-icon.png" width="32px" />
                  <q-tooltip>Fine Tune points to a job.</q-tooltip>
                </q-btn>
              </div>
              <div v-for="(_, pointIndex) in element.points" :key="pointIndex">
                <div class="row q-col-gutter-sm items-center q-mb-sm">
                  <div class="col">
                    <q-editor
                      v-model="element.points[pointIndex]"
                      :fonts="{ arial: 'Arial' }"
                      :toolbar="[['bold'], ['link'], ['undo', 'redo']]"
                      content-class="editor-content"
                      min-height="5rem"
                      @paste="handleEditorPaste"
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="negative"
                      flat
                      icon="remove"
                      round
                      @click="removeWorkBulletPoint(index, pointIndex)"
                    />
                  </div>
                </div>
              </div>
              <q-btn
                class="q-mt-sm"
                color="primary"
                flat
                icon="add"
                label="Add Bullet Point"
                @click="addWorkBulletPoint(index)"
              />
            </div>
          </div>
          <div class="col-12 row items-center">
            <q-btn class="drag-handle" flat icon="drag_indicator" round >
              <q-tooltip hove>Drag and rearrange order</q-tooltip>
            </q-btn>
            <q-btn
              class="q-ml-auto"
              color="negative"
              flat
              icon="delete"
              round
              @click="removeWork(index)"
            >
              <q-tooltip>Delete Entry</q-tooltip>
            </q-btn>
          </div>
        </q-card>
      </template>
    </draggable>
    <q-btn
      class="q-mt-md"
      color="primary"
      icon="add"
      label="Add Work Experience"
      @click="addWork"
    />
  </div>
  <!-- Insert the popup component here -->
  <ai-fine-tune-popup
    v-if="showPopup"
    :section="selectedCompanyName"
    :stringsArray="selectedStringsArray"
    @dialogStatus="handleDialogStatus"
    @updateStrings="handleUpdateStrings"
  />
</template>
