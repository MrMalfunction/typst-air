<template>
  <q-layout>
    <q-page-container>
      <q-page class="row no-wrap">
        <!-- Left side form -->
        <div class="col form-container q-pa-md">
        <div class="text-h6">Personal Information</div>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="personalInfo.name" label="Name" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="personalInfo.location" label="Location" outlined required />
            </div>
            <div class="col-12">
              <q-input v-model="personalInfo.email" label="Email" outlined required type="email" />
            </div>
            <div class="col-12">
              <q-input
                v-model="personalInfo.phone"
                label="Phone"
                outlined
                required
                mask="(###) ###-####"
              />
            </div>
            <div class="col-12">
              <q-input v-model="personalInfo.github" label="GitHub (optional)" outlined />
            </div>
            <div class="col-12">
              <q-input v-model="personalInfo.linkedin" label="LinkedIn" outlined required />
            </div>
            <div class="col-12">
              <q-input
                v-model="personalInfo.personalSite"
                label="Personal Website (optional)"
                outlined
              />
            </div>

            <!-- Education Section -->
            <div class="col-12">
              <div class="text-h6">Education</div>
              <draggable
                v-model="personalInfo.education"
                item-key="id"
                handle=".drag-handle"
                class="q-gutter-y-md"
              >
                <template #item="{ element, index }">
                  <q-card class="q-pa-md">
                    <div class="row q-col-gutter-md">
                      <div class="col-12 row items-center">
                        <q-btn flat round icon="drag_indicator" class="drag-handle" />
                        <q-btn
                          flat
                          round
                          icon="delete"
                          color="negative"
                          @click="removeEducation(index)"
                          class="q-ml-auto"
                        />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="element.institution"
                          label="Institution"
                          outlined
                          required
                        />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.location" label="Location" outlined required />
                      </div>
                      <div class="col-6">
                        <q-input v-model="element.startDate" label="Start Date" outlined required />
                      </div>
                      <div class="col-6">
                        <q-input v-model="element.endDate" label="End Date" outlined required />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.degree" label="Degree" outlined required />
                      </div>
                      <div class="col-12">
                        <div v-for="(point, pointIndex) in element.points" :key="pointIndex">
                          <div class="row q-col-gutter-sm items-center">
                            <div class="col">
                              <q-input
                                v-model="element.points[pointIndex]"
                                label="Bullet Point"
                                outlined
                                required
                                autogrow
                              />
                            </div>
                            <div class="col-auto">
                              <q-btn
                                flat
                                round
                                icon="remove"
                                color="negative"
                                @click="removeBulletPoint(index, pointIndex)"
                              />
                            </div>
                          </div>
                        </div>
                        <q-btn
                          flat
                          color="primary"
                          icon="add"
                          label="Add Bullet Point"
                          @click="addBulletPoint(index)"
                          class="q-mt-sm"
                        />
                      </div>
                    </div>
                  </q-card>
                </template>
              </draggable>
              <q-btn
                color="primary"
                icon="add"
                label="Add Education"
                @click="addEducation"
                class="q-mt-md"
              />
            </div>
          </div>
        </div>

        <!-- Right side preview -->
        <div class="col preview-container q-pa-md">
          <div ref="contentDiv" class="svg-container"></div>
          <q-btn
            color="primary"
            label="Export to PDF"
            class="q-mt-md full-width"
            @click="handleExport"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import renderUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import compileUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
import { useTypstFormatStore } from 'stores/typst-format-store'
import draggable from 'vuedraggable'

const typstFormatStore = useTypstFormatStore()
const contentDiv = ref(null)

// Default education entry template
const createDefaultEducationEntry = () => ({
  id: Date.now(),
  institution: 'Institution Name',
  location: 'Location',
  startDate: 'Start Date',
  endDate: 'End Date',
  degree: 'Degree Name',
  points: ['Achievement or responsibility 1', 'Achievement or responsibility 2'],
})

const personalInfo = reactive({
  name: 'Stephen Xu',
  location: 'San Diego, CA',
  email: 'stxu@hmc.edu',
  phone: '(555) 555-5555',
  github: 'github.com/stuxf',
  linkedin: 'linkedin.com/in/stuxf',
  personalSite: 'stuxf.dev',
  education: [
    {
      id: 1,
      institution: 'Harvey Mudd College',
      location: 'Claremont, CA',
      startDate: 'Aug 2023',
      endDate: 'May 2027',
      degree: "Bachelor's of Science, Computer Science and Mathematics",
      points: [
        'Relevant coursework: Data Structures, Algorithms, Computer Systems',
        'Member of ACM student chapter',
      ],
    },
  ],
})

const addEducation = () => {
  personalInfo.education.push(createDefaultEducationEntry())
}

const removeEducation = (index) => {
  if (personalInfo.education.length > 1) {
    personalInfo.education.splice(index, 1)
  } else {
    // If it's the last education entry, reset it to default values instead of removing
    personalInfo.education[0] = createDefaultEducationEntry()
  }
}

const addBulletPoint = (educationIndex) => {
  const newPointNumber = personalInfo.education[educationIndex].points.length + 1
  personalInfo.education[educationIndex].points.push(
    `Achievement or responsibility ${newPointNumber}`,
  )
}

const removeBulletPoint = (educationIndex, pointIndex) => {
  const points = personalInfo.education[educationIndex].points
  if (points.length > 1) {
    points.splice(pointIndex, 1)
  } else {
    // If it's the last bullet point, reset it to default value instead of removing
    points[0] = 'Achievement or responsibility 1'
  }
}

const formatTypstDate = (dateStr) => {
  return dateStr.trim() || 'Present'
}

const generateTypstContent = () => {
  const educationSection = personalInfo.education
    .map((edu) => {
      const bulletPoints = edu.points
        .filter((point) => point.trim() !== '')
        .map((point) => `       - ${point}`)
        .join('\n')

      return `
      #edu(
        institution: "${edu.institution}",
        location: "${edu.location}",
        dates: dates-helper(start-date: "${formatTypstDate(edu.startDate)}", end-date: "${formatTypstDate(edu.endDate)}"),
        degree: "${edu.degree}",
      )
      ${bulletPoints}`
    })
    .join('\n')

  return `
    ${typstFormatStore.getTypstFormat}
    #let name = "${personalInfo.name}"
    #let location = "${personalInfo.location}"
    #let email = "${personalInfo.email}"
    #let phone = "${personalInfo.phone}"
    #let github = "${personalInfo.github}"
    #let linkedin = "${personalInfo.linkedin}"
    #let personal-site = "${personalInfo.personalSite}"

    #show: resume.with(
      author: name,
      location: location,
      email: email,
      github: github,
      linkedin: linkedin,
      phone: phone,
      personal-site: personal-site,
      accent-color: "#26428b",
      font: "New Computer Modern",
      paper: "us-letter",
      author-position: center,
      personal-info-position: center,
    )

    == Education
    ${educationSection}
  `
}

const previewSvg = async () => {
  if (!contentDiv.value) return

  try {
    const typstContent = generateTypstContent()
    console.log('Generated Typst content:', typstContent)

    const svg = await $typst.svg({ mainContent: typstContent })
    console.log(`rendered! SvgElement { len: ${svg.length} }`)

    contentDiv.value.innerHTML = svg

    const svgElem = contentDiv.value.firstElementChild
    if (svgElem) {
      const width = Number.parseFloat(svgElem.getAttribute('width'))
      const height = Number.parseFloat(svgElem.getAttribute('height'))
      const cw = contentDiv.value.clientWidth - 40
      svgElem.setAttribute('width', cw)
      svgElem.setAttribute('height', (height * cw) / width)
    }
  } catch (error) {
    console.error('Error previewing SVG:', error)
  }
}

watch(
  personalInfo,
  () => {
    previewSvg()
  },
  { deep: true },
)

const exportPdf = async () => {
  const typstContent = generateTypstContent()
  const pdfData = await $typst.pdf({ mainContent: typstContent })
  const pdfFile = new Blob([pdfData], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(pdfFile)
  link.target = '_blank'
  link.click()
  URL.revokeObjectURL(link.href)
}

const handleExport = () => exportPdf()

onMounted(async () => {
  $typst.setRendererInitOptions({
    getModule: () => new URL(renderUrl, import.meta.url),
  })
  $typst.setCompilerInitOptions({
    getModule: () => new URL(compileUrl, import.meta.url),
  })

  await previewSvg()

  window.addEventListener('resize', () => previewSvg())
})
</script>

<style scoped>
.form-container,
.preview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.form-container {
  overflow-y: auto;
}

.svg-container {
  flex: 1;
  overflow: auto;
  width: 100%;
}

.drag-handle {
  cursor: move;
}
</style>
