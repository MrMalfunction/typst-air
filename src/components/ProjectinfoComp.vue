<script setup>
import draggable from 'vuedraggable'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { storeToRefs } from 'pinia'
import { handleEditorPaste } from 'src/util/paste_format_handler.js'
import AiFineTunePopup from 'src/components/ai-fine-tune-popup.vue'
import { ref, watch } from 'vue'

const projectInfoStore = useProjectInfoStore()
const { projects } = storeToRefs(projectInfoStore)

const selectedProjectName = ref('')
const selectedStringsArray = ref([])
const showPopup = ref(false)
const projectBackups = ref({}) // Store backups of project points

// Function to create a deep copy of a project entry's points
const backupProjectPoints = (projectId) => {
  projectBackups.value[projectId] = JSON.parse(
    JSON.stringify(projects.value.find((p) => p.id === projectId)?.points || []),
  )
}

// Initial backup of all project entries
watch(
  projects,
  (newProjects) => {
    newProjects.forEach((entry) => {
      if (!projectBackups.value[entry.id]) {
        backupProjectPoints(entry.id)
      }
    })
  },
  { immediate: true, deep: true },
)

const createDefaultProjectEntry = () => ({
  id: Date.now(),
  name: 'Project Name',
  role: 'Role (Optional)',
  startDate: 'Start Date',
  endDate: 'End Date',
  url: 'project-url.com',
  points: ['Key achievement or responsibility 1', 'Key achievement or responsibility 2'],
})

const addProject = () => {
  const newEntry = createDefaultProjectEntry()
  projects.value.push(newEntry)
  backupProjectPoints(newEntry.id) // Backup the new entry's points
}

const removeProject = (index) => {
  if (projects.value.length > 1) {
    projects.value.splice(index, 1)
  } else {
    const newEntry = createDefaultProjectEntry()
    projects.value[0] = newEntry
    backupProjectPoints(newEntry.id)
  }
}

const addProjectBulletPoint = (projectIndex) => {
  const newPointNumber = projects.value[projectIndex].points.length + 1
  projects.value[projectIndex].points.push(`Key achievement or responsibility ${newPointNumber}`)
}

const removeProjectBulletPoint = (projectIndex, pointIndex) => {
  const points = projects.value[projectIndex].points
  if (points.length > 1) {
    points.splice(pointIndex, 1)
  } else {
    points[0] = 'Key achievement or responsibility 1'
  }
}

const handleUpdateStrings = (strings) => {
  if (!Array.isArray(strings) || !selectedProjectName.value) return

  // Find the project entry with the matching project name
  const projectIndex = projects.value.findIndex((p) => p.name === selectedProjectName.value)
  if (projectIndex !== -1) {
    // Update the points of the matching project entry
    projects.value[projectIndex].points = strings
  }
}

const handleDialogStatus = (status) => {
  showPopup.value = status
}

const restoreProjectPoints = (index) => {
  const projectId = projects.value[index].id
  if (projectBackups.value[projectId]) {
    projects.value[index].points = JSON.parse(JSON.stringify(projectBackups.value[projectId]))
  }
}

const openAiPopup = (company, points) => {
  showPopup.value = true
  selectedProjectName.value = company
  selectedStringsArray.value = points
}
</script>

<template>
  <div class="col-12">
    <div class="text-h6">Projects</div>
    <draggable v-model="projects" class="q-gutter-y-md" handle=".drag-handle" item-key="id">
      <template #item="{ element, index }">
        <q-card class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 row items-center">
              <q-btn class="drag-handle" flat icon="drag_indicator" round />
              <q-btn
                class="q-ml-auto"
                color="negative"
                flat
                icon="delete"
                round
                @click="removeProject(index)"
              />
            </div>
            <div class="col-12">
              <q-input v-model="element.name" label="Project Name" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="element.role" label="Role (Optional)" outlined />
            </div>
            <div class="col-12">
              <q-input v-model="element.url" label="Project URL (Optional)" outlined />
            </div>
            <div class="col-6">
              <q-input v-model="element.startDate" label="Start Date (Optional)" outlined />
            </div>
            <div class="col-6">
              <q-input v-model="element.endDate" label="End Date (Optional)" outlined />
            </div>
            <div class="col-12">
              <div class="row justify-end q-mb-sm">
                <q-btn
                  class="q-mr-sm"
                  color="warning"
                  icon="restore"
                  size="sm"
                  @click="restoreProjectPoints(index)"
                >
                  <q-tooltip>Restore original points</q-tooltip>
                </q-btn>
                <q-btn
                  label="AI"
                  push
                  size="size-md"
                  @click="openAiPopup(element.name, element.points)"
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
                      @click="removeProjectBulletPoint(index, pointIndex)"
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
                @click="addProjectBulletPoint(index)"
              />
            </div>
          </div>
        </q-card>
      </template>
    </draggable>
    <q-btn class="q-mt-md" color="primary" icon="add" label="Add Project" @click="addProject" />
  </div>
  <!-- AI fine-tune popup component -->
  <ai-fine-tune-popup
    v-if="showPopup"
    :section="selectedProjectName"
    :stringsArray="selectedStringsArray"
    @dialogStatus="handleDialogStatus"
    @updateStrings="handleUpdateStrings"
  />
</template>

<style scoped>
.drag-handle {
  cursor: move;
}
</style>
