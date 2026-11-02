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

        <div class="text-subtitle2">Is my data shared</div>
        <p>
          No, all of the data lives in your browser and is never sent to a server. I will never
          share or sell any information.
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
</template>

<script setup>
import { ref } from 'vue'
import DarkModeToggle from './_DarkModeToggle.vue'

const faqDialog = ref(false)
</script>
