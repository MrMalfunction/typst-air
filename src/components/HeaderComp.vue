<template>
  <div class="bg-primary text-white q-pa-md">
    <q-toolbar>
      <q-toolbar-title>AI Resume</q-toolbar-title>

      <q-btn
        flat
        href="https://amolbohora.userjot.com/board/all"
        label="Feedback"
        target="_blank"
        type="a"
      />
      <q-btn flat label="FAQ" @click="faqDialog = true" />
      <q-btn flat label="Import Resume" @click="openImportDialog" />
      <q-space />
      <DarkModeToggle />
    </q-toolbar>
  </div>

  <q-dialog v-model="faqDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Frequently Asked Questions</div>
      </q-card-section>
      <q-card-section class="q-gutter-y-md">
        <div class="text-subtitle2">How does the AI enhancement feature work?</div>
        <p>
          Click the AI button next to your work experience or projects to fine-tune your bullet
          points for specific job descriptions.
        </p>

        <div class="text-subtitle2">Can I export my resume?</div>
        <p>
          Yes, you can preview your resume in real-time and export it as a PDF using the "Export to
          PDF" button.
        </p>

        <div class="text-subtitle2">Will I lose my data if I refresh the page?</div>
        <p>Yes, please save your resume.</p>

        <div class="text-subtitle2">Can I reorder sections?</div>
        <p>
          Yes, use the drag handle icon (≡) to reorder entries within work experience, education,
          and projects sections.
        </p>

        <div class="text-subtitle2">How do I undo original bullet points?</div>
        <p>
          Click the undo icon next to the AI button to revert any section's bullet points to their
          original state.
        </p>

        <div class="text-subtitle2">Is my data shared</div>
        <p>
          No, all of the data lives in your browser. If you use AI Features I keep the logs for
          performance and usage analytics. I will never share or sell any information stored.
        </p>

        <div class="text-subtitle2">Any Questions/Feedbacks</div>
        <p>
          Please provide your feedback on this
          <a href="https://amolbohora.userjot.com/board/all" target="_blank"> page</a>
        </p>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup color="primary" flat label="Close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <ImportResumePopup ref="importResumePopup" />
</template>

<script setup>
import { ref } from 'vue'
import ImportResumePopup from 'src/components/ImportResumePopup.vue'
import DarkModeToggle from './_DarkModeToggle.vue'

const faqDialog = ref(false)
const importResumePopup = ref(null)

const openImportDialog = () => {
  if (importResumePopup.value) {
    importResumePopup.value.openDialog()
  }
}
</script>
