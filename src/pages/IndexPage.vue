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
            <!-- Work Experience Section -->
            <div class="col-12">
              <div class="text-h6">Work Experience</div>
              <draggable
                v-model="personalInfo.work"
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
                          @click="removeWork(index)"
                          class="q-ml-auto"
                        />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.title" label="Position Title" outlined required />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.company" label="Company" outlined required />
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
                        <div v-for="(point, pointIndex) in element.points" :key="pointIndex">
                          <div class="row q-col-gutter-sm items-center q-mb-sm">
                            <div class="col">
                              <q-editor
                                v-model="element.points[pointIndex]"
                                :toolbar="[['bold'], ['link'], ['undo', 'redo']]"
                                :fonts="{ arial: 'Arial' }"
                                content-class="editor-content"
                                min-height="5rem"
                              />
                            </div>
                            <div class="col-auto">
                              <q-btn
                                flat
                                round
                                icon="remove"
                                color="negative"
                                @click="removeWorkBulletPoint(index, pointIndex)"
                              />
                            </div>
                          </div>
                        </div>
                        <q-btn
                          flat
                          color="primary"
                          icon="add"
                          label="Add Bullet Point"
                          @click="addWorkBulletPoint(index)"
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
                label="Add Work Experience"
                @click="addWork"
                class="q-mt-md"
              />
            </div>
            <div class="col-12">
              <div class="text-h6">Projects</div>
              <draggable
                v-model="personalInfo.projects"
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
                          @click="removeProject(index)"
                          class="q-ml-auto"
                        />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.name" label="Project Name" outlined required />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.role" label="Role (Optional)" outlined />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.url" label="Project URL (Optional)" outlined />
                      </div>
                      <div class="col-6">
                        <q-input v-model="element.startDate" label="Start Date" outlined required />
                      </div>
                      <div class="col-6">
                        <q-input v-model="element.endDate" label="End Date" outlined required />
                      </div>
                      <div class="col-12">
                        <div v-for="(point, pointIndex) in element.points" :key="pointIndex">
                          <div class="row q-col-gutter-sm items-center q-mb-sm">
                            <div class="col">
                              <q-editor
                                v-model="element.points[pointIndex]"
                                :toolbar="[['bold'], ['link'], ['undo', 'redo']]"
                                :fonts="{ arial: 'Arial' }"
                                content-class="editor-content"
                                min-height="5rem"
                              />
                            </div>
                            <div class="col-auto">
                              <q-btn
                                flat
                                round
                                icon="remove"
                                color="negative"
                                @click="removeProjectBulletPoint(index, pointIndex)"
                              />
                            </div>
                          </div>
                        </div>
                        <q-btn
                          flat
                          color="primary"
                          icon="add"
                          label="Add Bullet Point"
                          @click="addProjectBulletPoint(index)"
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
                label="Add Project"
                @click="addProject"
                class="q-mt-md"
              />
            </div>
            <div class="col-12">
              <div class="text-h6">Skills</div>
              <draggable
                v-model="personalInfo.skills"
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
                          @click="removeSkill(index)"
                          class="q-ml-auto"
                        />
                      </div>
                      <div class="col-12">
                        <q-input v-model="element.heading" label="Category" outlined required />
                      </div>
                      <div class="col-12">
                        <q-input
                          v-model="element.content"
                          label="Skills (comma-separated)"
                          outlined
                          required
                          autogrow
                          type="textarea"
                          hint="Enter skills separated by commas"
                        />
                      </div>
                    </div>
                  </q-card>
                </template>
              </draggable>
              <q-btn
                color="primary"
                icon="add"
                label="Add Skill Category"
                @click="addSkill"
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
import {
  escapeTypstSpecialChars,
  convertBoldHtmlToTypstBold,
  convertHtmlToTypstLink,
} from '../util/typst_conv.js'

const typstFormatStore = useTypstFormatStore()
const contentDiv = ref(null)

const createDefaultWorkEntry = () => ({
  id: Date.now(),
  title: 'Position Title',
  company: 'Company Name',
  location: 'Location',
  startDate: 'Start Date',
  endDate: 'End Date',
  points: ['Key achievement or responsibility 1', 'Key achievement or responsibility 2'],
})

const createDefaultProjectEntry = () => ({
  id: Date.now(),
  name: 'Project Name',
  role: 'Role (Optional)',
  startDate: 'Start Date',
  endDate: 'End Date',
  url: 'project-url.com',
  points: ['Key achievement or responsibility 1', 'Key achievement or responsibility 2'],
})

const addWork = () => {
  personalInfo.work.push(createDefaultWorkEntry())
}

const removeWork = (index) => {
  if (personalInfo.work.length > 1) {
    personalInfo.work.splice(index, 1)
  } else {
    personalInfo.work[0] = createDefaultWorkEntry()
  }
}

const addWorkBulletPoint = (workIndex) => {
  const newPointNumber = personalInfo.work[workIndex].points.length + 1
  personalInfo.work[workIndex].points.push(`Key achievement or responsibility ${newPointNumber}`)
}

const removeWorkBulletPoint = (workIndex, pointIndex) => {
  const points = personalInfo.work[workIndex].points
  if (points.length > 1) {
    points.splice(pointIndex, 1)
  } else {
    points[0] = 'Key achievement or responsibility 1'
  }
}

// Helper function to format bullet points
const formatBulletPoint = (point) => {
  // First escape special Typst characters
  let formatted = escapeTypstSpecialChars(point)
  // Convert HTML bold to Typst bold
  formatted = convertBoldHtmlToTypstBold(formatted)
  // Convert HTML links to Typst links
  formatted = convertHtmlToTypstLink(formatted)
  return formatted
}

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

const createDefaultSkillEntry = () => ({
  id: Date.now(),
  heading: 'New Category',
  content: 'Skill 1, Skill 2, Skill 3',
})

const addSkill = () => {
  personalInfo.skills.push(createDefaultSkillEntry())
}

const removeSkill = (index) => {
  if (personalInfo.skills.length > 1) {
    personalInfo.skills.splice(index, 1)
  } else {
    personalInfo.skills[0] = createDefaultSkillEntry()
  }
}

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
  work: [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Company',
      location: 'San Francisco, CA',
      startDate: 'Jan 2023',
      endDate: 'Present',
      points: ['Led development of core platform features', 'Managed team of 3 junior developers'],
    },
  ],
  projects: [
    {
      id: 1,
      name: 'Hyperschedule',
      role: 'Maintainer',
      startDate: 'Nov 2023',
      endDate: 'Present',
      url: 'hyperschedule.io',
      points: [
        'Maintain open-source scheduler used by 7000+ users at the Claremont Consortium with TypeScript, React and MongoDB',
        'Manage PR reviews, bug fixes, and coordinate with college for releasing scheduling data and over $1500 of yearly funding',
        'Ensure 99.99% uptime during peak loads of 1M daily requests during course registration through redundant servers',
      ],
    },
  ],
  skills: [
    {
      id: 1,
      heading: 'Programming Languages',
      content: 'JavaScript, Python, C/C++, HTML/CSS, Java, Bash, R, Flutter, Dart',
    },
    {
      id: 2,
      heading: 'Technologies',
      content:
        'React, Astro, Svelte, Tailwind CSS, Git, UNIX, Docker, Caddy, NGINX, Google Cloud Platform',
    },
  ],
})

const addProject = () => {
  personalInfo.projects.push(createDefaultProjectEntry())
}

const removeProject = (index) => {
  if (personalInfo.projects.length > 1) {
    personalInfo.projects.splice(index, 1)
  } else {
    personalInfo.projects[0] = createDefaultProjectEntry()
  }
}

const addProjectBulletPoint = (projectIndex) => {
  const newPointNumber = personalInfo.projects[projectIndex].points.length + 1
  personalInfo.projects[projectIndex].points.push(
    `Key achievement or responsibility ${newPointNumber}`,
  )
}

const removeProjectBulletPoint = (projectIndex, pointIndex) => {
  const points = personalInfo.projects[projectIndex].points
  if (points.length > 1) {
    points.splice(pointIndex, 1)
  } else {
    points[0] = 'Key achievement or responsibility 1'
  }
}

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

  const workSection = personalInfo.work
    .map((work) => {
      const bulletPoints = work.points
        .filter((point) => point.trim() !== '')
        .map((point) => `       - ${formatBulletPoint(point)}`)
        .join('\n')

      return `
        #work(
          title: "${work.title}",
          company: "${work.company}",
          location: "${work.location}",
          dates: dates-helper(start-date: "${formatTypstDate(work.startDate)}", end-date: "${formatTypstDate(work.endDate)}"),
        )
        ${bulletPoints}`
    })
    .join('\n')

  const projectsSection = personalInfo.projects
    .map((project) => {
      const bulletPoints = project.points
        .filter((point) => point.trim() !== '')
        .map((point) => `       - ${formatBulletPoint(point)}`)
        .join('\n')

      return `
          #project(
            name: "${project.name}",
            role: "${project.role}",
            dates: dates-helper(start-date: "${formatTypstDate(project.startDate)}", end-date: "${formatTypstDate(project.endDate)}"),
            url: "${project.url}",
          )
          ${bulletPoints}`
    })
    .join('\n')

  const skillsSection = personalInfo.skills
    .map((skill) => `- *${skill.heading}*: ${skill.content}`)
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

    == Work Experience
    ${workSection}

    == Projects
    ${projectsSection}

    == Skills
        ${skillsSection}
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

.editor-content {
  min-height: 5rem;
}

.q-editor {
  border-radius: 4px;
}

.skills-input :deep(.q-field__native) {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
