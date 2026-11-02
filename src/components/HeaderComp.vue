<template>
  <q-toolbar :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'" class="text-white app-header">
    <q-toolbar-title class="text-weight-medium">AI Resume</q-toolbar-title>

    <q-btn flat dense round icon="help_outline">
      <q-menu anchor="bottom right" self="top right">
        <q-list dense style="min-width: 180px">
          <q-item v-close-popup clickable @click="faqDialog = true">
            <q-item-section avatar><q-icon name="quiz" /></q-item-section>
            <q-item-section>FAQ</q-item-section>
          </q-item>
          <q-item
            v-close-popup
            clickable
            href="https://amolbohora.userjot.com/board/all"
            tag="a"
            target="_blank"
          >
            <q-item-section avatar><q-icon name="feedback" /></q-item-section>
            <q-item-section>Feedback</q-item-section>
          </q-item>
          <q-item v-close-popup clickable to="/acknowledgments">
            <q-item-section avatar><q-icon name="info_outline" /></q-item-section>
            <q-item-section>Acknowledgments</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <DarkModeToggle />
  </q-toolbar>

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
          Yes. Use the ↑ ↓ arrows next to a section's title to move the whole section, and the drag
          handle (⠿) on an entry to reorder entries within a section.
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

<style scoped>
.app-header {
  min-height: 48px;
}
</style>
