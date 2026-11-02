<script setup>
import { computed, ref } from 'vue'
import { Notify, copyToClipboard, exportFile } from 'quasar'
import { storeToRefs } from 'pinia'
import { useSaveManagerStore } from 'stores/resume-store'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { applyResume, exportResume, parseResumeJson, resumeLink } from 'src/util/resume-json.js'

const resumeStore = useSaveManagerStore()
const saveDialog = ref(false)
const saveResumeName = ref('')
const allResumeNames = computed(() => resumeStore.getSaves)
const { currentName: selectedResumeName } = storeToRefs(resumeStore)
const confirmOverwrite = ref(false)
const overwriteName = ref('')

const personalInfoStore = usePersonalInfoStore()

const notifySaved = (name) => {
  Notify.create({ type: 'positive', message: `Saved “${name}”`, timeout: 1200, position: 'top' })
}

// Ask for a name: first save of a new resume, or "Save as copy"
const openSaveDialog = () => {
  saveResumeName.value = selectedResumeName.value
    ? `${selectedResumeName.value} (copy)`
    : personalInfoStore.name || 'My Resume' // default name; user can change it
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
    resumeStore.saveState(saveResumeName.value)
    saveDialog.value = false
    confirmOverwrite.value = false
    // The new save becomes the current resume
    selectedResumeName.value = saveResumeName.value
    notifySaved(saveResumeName.value)
  } catch (error) {
    console.error(`Error saving resume: ${error}`)
  }
}

// Default Save action: overwrite the current resume, or name it if it's new
const handlePrimarySave = () => {
  if (!selectedResumeName.value) {
    openSaveDialog()
    return
  }

  try {
    resumeStore.saveState(selectedResumeName.value)
    notifySaved(selectedResumeName.value)
  } catch (error) {
    console.error(`Error overwriting resume: ${error}`)
  }
}

const loadResume = (name) => {
  try {
    resumeStore.restoreState(name)
    selectedResumeName.value = name
  } catch (error) {
    console.error(`Error loading resume from key: ${name} with error ${error}`)
  }
}

const handleDelete = () => {
  try {
    resumeStore.deleteSave(selectedResumeName.value)
    selectedResumeName.value = ''
  } catch (error) {
    console.error(`Error deleting resume: ${error}`)
  }
}

// JSON import / export and share links (format documented in public/llms.txt)
const fileInput = ref(null)

const fileBaseName = () =>
  (personalInfoStore.name.trim() || 'resume').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

const downloadJson = () => {
  const json = JSON.stringify(exportResume(), null, 2)
  exportFile(`${fileBaseName()}.resume.json`, json, { mimeType: 'application/json' })
}

const copyLink = async () => {
  try {
    await copyToClipboard(resumeLink(exportResume()))
    Notify.create({
      type: 'positive',
      message: 'Link copied. Anyone who opens it gets this resume in their editor.',
      timeout: 2500,
      position: 'top',
    })
  } catch {
    Notify.create({ type: 'negative', message: "Couldn't copy the link", position: 'top' })
  }
}

const importJsonFile = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = '' // allow picking the same file again
  if (!file) return

  try {
    if (file.size > 200_000) throw new Error('This file is too large to be a resume')
    applyResume(parseResumeJson(await file.text()))
    selectedResumeName.value = ''
    Notify.create({
      type: 'positive',
      message: `Imported “${file.name}”. Save it to keep it.`,
      position: 'top',
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: `Couldn't import “${file.name}”: ${error.message}`,
      position: 'top',
      timeout: 6000,
    })
  }
}
</script>

<template>
  <div class="row items-center no-wrap q-gutter-x-sm save-bar">
    <!-- Load: list of saved resumes -->
    <q-btn dense flat icon="folder_open" icon-right="arrow_drop_down" label="Load" no-caps>
      <q-badge
        v-if="allResumeNames.length"
        class="q-ml-xs"
        color="grey-6"
        rounded
        :label="allResumeNames.length"
      />

      <q-menu anchor="bottom left" self="top left">
        <q-list dense style="min-width: 240px">
          <q-item-label header>Saved resumes</q-item-label>
          <q-item
            v-for="name in allResumeNames"
            :key="name"
            v-close-popup
            :active="name === selectedResumeName"
            clickable
            @click="loadResume(name)"
          >
            <q-item-section avatar><q-icon name="description" /></q-item-section>
            <q-item-section class="ellipsis">{{ name }}</q-item-section>
          </q-item>
          <q-item v-if="!allResumeNames.length">
            <q-item-section class="text-grey-7">
              Nothing saved yet. Use Save to keep this resume.
            </q-item-section>
          </q-item>

          <q-separator />
          <q-item v-close-popup clickable @click="fileInput.click()">
            <q-item-section avatar><q-icon name="upload_file" /></q-item-section>
            <q-item-section>Import JSON file…</q-item-section>
          </q-item>

          <template v-if="selectedResumeName">
            <q-separator />
            <q-item v-close-popup clickable class="text-negative" @click="handleDelete">
              <q-item-section avatar><q-icon name="delete_outline" /></q-item-section>
              <q-item-section>Delete “{{ selectedResumeName }}”</q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-menu>
    </q-btn>
    <input
      ref="fileInput"
      accept="application/json,.json"
      class="hidden"
      type="file"
      @change="importJsonFile"
    />

    <!-- Save: overwrite current (default) or save as a copy -->
    <q-btn-dropdown
      split
      unelevated
      no-caps
      dense
      color="primary"
      icon="save"
      label="Save"
      class="q-px-xs"
      @click="handlePrimarySave"
    >
      <q-list dense style="min-width: 200px">
        <q-item v-close-popup clickable @click="openSaveDialog">
          <q-item-section avatar><q-icon name="content_copy" /></q-item-section>
          <q-item-section>Save as copy…</q-item-section>
        </q-item>
        <q-separator />
        <q-item v-close-popup clickable @click="downloadJson">
          <q-item-section avatar><q-icon name="data_object" /></q-item-section>
          <q-item-section>Download JSON</q-item-section>
        </q-item>
        <q-item v-close-popup clickable @click="copyLink">
          <q-item-section avatar><q-icon name="link" /></q-item-section>
          <q-item-section>Copy link</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <div class="text-caption text-grey-7 ellipsis">
      <template v-if="selectedResumeName">Editing “{{ selectedResumeName }}”</template>
      <template v-else>Not saved yet</template>
      <q-tooltip>Changes aren't saved automatically. Use Save to keep them.</q-tooltip>
    </div>
  </div>

  <!-- Name dialog (first save / save as copy) -->
  <q-dialog v-model="saveDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">{{ selectedResumeName ? 'Save as copy' : 'Save your resume' }}</div>
        <q-input
          v-model="saveResumeName"
          autofocus
          dense
          label="Resume Name"
          outlined
          class="q-mt-md"
          :rules="[(val) => !!val.trim() || 'Name is required']"
          @keyup.enter="handleSave"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" />
        <q-btn color="primary" flat label="Save" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Name already taken -->
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
</template>

<style scoped>
.save-bar {
  min-width: 0;
}
</style>
