<script setup>
import { computed, ref } from 'vue'
import { useSaveManagerStore } from 'stores/resume-store'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'

const resumeStore = useSaveManagerStore()
const saveDialog = ref(false)
const saveResumeName = ref('')
const allResumeNames = computed(() => resumeStore.getSaves)
const selectedResumeName = ref('')

const personalInfoStore = usePersonalInfoStore()

const openSaveDialog = () => {
  saveResumeName.value = personalInfoStore.name // default name; user can change it
  saveDialog.value = true
}

const handleSave = () => {
  try {
    // Use the name provided in the dialog to save the resume.
    resumeStore.saveState(saveResumeName.value)
    console.log(`Resume saved under key: ${saveResumeName.value}`)
    saveDialog.value = false
    // Update selectedResumeName so that the QSelect reflects the new entry.
    selectedResumeName.value = saveResumeName.value
  } catch (error) {
    console.error(`Error saving resume: ${error}`)
  }
}

const handleSelectResume = (name) => {
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
      </div>
    </div>
    <div class="row">
      <div class="text-caption text-grey-9">
        The resume is not auto saved, please save it with the same name to update it.
      </div>
    </div>
  </div>
  <q-dialog v-model="saveDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Enter Resume Name</div>
        <q-input v-model="saveResumeName" autofocus dense label="Resume Name" outlined />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" />
        <q-btn color="primary" flat label="Save" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
