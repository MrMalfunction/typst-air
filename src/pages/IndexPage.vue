<template>
  <q-layout>
    <q-page-container>
      <q-page class="row no-wrap">
        <!-- Left side form -->
        <div class="col form-container q-pa-md">
          <!-- Save Resume Controls - moved from header to top of form -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-btn
                class="full-width"
                color="primary"
                label="Save Resume"
                @click="openSaveDialog"
              />
            </div>
            <div class="col-6">
              <!-- Dropdown to list resume names -->
              <q-select
                v-model="selectedResumeName"
                :options="allResumeNames"
                dense
                label="Select Saved Resume"
                outlined
                @update:model-value="handleSelectResume"
              />
            </div>
          </div>

          <div class="text-h6">Personal Information</div>
          <div class="row q-col-gutter-md">
            <PersonalInfoComp />
            <EduInfoComp />
            <WorkInfoComp />
            <ProjectInfoComp />
            <SkillsInfoComp />
          </div>
        </div>
        <PreviewSVG />
      </q-page>
    </q-page-container>

    <!-- Dialog for asking a name for saving a resume -->
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
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useResumeStore } from 'stores/resume-store'
import PersonalInfoComp from 'components/PersonalInfoComp.vue'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import EduInfoComp from 'components/EduInfoComp.vue'
import WorkInfoComp from 'components/WorkInfoComp.vue'
import ProjectInfoComp from 'components/ProjectinfoComp.vue'
import SkillsInfoComp from 'components/SkillsInfoComp.vue'
import PreviewSVG from 'components/PreviewSVG.vue'

const resumeStore = useResumeStore() // initialize the resume store
const personalInfoStore = usePersonalInfoStore()

// New reactive variables for saving resume
const saveDialog = ref(false)
const saveResumeName = ref('')

// Selected resume name for loading
const selectedResumeName = ref('')
const allResumeNames = computed(() => resumeStore.getAllResumeNames())

const openSaveDialog = () => {
  saveResumeName.value = personalInfoStore.name // default name; user can change it
  saveDialog.value = true
}

const handleSave = () => {
  // Use the name provided in the dialog to save the resume.
  resumeStore.saveResume(saveResumeName.value, JSON.stringify(personalInfoStore))
  console.log(`Resume saved under key: ${saveResumeName.value}`)
  saveDialog.value = false
  // Update selectedResumeName so that the QSelect reflects the new entry.
  selectedResumeName.value = saveResumeName.value
}

// When the user selects a resume name from the dropdown, load that resume.
const handleSelectResume = (name) => {
  if (name) {
    const savedData = resumeStore.loadResume(name)
    if (savedData) {
      Object.assign(personalInfoStore, JSON.parse(savedData))
      console.log(`Resume loaded for key: ${name}`)
    } else {
      console.warn(`No resume found for key: ${name}`)
    }
  }
}
</script>

<style scoped>
.form-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.form-container {
  overflow-y: auto;
}
</style>
