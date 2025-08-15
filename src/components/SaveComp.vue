<script setup>
import { computed, ref } from 'vue'
import { useSaveManagerStore } from 'stores/resume-store'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'

const resumeStore = useSaveManagerStore()
const saveDialog = ref(false)
const saveResumeName = ref('')
const allResumeNames = computed(() => resumeStore.getSaves)
const selectedResumeName = ref('')
const confirmHeaderOverwrite = ref(false)
const confirmOverwrite = ref(false)
const overwriteName = ref('')

const personalInfoStore = usePersonalInfoStore()

const openSaveDialog = () => {
  saveResumeName.value = personalInfoStore.name || 'My Resume' // default name; user can change it
  saveDialog.value = true
}

const handleSave = () => {
  if (!saveResumeName.value.trim()) {
    return // Don't save with empty name
  }

  // Check if this name already exists and prompt for confirmation to overwrite
  if (allResumeNames.value.includes(saveResumeName.value)) {
    overwriteName.value = saveResumeName.value
    confirmOverwrite.value = true
    return
  }

  saveResume()
}

const saveResume = () => {
  try {
    // Use the name provided in the dialog to save the resume.
    resumeStore.saveState(saveResumeName.value)
    console.log(`Resume saved under key: ${saveResumeName.value}`)
    saveDialog.value = false
    confirmOverwrite.value = false
    // Update selectedResumeName so that the QSelect reflects the new entry.
    selectedResumeName.value = saveResumeName.value
  } catch (error) {
    console.error(`Error saving resume: ${error}`)
  }
}

const handleSelectResume = (name) => {
  if (!name) return

  try {
    resumeStore.restoreState(name)
    console.log(`Resume loaded from key: ${name}`)
  } catch (error) {
    console.error(`Error loading resume from key: ${name} with error ${error}`)
  }
}

const handleDelete = () => {
  try {
    resumeStore.deleteSave(selectedResumeName.value)
    console.log(`Resume deleted with key: ${selectedResumeName.value}`)
    selectedResumeName.value = ''
  } catch (error) {
    console.error(`Error deleting resume: ${error}`)
  }
}
const handleHeaderOverwrite = () => {
  confirmHeaderOverwrite.value = true
}

const overwriteCurrentResume = () => {
  try {
    resumeStore.saveState(selectedResumeName.value)
    confirmHeaderOverwrite.value = false
    // Optionally show a notification here
    console.log(`Resume overwritten under key: ${selectedResumeName.value}`)
  } catch (error) {
    console.error(`Error overwriting resume: ${error}`)
  }
}
</script>

<template>
  <div class="">
    <div class="row q-gutter-md items-center">
      <div class="col-auto">
        <q-btn color="primary" label="Save Resume" @click="openSaveDialog" />
      </div>
      <div class="col-md" style="min-width: 200px">
        <q-select
          v-model="selectedResumeName"
          :options="allResumeNames"
          dense
          label="Select Saved Resume"
          outlined
          @update:model-value="handleSelectResume"
        />
      </div>
      <div class="col-auto">
        <q-btn
          v-if="selectedResumeName"
          color="negative"
          label="Delete Resume"
          @click="handleDelete"
        />
        <q-btn
          v-if="selectedResumeName"
          color="secondary"
          outline
          label="Overwrite Resume"
          class="text-bold"
          @click="handleHeaderOverwrite"
          style="margin-left: 8px"
        />
      </div>
    </div>
    <div class="row">
      <div class="text-caption text-grey-9">
        The resume is not auto saved, please save it with a new name to create a new version.
      </div>
    </div>
  </div>

  <!-- Save dialog -->
  <q-dialog v-model="saveDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Save Your Resume</div>
        <q-input
          v-model="saveResumeName"
          autofocus
          dense
          label="Resume Name"
          outlined
          class="q-mt-md"
          :rules="[(val) => !!val.trim() || 'Name is required']"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" />
        <q-btn color="primary" flat label="Save" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Overwrite confirmation dialog -->
  <q-dialog v-model="confirmOverwrite">
    <q-card>
      <q-card-section>
        <div class="text-h6">Resume name already exists</div>
        <p>
          A resume with the name "{{ overwriteName }}" already exists. Do you want to overwrite it?
        </p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="secondary" outline label="Overwrite" @click="saveResume" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Overwrite confirmation dialog for header -->
  <q-dialog v-model="confirmHeaderOverwrite">
    <q-card>
      <q-card-section>
        <div class="text-h6">Overwrite Resume</div>
        <p>
          Are you sure you want to overwrite the current resume "<span style="font-weight: bold">{{
            selectedResumeName
          }}</span
          >" with your latest changes?
        </p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          color="secondary"
          outline
          label="Overwrite"
          @click="overwriteCurrentResume"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
