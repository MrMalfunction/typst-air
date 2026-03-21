<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'
import { usePersonalInfoStore } from 'src/stores/personal-info-store'
import { useSummaryStore } from 'src/stores/summary-store'
import { useEducationInfoStore } from 'src/stores/education-info-store'
import { useWorkInfoStore } from 'src/stores/work-info-store'
import { useProjectInfoStore } from 'src/stores/projects-info-store'
import { useSkillsInfoStore } from 'src/stores/skills-info-store'
import { generateId } from 'src/util/id-generator.js'
import { api } from 'boot/axios'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`

const $q = useQuasar()
const isVisible = ref(false)
const isProcessing = ref(false)
const selectedFile = ref(null)

const personalInfoStore = usePersonalInfoStore()
const summaryStore = useSummaryStore()
const educationStore = useEducationInfoStore()
const workStore = useWorkInfoStore()
const projectStore = useProjectInfoStore()
const skillsStore = useSkillsInfoStore()

const openDialog = () => {
  isVisible.value = true
  selectedFile.value = null // Reset selected file when opening dialog
}

defineExpose({ openDialog })

const handleFileAdded = (files) => {
  selectedFile.value = files[0]
}

const processAndImport = async () => {
  if (!selectedFile.value) {
    $q.notify({
      type: 'negative',
      message: 'Please select a PDF file to import.',
    })
    return
  }

  isProcessing.value = true
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const pdf = await pdfjsLib.getDocument({ data: e.target.result }).promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map((item) => item.str).join(' ')
        }

        const response = await api.post('/import-resume', {
          resumeText: text,
        })

        updateStores(response.data)
        $q.notify({
          type: 'positive',
          message: 'Resume imported successfully!',
        })
        isVisible.value = false
      } catch (error) {
        console.error('Error processing PDF or calling API:', error)
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to import resume. Please try again.',
        })
      } finally {
        isProcessing.value = false
      }
    }
    reader.readAsArrayBuffer(selectedFile.value)
  } catch (error) {
    console.error('File reading error:', error)
    $q.notify({
      type: 'negative',
      message: 'Error reading the file.',
    })
    isProcessing.value = false
  }
}

const updateStores = (data) => {
  // Personal Info
  personalInfoStore.$patch({
    name: data.personalInformation.name ?? '',
    location: data.personalInformation.location ?? '',
    email: data.personalInformation.email ?? '',
    phone: data.personalInformation.phone ?? '',
    github: data.personalInformation.github ?? '',
    linkedin: data.personalInformation.linkedin ?? '',
    personalSite: data.personalInformation.website ?? '',
  })

  // Summary
  summaryStore.summary = data.summary

  // Education
  educationStore.education = data.education.map((edu, index) => ({
    id: index + 1,
    institution: edu.institution,
    degree: edu.degree,
    location: edu.location,
    startDate: edu.startDate,
    endDate: edu.endDate,
    points: [{ id: generateId(), value: edu.coursework.join(', ') }],
  }))

  // Work Experience
  workStore.work = data.workExperience.map((work, index) => ({
    id: index + 1,
    title: work.positionTitle,
    company: work.company,
    location: work.location,
    startDate: work.startDate,
    endDate: work.endDate,
    points: work.descriptions.map((desc) => ({ id: generateId(), value: desc })),
  }))

  // Projects
  projectStore.projects = data.projects.map((proj, index) => ({
    id: index + 1,
    name: proj.projectName ?? '',
    role: proj.role ?? '',
    url: proj.url ?? '',
    startDate: proj.startDate ?? '',
    endDate: proj.endDate ?? '',
    points: proj.description.map((desc) => ({ id: generateId(), value: desc })),
  }))

  // Skills
  skillsStore.skills = data.skills.map((skill, index) => ({
    id: index + 1,
    heading: skill.category,
    content: skill.skills.join(', '),
  }))
}

const onFileRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation checks`,
  })
}
</script>

<template>
  <q-dialog v-model="isVisible">
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Import Resume</div>
      </q-card-section>

      <q-card-section>
        <q-uploader
          @added="handleFileAdded"
          :max-file-size="200 * 1024"
          accept=".pdf"
          label="Drag & Drop PDF here or click to upload"
          :loading="isProcessing"
          @rejected="onFileRejected"
          :factory="() => ({ url: '' })"
          :auto-upload="false"
          :multiple="false"
          style="width: 100%"
        />
        <div class="text-caption q-mt-sm">
          We will try our best to import your resume. Max file size: 200KB. <br />
          If your resume is not imported correctly, please retry again till it you find it good
          starting point.
        </div>
        <div class="text-caption text-red q-mt-sm">
          We will use an AI provider to parse your resume, but your information is not stored on any
          server.
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          label="Import"
          color="primary"
          @click="processAndImport"
          :disable="!selectedFile || isProcessing"
          :loading="isProcessing"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
