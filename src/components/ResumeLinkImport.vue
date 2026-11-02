<script setup>
// Opens a resume carried in a `#resume=<url-encoded JSON>` link (see
// public/llms.txt). The fragment never reaches a server. The user always
// confirms before the editor is replaced.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Notify } from 'quasar'
import { useSaveManagerStore } from 'stores/resume-store'
import {
  LINK_PREFIX,
  applyResume,
  parseResumeJson,
  resumeJsonFromHash,
} from 'src/util/resume-json.js'

const resumeStore = useSaveManagerStore()
const pending = ref(null)
const open = ref(false)

const countLabel = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

const checkHash = () => {
  if (!window.location.hash.startsWith(LINK_PREFIX)) return
  try {
    pending.value = parseResumeJson(resumeJsonFromHash(window.location.hash))
    open.value = true
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: `Couldn't open the resume in this link: ${error.message}`,
      position: 'top',
      timeout: 6000,
    })
  } finally {
    // Drop the data from the address bar so a reload doesn't ask again
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

const confirmImport = () => {
  applyResume(pending.value)
  resumeStore.currentName = ''
  open.value = false
  Notify.create({
    type: 'positive',
    message: 'Resume opened from link. Save it to keep it.',
    position: 'top',
  })
}

onMounted(() => {
  checkHash()
  window.addEventListener('hashchange', checkHash)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', checkHash))
</script>

<template>
  <q-dialog v-model="open" persistent>
    <q-card v-if="pending" style="min-width: 360px; max-width: 480px">
      <q-card-section>
        <div class="text-h6">Open resume from link?</div>
        <p class="q-mt-sm q-mb-none">
          This link contains a resume for
          <b>{{ pending.personal.name || 'an unnamed person' }}</b>
          ({{ countLabel(pending.work.length, 'job') }},
          {{ countLabel(pending.projects.length, 'project') }},
          {{ countLabel(pending.education.length, 'school') }}).
        </p>
        <p class="text-caption text-grey-7 q-mt-sm q-mb-none">
          It replaces what's in the editor now. Your saved resumes aren't affected.
        </p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cancel" no-caps />
        <q-btn color="primary" label="Open resume" no-caps unelevated @click="confirmImport" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
